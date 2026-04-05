import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { LOCALES, type Locale } from "./locale";
import { getUiCopy } from "./ui";

type TranslationNode = string | readonly TranslationNode[] | { [key: string]: TranslationNode };

const flattenStringPaths = (node: TranslationNode, path: string[] = [], output: string[] = []): string[] => {
  if (typeof node === "string") {
    output.push(path.join("."));
    return output;
  }

  if (Array.isArray(node)) {
    node.forEach((value, index) => flattenStringPaths(value, [...path, String(index)], output));
    return output;
  }

  Object.entries(node).forEach(([key, value]) => flattenStringPaths(value, [...path, key], output));
  return output;
};

const getValueAtPath = (node: TranslationNode, path: string[]): TranslationNode => {
  return path.reduce<TranslationNode>((current, segment) => {
    if (Array.isArray(current)) {
      return current[Number(segment)];
    }
    return (current as Record<string, TranslationNode>)[segment];
  }, node);
};

const buildLabelDictionary = (locale: Locale): Record<string, string> => {
  const englishTree = getUiCopy("en") as unknown as TranslationNode;
  const localizedTree = getUiCopy(locale) as unknown as TranslationNode;
  const stringPaths = flattenStringPaths(englishTree);
  const dictionary: Record<string, string> = {};

  stringPaths.forEach((path) => {
    const segments = path.split(".");
    const english = getValueAtPath(englishTree, segments);
    const localized = getValueAtPath(localizedTree, segments);

    if (typeof english === "string" && typeof localized === "string") {
      dictionary[english] = localized;
    }
  });

  return dictionary;
};

const resources = Object.fromEntries(LOCALES.map((locale) => [locale, { translation: buildLabelDictionary(locale) }])) as Record<
  Locale,
  { translation: Record<string, string> }
>;

if (!i18n.isInitialized) {
  i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
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

export default i18n;

