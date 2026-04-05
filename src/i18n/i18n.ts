import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { LOCALES, type Locale } from "./locale";
import { getUiCopy } from "./ui";

const buildTranslation = (locale: Locale) => getUiCopy(locale);

const resources = Object.fromEntries(
  LOCALES.map((locale) => [locale, { translation: buildTranslation(locale) }])
) as Record<Locale, { translation: ReturnType<typeof buildTranslation> }>;

if (!i18n.isInitialized) {
  i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    supportedLngs: [...LOCALES],
    defaultNS: "translation",
    ns: ["translation"],
    interpolation: {
      escapeValue: false
    },
    load: "currentOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "adhd-coach-static-locale"
    },
    react: {
      useSuspense: false
    }
  });
}

export default i18n;