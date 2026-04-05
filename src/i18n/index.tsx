import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import {
  detectInitialLocale,
  getTranslationEnabled,
  LOCALES,
  normalizeLocale,
  persistTranslationEnabled,
  type Locale
} from "./locale";
import { getCopy } from "./copy";
import { getUiCopy, type UiCopy } from "./ui";

type I18nValue = {
  copy: ReturnType<typeof getCopy> & { ui: UiCopy };
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translationEnabled: boolean;
  setTranslationEnabled: (enabled: boolean) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

const I18nStateProvider = ({ children }: PropsWithChildren) => {
  const { i18n: instance } = useTranslation();
  const [translationEnabled, setTranslationEnabledState] = useState(() => getTranslationEnabled());
  const locale = normalizeLocale(instance.resolvedLanguage ?? instance.language ?? detectInitialLocale());

  useEffect(() => {
    persistTranslationEnabled(translationEnabled);
  }, [translationEnabled]);

  const uiCopy = useMemo(() => (translationEnabled ? getUiCopy(locale) : getUiCopy("en")), [locale, translationEnabled]);
  const copy = useMemo(() => ({ ...getCopy(locale), ui: uiCopy }), [locale, uiCopy]);

  const setLocale = (nextLocale: Locale) => {
    void instance.changeLanguage(nextLocale);
  };

  const value = useMemo(
    () => ({ copy, locale, setLocale, translationEnabled, setTranslationEnabled: setTranslationEnabledState }),
    [copy, locale, translationEnabled]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const I18nProvider = ({ children }: PropsWithChildren) => {
  return (
    <I18nextProvider i18n={i18n}>
      <I18nStateProvider>{children}</I18nStateProvider>
    </I18nextProvider>
  );
};

export const useI18n = (): I18nValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
};

export { LOCALES };
export type { Locale } from "./locale";