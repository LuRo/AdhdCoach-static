<?php

declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS");
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

if ($isTranslationRoute === 1) {
    handleTranslationRoute($method, $routeMatches[1], $routeMatches[2]);
}

if ($uriPath === "/api/v1/multiple-choice-options") {
    handleMultipleChoiceRoute($method);
}

respond(404, ["error" => "Route not found."]);

function handleTranslationRoute(string $method, string $lng, string $namespace): void
{
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
}

function handleMultipleChoiceRoute(string $method): void
{
    if ($method !== "POST") {
        respond(405, ["error" => "Method not allowed."]);
    }

    $payload = decodeJsonBody();
    $question = normalizeQuestion($payload["question"] ?? null);
    $locale = normalizeLocale($payload["locale"] ?? "en");
    $count = normalizeCount($payload["count"] ?? 5);

    $options = generateMultipleChoiceOptions($question, $locale, $count);

    respond(200, [
        "question" => $question,
        "locale" => $locale,
        "options" => $options
    ]);
}

function normalizeQuestion(mixed $value): string
{
    if (!is_string($value)) {
        respond(400, ["error" => "The 'question' field must be a string."]);
    }

    $question = trim($value);
    if ($question === "") {
        respond(400, ["error" => "The 'question' field is required."]);
    }

    if (mb_strlen($question) > 500) {
        respond(400, ["error" => "The 'question' field is too long."]);
    }

    return $question;
}

function normalizeLocale(mixed $value): string
{
    if (!is_string($value)) {
        return "en";
    }

    $locale = strtolower(trim($value));
    if (in_array($locale, ["en", "de", "fr"], true)) {
        return $locale;
    }

    return "en";
}

function normalizeCount(mixed $value): int
{
    if (is_int($value)) {
        return max(2, min(7, $value));
    }

    if (is_string($value) && ctype_digit($value)) {
        return max(2, min(7, (int) $value));
    }

    return 5;
}

function generateMultipleChoiceOptions(string $question, string $locale, int $count): array
{
    $apiKey = trim((string) getenv("OPENAI_API_KEY"));
    if ($apiKey === "") {
        respond(500, ["error" => "OPENAI_API_KEY is not configured on the backend."]);
    }

    if (!function_exists("curl_init")) {
        respond(500, ["error" => "cURL extension is required for AI generation."]);
    }

    $model = trim((string) getenv("OPENAI_MODEL"));
    if ($model === "") {
        $model = "gpt-4o-mini";
    }

    $localeInstruction = $locale === "de"
        ? "Write the answer options in German."
        : ($locale === "fr" ? "Write the answer options in French." : "Write the answer options in English.");

    $requestBody = [
        "model" => $model,
        "temperature" => 0.7,
        "messages" => [
            [
                "role" => "system",
                "content" => "You generate concise multiple-choice answer options. Return only JSON."
            ],
            [
                "role" => "user",
                "content" => "Generate {$count} strong multiple-choice options for this question: \"{$question}\". {$localeInstruction} Respond as a JSON array of strings."
            ]
        ]
    ];

    $encodedRequestBody = json_encode($requestBody, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($encodedRequestBody)) {
        respond(500, ["error" => "Could not encode AI request."]);
    }

    $ch = curl_init("https://api.openai.com/v1/chat/completions");
    if ($ch === false) {
        respond(500, ["error" => "Could not initialize AI request."]);
    }

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer {$apiKey}",
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $encodedRequestBody,
        CURLOPT_TIMEOUT => 25
    ]);

    $rawResponse = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if (!is_string($rawResponse)) {
        respond(502, ["error" => $curlError !== "" ? $curlError : "Failed to reach AI service."]);
    }

    $decoded = json_decode($rawResponse, true);
    if (!is_array($decoded)) {
        respond(502, ["error" => "AI service returned invalid JSON."]);
    }

    if ($statusCode < 200 || $statusCode >= 300) {
        $errorMessage = extractOpenAiErrorMessage($decoded);
        respond(502, ["error" => $errorMessage !== null ? $errorMessage : "AI service request failed."]);
    }

    $content = $decoded["choices"][0]["message"]["content"] ?? null;
    if (!is_string($content) || trim($content) === "") {
        respond(502, ["error" => "AI service did not return generated options."]);
    }

    $options = extractOptionsFromContent($content, $count, $locale);

    if (count($options) === 0) {
        respond(502, ["error" => "Could not parse generated options from AI response."]);
    }

    return $options;
}

function extractOpenAiErrorMessage(array $decoded): ?string
{
    $errorMessage = $decoded["error"]["message"] ?? null;
    if (is_string($errorMessage) && trim($errorMessage) !== "") {
        return $errorMessage;
    }

    return null;
}

function extractOptionsFromContent(string $content, int $count, string $locale): array
{
    $trimmed = trim($content);

    $decoded = json_decode($trimmed, true);
    if (is_array($decoded)) {
        if (isListArray($decoded)) {
            return normalizeGeneratedOptions($decoded, $count, $locale);
        }

        if (isset($decoded["options"]) && is_array($decoded["options"])) {
            return normalizeGeneratedOptions($decoded["options"], $count, $locale);
        }
    }

    if (preg_match('/\[[\s\S]*\]/', $trimmed, $matches) === 1) {
        $fromArraySnippet = json_decode($matches[0], true);
        if (is_array($fromArraySnippet)) {
            return normalizeGeneratedOptions($fromArraySnippet, $count, $locale);
        }
    }

    $lines = preg_split('/\R+/', $trimmed) ?: [];
    $fallbackOptions = [];
    foreach ($lines as $line) {
        $candidate = preg_replace('/^\s*(?:[-*]|\d+[.)])\s*/', '', trim($line));
        if (!is_string($candidate) || $candidate === '') {
            continue;
        }
        $fallbackOptions[] = $candidate;
    }

    return normalizeGeneratedOptions($fallbackOptions, $count, $locale);
}

function isListArray(array $value): bool
{
    $expectedIndex = 0;
    foreach ($value as $key => $_) {
        if ($key !== $expectedIndex) {
            return false;
        }
        $expectedIndex++;
    }

    return true;
}
function normalizeGeneratedOptions(array $options, int $count, string $locale): array
{
    $normalized = [];
    $seen = [];

    foreach ($options as $option) {
        if (!is_string($option)) {
            continue;
        }

        $candidate = trim($option);
        if ($candidate === '') {
            continue;
        }

        $key = mb_strtolower($candidate);
        if (isset($seen[$key])) {
            continue;
        }

        $seen[$key] = true;
        $normalized[] = $candidate;

        if (count($normalized) >= $count) {
            break;
        }
    }

    if (count($normalized) < $count) {
        foreach (buildFallbackOptions($locale) as $fallbackOption) {
            $key = mb_strtolower($fallbackOption);
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $normalized[] = $fallbackOption;

            if (count($normalized) >= $count) {
                break;
            }
        }
    }

    return array_slice($normalized, 0, $count);
}

function buildFallbackOptions(string $locale): array
{
    if ($locale === "de") {
        return [
            "Trifft gar nicht zu",
            "Trifft eher nicht zu",
            "Teils/teils",
            "Trifft eher zu",
            "Trifft voll zu"
        ];
    }

    if ($locale === "fr") {
        return [
            "Pas du tout",
            "Plutôt non",
            "Mitigé",
            "Plutôt oui",
            "Tout à fait"
        ];
    }

    return [
        "Not at all",
        "Slightly",
        "Somewhat",
        "Mostly",
        "Completely"
    ];
}

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

