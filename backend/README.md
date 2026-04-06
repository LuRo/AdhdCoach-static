# Translation API (PHP)

This backend provides a minimal translation store for UI labels.

## Endpoints

- `GET /api/v1/translations/{lng}/{ns}`
- `PUT /api/v1/translations/{lng}/{ns}`

Examples:

- `GET http://localhost:8082/api/v1/translations/de/settings`
- `PUT http://localhost:8082/api/v1/translations/de/settings`

## Payload format

`PUT` accepts either:

```json
{
  "translations": {
    "common.save": "Speichern",
    "common.cancel": "Abbrechen"
  }
}
```

or a plain object of key/value pairs.

Values set to `null` remove the key.

## Storage format

Translations are stored as UTF-8 JSON files under:

- `backend/storage/translations/{lng}/{ns}.json`

Keys are flat dot keys.

## Namespace strategy

Use namespaces by feature or UI domain, for example:

- `common`
- `navigation`
- `morning`
- `today`
- `debriefing`
- `settings`

## Migrate `ui.ts` to backend storage

Run:

```bash
npm run i18n:migrate-ui-to-backend
```

This script reads `src/i18n/ui.ts` and writes per-locale, per-domain namespace files such as:

- `backend/storage/translations/de/planner.json`
- `backend/storage/translations/fr/debriefingPage.json`

## Run locally

```bash
php -S localhost:8082 -t backend/public
```

## Frontend base URL

The frontend uses:

- `VITE_TRANSLATIONS_API_BASE_URL`

Default is `http://localhost:8082`.
