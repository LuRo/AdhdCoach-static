import { useMemo, type PropsWithChildren } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import { detectInitialLocale, getCopy, LOCALES, normalizeLocale, type Locale } from "./copy";
import { getUiCopy, type UiCopy } from "./ui";

type I18nValue = {
  copy: ReturnType<typeof getCopy> & { ui: UiCopy };
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const I18nProvider = ({ children }: PropsWithChildren) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export const useI18n = (): I18nValue => {
  const { i18n: instance } = useTranslation();
  const locale = normalizeLocale(instance.resolvedLanguage ?? instance.language ?? detectInitialLocale());
  const copy = useMemo(() => ({ ...getCopy(locale), ui: getUiCopy(locale) }), [locale]);

  const setLocale = (nextLocale: Locale) => {
    void instance.changeLanguage(nextLocale);
  };

  return { copy, locale, setLocale };
};

export { LOCALES };
export type { Locale } from "./copy";
