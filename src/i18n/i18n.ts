import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { detectInitialLocale, getCopy, LOCALES, normalizeLocale, persistLocale, type Locale } from "./copy";
import { getUiCopy } from "./ui";

const buildTranslation = (locale: Locale) => ({
  ...getCopy(locale),
  ui: getUiCopy(locale)
});

const resources = Object.fromEntries(
  LOCALES.map((locale) => [locale, { translation: buildTranslation(locale) }])
) as Record<Locale, { translation: ReturnType<typeof buildTranslation> }>;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: detectInitialLocale(),
    fallbackLng: "en",
    supportedLngs: [...LOCALES],
    defaultNS: "translation",
    ns: ["translation"],
    interpolation: {
      escapeValue: false
    },
    load: "currentOnly",
    react: {
      useSuspense: false
    }
  });

  i18n.on("languageChanged", (language) => {
    persistLocale(normalizeLocale(language));
  });
}

export const getI18nCopy = (locale: Locale) => buildTranslation(locale);

export default i18n;
