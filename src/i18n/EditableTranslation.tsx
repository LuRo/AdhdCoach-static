import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { saveTranslation } from "./api/saveTranslation";
import { useTranslationEditMode } from "./TranslationEditModeContext";
import { updateI18nextResource } from "./updateI18nextResource";

type EditableTranslationProps = {
  i18nKey: string;
  defaultText: string;
  ns?: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
};

const MULTILINE_THRESHOLD = 60;

const buildTestIdKey = (key: string) => {
  const sanitized = key.replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return sanitized.length > 0 ? sanitized : "translation";
};

export const EditableTranslation = ({
  i18nKey,
  defaultText,
  ns = "translation",
  className,
  tag = "span"
}: EditableTranslationProps) => {
  const { i18n, t } = useTranslation(ns);
  const { enabled } = useTranslationEditMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(defaultText);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorId = useId();
  const WrapperTag = tag;

  const translatedText = useMemo(() => {
    const literalValue = t(i18nKey, {
      ns,
      defaultValue: defaultText,
      keySeparator: false,
      nsSeparator: false
    });

    if (!i18nKey.includes(".")) {
      return literalValue;
    }

    const missingSentinel = `__missing_${i18nKey}__`;
    const nestedValue = t(i18nKey, {
      ns,
      defaultValue: missingSentinel,
      keySeparator: ".",
      nsSeparator: false
    });

    return nestedValue === missingSentinel ? literalValue : nestedValue;
  }, [defaultText, i18nKey, ns, t]);

  const openEditor = () => {
    if (!enabled) {
      return;
    }

    setDraft(translatedText);
    setError(null);
    setEditing(true);
  };

  const closeEditor = () => {
    setDraft(translatedText);
    setError(null);
    setEditing(false);
    setIsSaving(false);
  };

  const handleSave = async () => {
    const value = draft.trim();
    const lng = i18n.resolvedLanguage ?? i18n.language;

    setError(null);
    setIsSaving(true);

    try {
      await saveTranslation({
        lng,
        ns,
        key: i18nKey,
        value
      });

      updateI18nextResource(i18n, lng, ns, i18nKey, value);
      setEditing(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save translation.");
    } finally {
      setIsSaving(false);
    }
  };

  const isMultiline = draft.length > MULTILINE_THRESHOLD || draft.includes("\n") || translatedText.includes("\n");
  const testIdKey = buildTestIdKey(i18nKey);

  const handleEditorKeyDown = async (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeEditor();
      return;
    }

    if (!isMultiline && event.key === "Enter") {
      event.preventDefault();
      if (!isSaving) {
        await handleSave();
      }
    }
  };

  if (!enabled) {
    return (
      <WrapperTag className={className} data-testid={`editable-translation-${testIdKey}`}>
        {translatedText}
      </WrapperTag>
    );
  }

  if (!editing) {
    return (
      <WrapperTag className={["editable-translation", className].filter(Boolean).join(" ")} data-testid={`editable-translation-${testIdKey}`}>
        <span
          onDoubleClick={openEditor}
          role="button"
          tabIndex={0}
          className="editable-translation-text"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openEditor();
            }
          }}
        >
          {translatedText}
        </span>
        <button
          type="button"
          className="editable-translation-edit-button"
          onClick={openEditor}
          aria-label={`Edit translation ${i18nKey}`}
          data-testid={`editable-translation-edit-${testIdKey}`}
        >
          <i className="bi bi-pencil editable-translation-edit-icon" aria-hidden="true" />
        </button>
      </WrapperTag>
    );
  }

  return (
    <span className={["editable-translation-editor-shell", className].filter(Boolean).join(" ")} data-testid={`editable-translation-editor-${testIdKey}`}>
      <label htmlFor={editorId} className="visually-hidden">
        Edit translation {i18nKey}
      </label>

      {isMultiline ? (
        <textarea
          id={editorId}
          className="form-control"
          value={draft}
          rows={3}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleEditorKeyDown}
          data-testid={`editable-translation-textarea-${testIdKey}`}
          disabled={isSaving}
        />
      ) : (
        <input
          id={editorId}
          className="form-control"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleEditorKeyDown}
          data-testid={`editable-translation-input-${testIdKey}`}
          disabled={isSaving}
        />
      )}

      <div className="editable-translation-actions">
        <button
          type="button"
          className="btn btn-sm btn-purple"
          onClick={() => {
            void handleSave();
          }}
          disabled={isSaving}
          data-testid={`editable-translation-save-${testIdKey}`}
        >
          {isSaving ? t("Saving...", { defaultValue: "Saving...", keySeparator: false, nsSeparator: false }) : t("Save", { defaultValue: "Save", keySeparator: false, nsSeparator: false })}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={closeEditor}
          disabled={isSaving}
          data-testid={`editable-translation-cancel-${testIdKey}`}
        >
          {t("Cancel", { defaultValue: "Cancel", keySeparator: false, nsSeparator: false })}
        </button>
      </div>

      {error ? (
        <div className="text-danger small" data-testid={`editable-translation-error-${testIdKey}`}>
          {error}
        </div>
      ) : null}
    </span>
  );
};
