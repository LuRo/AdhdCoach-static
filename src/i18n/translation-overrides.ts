import type { Locale } from "./locale";

export type TranslationOverrides = Partial<Record<Locale, Record<string, string>>>;

const STORAGE_KEY = "adhd-coach-static-translation-overrides";

export const getTranslationOverrides = (): TranslationOverrides => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as TranslationOverrides;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const persistTranslationOverrides = (overrides: TranslationOverrides) => {
  if (typeof window === "undefined") {
    return;
  }

  const hasValues = Object.values(overrides).some((localeOverrides) => localeOverrides && Object.keys(localeOverrides).length > 0);
  if (!hasValues) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

export const setTranslationOverride = (overrides: TranslationOverrides, locale: Locale, path: string, value: string): TranslationOverrides => {
  const nextValue = value.trim();
  const nextOverrides = { ...overrides };
  const localeOverrides = { ...(nextOverrides[locale] ?? {}) };

  if (nextValue.length === 0) {
    delete localeOverrides[path];
  } else {
    localeOverrides[path] = value;
  }

  if (Object.keys(localeOverrides).length === 0) {
    delete nextOverrides[locale];
  } else {
    nextOverrides[locale] = localeOverrides;
  }

  return nextOverrides;
};

export const applyTranslationOverrides = <T>(source: T, overrides?: Record<string, string>, path: string[] = []): T => {
  if (typeof source === "string") {
    const key = path.join(".");
    return (overrides?.[key] ?? source) as T;
  }

  if (Array.isArray(source)) {
    return source.map((item, index) => applyTranslationOverrides(item, overrides, [...path, String(index)])) as T;
  }

  if (source && typeof source === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
      result[key] = applyTranslationOverrides(value, overrides, [...path, key]);
    }
    return result as T;
  }

  return source;
};
