<?php

declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$uriPath = parse_url($_SERVER["REQUEST_URI"] ?? "", PHP_URL_PATH);
$method = strtoupper($_SERVER["REQUEST_METHOD"] ?? "GET");

if (!is_string($uriPath)) {
    respond(400, ["error" => "Invalid request path."]);
}

$routeMatches = [];
$isTranslationRoute = preg_match(
    "#^/api/v1/translations/([A-Za-z0-9_-]+)/([A-Za-z0-9._-]+)$#",
    $uriPath,
    $routeMatches
);

if ($isTranslationRoute !== 1) {
    respond(404, ["error" => "Route not found."]);
}

$lng = $routeMatches[1];
$namespace = $routeMatches[2];

$storageRoot = dirname(__DIR__) . "/storage/translations";
$localeDirectory = $storageRoot . "/" . $lng;
$namespaceFile = $localeDirectory . "/" . $namespace . ".json";

if (!is_dir($localeDirectory) && !mkdir($localeDirectory, 0777, true) && !is_dir($localeDirectory)) {
    respond(500, ["error" => "Could not initialize translation storage."]);
}

if ($method === "GET") {
    $translations = readTranslations($namespaceFile);
    respond(200, [
        "lng" => $lng,
        "ns" => $namespace,
        "translations" => $translations
    ]);
}

if ($method !== "PUT") {
    respond(405, ["error" => "Method not allowed."]);
}

$requestPayload = decodeJsonBody();
$incomingTranslations = extractIncomingTranslations($requestPayload);
$currentTranslations = readTranslations($namespaceFile);

foreach ($incomingTranslations as $key => $value) {
    if ($value === null) {
        unset($currentTranslations[$key]);
        continue;
    }

    $currentTranslations[$key] = $value;
}

ksort($currentTranslations);

$encoded = json_encode(
    $currentTranslations,
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if (!is_string($encoded)) {
    respond(500, ["error" => "Could not encode translation data."]);
}

if (file_put_contents($namespaceFile, $encoded . "\n") === false) {
    respond(500, ["error" => "Could not write translation data."]);
}

respond(200, [
    "lng" => $lng,
    "ns" => $namespace,
    "translations" => $currentTranslations
]);

function decodeJsonBody(): array
{
    $rawBody = file_get_contents("php://input");
    if (!is_string($rawBody) || trim($rawBody) === "") {
        return [];
    }

    try {
        $decoded = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
    } catch (Throwable $throwable) {
        respond(400, ["error" => "Invalid JSON body."]);
    }

    if (!is_array($decoded)) {
        respond(400, ["error" => "Request body must be a JSON object."]);
    }

    return $decoded;
}

function extractIncomingTranslations(array $payload): array
{
    $source = $payload;

    if (array_key_exists("translations", $payload)) {
        if (!is_array($payload["translations"])) {
            respond(400, ["error" => "The 'translations' property must be an object."]);
        }
        $source = $payload["translations"];
    }

    $normalized = [];
    foreach ($source as $key => $value) {
        if (!is_string($key) || trim($key) === "") {
            respond(400, ["error" => "Translation keys must be non-empty strings."]);
        }

        if (!is_string($value) && $value !== null) {
            respond(400, ["error" => "Translation values must be strings or null."]);
        }

        $normalized[$key] = $value;
    }

    return $normalized;
}

function readTranslations(string $filePath): array
{
    if (!is_file($filePath)) {
        return [];
    }

    $rawContent = file_get_contents($filePath);
    if (!is_string($rawContent) || trim($rawContent) === "") {
        return [];
    }

    try {
        $decoded = json_decode($rawContent, true, 512, JSON_THROW_ON_ERROR);
    } catch (Throwable $throwable) {
        respond(500, ["error" => "Stored translation file is invalid JSON."]);
    }

    if (!is_array($decoded)) {
        respond(500, ["error" => "Stored translation file has invalid data."]);
    }

    $translations = [];
    foreach ($decoded as $key => $value) {
        if (is_string($key) && is_string($value)) {
            $translations[$key] = $value;
        }
    }

    return $translations;
}

function respond(int $statusCode, array $body): void
{
    http_response_code($statusCode);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
