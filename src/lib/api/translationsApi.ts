const API_BASE_URL = (import.meta.env.VITE_TRANSLATIONS_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8082";

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;
const parsedTtl = Number(import.meta.env.VITE_TRANSLATIONS_CACHE_TTL_MS);
const CACHE_TTL_MS = Number.isFinite(parsedTtl) && parsedTtl > 0 ? parsedTtl : DEFAULT_CACHE_TTL_MS;
const CACHE_STORAGE_KEY = "adhd-coach-static-translations-cache-v2";

type TranslationMap = Record<string, string>;

type CacheEntry = {
  expiresAt: number;
  translations: TranslationMap;
};

const memoryCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<TranslationMap>>();

const buildCacheKey = (lng: string, ns: string) => `${lng}::${ns}`;

const buildTranslationsUrl = (lng: string, ns: string) => {
  return `${API_BASE_URL}/api/v1/translations/${encodeURIComponent(lng)}/${encodeURIComponent(ns)}`;
};

const parseErrorMessage = async (response: Response, fallbackMessage: string): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    if (typeof data?.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }
    if (typeof data?.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }
  } catch {
    return `${fallbackMessage} (HTTP ${response.status}).`;
  }

  return fallbackMessage;
};

const cloneTranslations = (translations: TranslationMap): TranslationMap => ({ ...translations });

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const loadPersistentCache = (): Record<string, CacheEntry> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      return {};
    }

    const now = Date.now();
    const normalized: Record<string, CacheEntry> = {};

    Object.entries(parsed).forEach(([key, value]) => {
      if (!isRecord(value)) {
        return;
      }

      const expiresAt = value.expiresAt;
      const translations = value.translations;

      if (typeof expiresAt !== "number" || !isRecord(translations) || expiresAt <= now) {
        return;
      }

      const normalizedTranslations: TranslationMap = {};
      Object.entries(translations).forEach(([translationKey, translationValue]) => {
        if (typeof translationValue === "string") {
          normalizedTranslations[translationKey] = translationValue;
        }
      });

      normalized[key] = {
        expiresAt,
        translations: normalizedTranslations
      };
    });

    return normalized;
  } catch {
    return {};
  }
};

const persistCacheSnapshot = (entries: Record<string, CacheEntry>) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore quota and serialization failures.
  }
};

const readCacheEntry = (cacheKey: string): CacheEntry | null => {
  const now = Date.now();
  const inMemory = memoryCache.get(cacheKey);
  if (inMemory && inMemory.expiresAt > now) {
    return {
      expiresAt: inMemory.expiresAt,
      translations: cloneTranslations(inMemory.translations)
    };
  }

  if (inMemory) {
    memoryCache.delete(cacheKey);
  }

  const persistent = loadPersistentCache();
  const fromStorage = persistent[cacheKey];
  if (!fromStorage) {
    return null;
  }

  memoryCache.set(cacheKey, {
    expiresAt: fromStorage.expiresAt,
    translations: cloneTranslations(fromStorage.translations)
  });

  return {
    expiresAt: fromStorage.expiresAt,
    translations: cloneTranslations(fromStorage.translations)
  };
};

const writeCacheEntry = (cacheKey: string, translations: TranslationMap, ttlMs = CACHE_TTL_MS) => {
  const expiresAt = Date.now() + ttlMs;
  const nextEntry: CacheEntry = {
    expiresAt,
    translations: cloneTranslations(translations)
  };

  memoryCache.set(cacheKey, nextEntry);

  const persistent = loadPersistentCache();
  persistent[cacheKey] = nextEntry;
  persistCacheSnapshot(persistent);
};

const removeCacheEntry = (cacheKey: string) => {
  memoryCache.delete(cacheKey);
  const persistent = loadPersistentCache();
  if (persistent[cacheKey]) {
    delete persistent[cacheKey];
    persistCacheSnapshot(persistent);
  }
};

const normalizeTranslationsResponse = (data: { translations?: Record<string, unknown> }): TranslationMap => {
  const translations = data?.translations;

  if (!translations || typeof translations !== "object") {
    return {};
  }

  const normalized: TranslationMap = {};
  Object.entries(translations).forEach(([key, value]) => {
    if (typeof value === "string") {
      normalized[key] = value;
    }
  });

  return normalized;
};

const fetchTranslationsFromBackend = async (lng: string, ns: string): Promise<TranslationMap> => {
  const response = await fetch(buildTranslationsUrl(lng, ns), {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Failed to load translations."));
  }

  const data = (await response.json()) as { translations?: Record<string, unknown> };
  return normalizeTranslationsResponse(data);
};

export const getTranslations = async (lng: string, ns: string): Promise<TranslationMap> => {
  const cacheKey = buildCacheKey(lng, ns);
  const cached = readCacheEntry(cacheKey);
  if (cached) {
    return cloneTranslations(cached.translations);
  }

  const pending = inFlightRequests.get(cacheKey);
  if (pending) {
    return cloneTranslations(await pending);
  }

  const request = fetchTranslationsFromBackend(lng, ns)
    .then((translations) => {
      if (Object.keys(translations).length > 0) {
        writeCacheEntry(cacheKey, translations);
      } else {
        removeCacheEntry(cacheKey);
      }
      return translations;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return cloneTranslations(await request);
};

export const putTranslations = async (lng: string, ns: string, translations: Record<string, string | null>): Promise<void> => {
  const response = await fetch(buildTranslationsUrl(lng, ns), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ translations })
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Failed to save translation."));
  }

  const cacheKey = buildCacheKey(lng, ns);
  const current = readCacheEntry(cacheKey)?.translations ?? {};
  const next: TranslationMap = { ...current };

  Object.entries(translations).forEach(([key, value]) => {
    if (value === null) {
      delete next[key];
      return;
    }
    next[key] = value;
  });

  if (Object.keys(next).length === 0) {
    removeCacheEntry(cacheKey);
  } else {
    writeCacheEntry(cacheKey, next);
  }
};

