import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { LOCALES, type Locale } from "./locale";
import { getTranslations } from "../api/translationsApi";
import { UI_BACKEND_NAMESPACES } from "./ui-namespaces";

const EMPTY_RESOURCES = Object.fromEntries(LOCALES.map((locale) => [locale, { translation: {} }])) as Record<
  Locale,
  { translation: Record<string, string> }
>;

if (!i18n.isInitialized) {
  i18n.use(LanguageDetector).use(initReactI18next).init({
    resources: EMPTY_RESOURCES,
    fallbackLng: "en",
    supportedLngs: [...LOCALES],
    defaultNS: "translation",
    ns: ["translation"],
    keySeparator: false,
    nsSeparator: false,
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

const TRANSLATION_NAMESPACE = "translation";
const DEFAULT_LOCALE: Locale = "en";
const loadedLocales = new Set<string>();
const pendingLocaleLoads = new Map<string, Promise<void>>();

const addBackendNamespaceAsLiteralLabels = async (lng: string, namespace: string) => {
  const [baseEnglishEntries, localizedEntries] = await Promise.all([
    getTranslations(DEFAULT_LOCALE, namespace),
    getTranslations(lng, namespace)
  ]);

  Object.entries(baseEnglishEntries).forEach(([path, englishText]) => {
    const localizedText = localizedEntries[path] ?? englishText;
    i18n.addResource(lng, TRANSLATION_NAMESPACE, englishText, localizedText);
  });
};

const loadBackendTranslationsIntoI18n = async (lng: string) => {
  await Promise.all([
    ...UI_BACKEND_NAMESPACES.map((namespace) => addBackendNamespaceAsLiteralLabels(lng, namespace)),
    (async () => {
      const translationNamespaceEntries = await getTranslations(lng, TRANSLATION_NAMESPACE);
      Object.entries(translationNamespaceEntries).forEach(([key, value]) => {
        i18n.addResource(lng, TRANSLATION_NAMESPACE, key, value);
      });
    })()
  ]);
};

export const ensureBackendTranslationsLoaded = async (lng: string): Promise<void> => {
  if (loadedLocales.has(lng)) {
    return;
  }

  const pending = pendingLocaleLoads.get(lng);
  if (pending) {
    await pending;
    return;
  }

  const loader = loadBackendTranslationsIntoI18n(lng)
    .then(() => {
      loadedLocales.add(lng);
    })
    .catch(() => {
      // Ignore backend load failures so local defaults still render.
    })
    .finally(() => {
      pendingLocaleLoads.delete(lng);
    });

  pendingLocaleLoads.set(lng, loader);
  await loader;
};

void ensureBackendTranslationsLoaded(i18n.resolvedLanguage ?? i18n.language ?? "en");

i18n.on("languageChanged", (nextLng) => {
  void ensureBackendTranslationsLoaded(nextLng);
});

export default i18n;
