# Translation Inline Edit Mode (i18next/react-i18next)

## Summary
Implement a reusable `EditableTranslation` component plus a global edit-mode context that keeps normal `t("...")` behavior unchanged for regular users and enables inline admin/dev edits when toggled on.
Edits are saved via `POST /api/translations`, then applied to i18next in-memory immediately so UI updates without reload.

## Implementation Changes
1. **Global edit mode state**
   - Add a small `TranslationEditModeContext` with:
     - `enabled`
     - `setEnabled`
   - Persist toggle in `localStorage` (reuse existing translation-enabled storage key to avoid duplicate settings).
   - Mount provider inside existing i18n provider tree so all pages can access mode.
   - Add `TranslationEditToggle` component (switch UI + `data-testid`) and place it in **Settings page only** for initial rollout.

2. **Backend API helper**
   - Add `saveTranslation({ lng, ns, key, value })` helper using `fetch`:
     - `POST /api/translations`
     - JSON body `{ lng, ns, key, value }`
     - `Content-Type: application/json`
     - throws clear error message on non-OK responses (prefer backend message when present).
   - Keep helper isolated so auth headers can be added later in one place.

3. **Reusable `EditableTranslation` component**
   - Create component with props:
     - `i18nKey`, `defaultText`, `ns = "translation"`, `className`, `tag = "span"`
   - Normal mode (`enabled === false`):
     - render translated text only.
   - Edit mode (`enabled === true`):
     - display text with edit affordance (double-click and small edit button).
     - when editing:
       - single-line `<input>` for short text, `<textarea>` for long/multiline text.
       - `Save` + `Cancel` actions.
       - keyboard:
         - `Enter` saves for single-line input
         - `Escape` cancels
   - Save behavior:
     - call `saveTranslation(...)`
     - on success update i18next runtime resource and rerender immediately
     - exit edit mode
   - Cancel behavior:
     - restore original translated value and exit edit mode
   - Include loading/error UI and `data-testid` attributes for all key states/actions.

4. **Runtime i18next update (dot-key safe)**
   - Add utility used by `EditableTranslation`:
     - read current bundle for `lng/ns`
     - set nested value for dot paths (`common.save`, `dashboard.header.title`)
     - re-register bundle with merge/overwrite so change is immediately available via `t(...)`
   - Keep current i18next architecture intact (no re-init, no key migration).

5. **Integration examples**
   - Add example usages on one existing page (Settings + one live content area) using:
     - `<EditableTranslation i18nKey="common.save" defaultText="Save" />`
     - `<EditableTranslation i18nKey="auth.login.title" defaultText="Sign in" tag="h1" />`
     - `<EditableTranslation i18nKey="form.description" defaultText="Please fill out all required fields." />`
   - Keep all existing `useTranslation` and `t(...)` usage working unchanged; only wrap selected labels/components where inline editing is needed.

## Public Interfaces / Contracts
- **Frontend context API**
  - `useTranslationEditMode() -> { enabled, setEnabled }`
- **Frontend component API**
  - `EditableTranslation({ i18nKey, defaultText, ns?, className?, tag? })`
- **Backend request contract**
  - `POST /api/translations`
  - Body:
    ```json
    {
      "lng": "de",
      "ns": "translation",
      "key": "common.save",
      "value": "Speichern"
    }
    ```

## Test Plan
1. **Mode behavior**
   - toggle off: text renders normally, no edit interaction.
   - toggle on: edit icon/double-click opens editor.
2. **Edit flow**
   - save success: request sent, loading shown, text updates immediately, exits edit mode.
   - cancel: value reverts, exits edit mode, no request.
   - error path: error message shown, remains editable.
3. **Keyboard/accessibility**
   - `Enter` saves single-line editor.
   - `Escape` cancels from input/textarea.
   - buttons and fields have deterministic `data-testid`.
4. **Key handling**
   - dot keys update correctly and are readable via regular `t("dot.path")` afterward.
5. **Regression checks**
   - existing non-editable translations and routing/pages remain unchanged.

## Assumptions and Defaults
- Implementation will be in existing `.tsx` codebase style.
- Toggle is initially exposed in **Settings page only**.
- Endpoint is `/api/translations` without extra auth/CSRF requirements for now.
- Styling remains minimal and compatible with existing Bootstrap-based UI.
- Existing `InlineTranslationText` will be replaced or left as legacy only where no longer needed, with minimal surface changes.
