export const LOCALES = ["en", "de", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

const TRANSLATION_ENABLED_KEY = "adhd-coach-static-translations-enabled";
const LOCALE_KEY = "adhd-coach-static-locale";

export const normalizeLocale = (value: string | null | undefined): Locale => {
  if (value === "de" || value === "fr" || value === "en") {
    return value;
  }

  return "en";
};

export const detectInitialLocale = (): Locale => {
  if (typeof window !== "undefined") {
    const stored = normalizeLocale(window.localStorage.getItem(LOCALE_KEY));
    if (stored) {
      return stored;
    }

    const firstLanguage = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language || "";
    if (firstLanguage.toLowerCase().startsWith("de")) return "de";
    if (firstLanguage.toLowerCase().startsWith("fr")) return "fr";
  }

  return "en";
};

export const persistLocale = (locale: Locale) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_KEY, locale);
};

export const getTranslationEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(TRANSLATION_ENABLED_KEY);
  return stored === null ? true : stored === "true";
};

export const persistTranslationEnabled = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRANSLATION_ENABLED_KEY, String(enabled));
};