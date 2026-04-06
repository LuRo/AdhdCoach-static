# Translation API Example Contract

## Request
`POST /api/translations`

```json
{
  "lng": "de",
  "ns": "translation",
  "key": "common.save",
  "value": "Speichern"
}
```

## Success response
```json
{
  "ok": true
}
```

## Minimal PHP endpoint example
```php
<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$lng = isset($data['lng']) ? trim((string) $data['lng']) : '';
$ns = isset($data['ns']) ? trim((string) $data['ns']) : '';
$key = isset($data['key']) ? trim((string) $data['key']) : '';
$value = isset($data['value']) ? (string) $data['value'] : '';

if ($lng === '' || $ns === '' || $key === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Missing required fields: lng, ns, key']);
    exit;
}

// Persist translation here (database/file/service).

http_response_code(200);
echo json_encode([
    'ok' => true,
    'lng' => $lng,
    'ns' => $ns,
    'key' => $key,
    'value' => $value
]);
```
