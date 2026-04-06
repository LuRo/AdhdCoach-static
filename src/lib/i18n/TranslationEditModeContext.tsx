import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { getTranslationEnabled, persistTranslationEnabled } from "./locale";

type TranslationEditModeValue = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const TranslationEditModeContext = createContext<TranslationEditModeValue | null>(null);

export const TranslationEditModeProvider = ({ children }: PropsWithChildren) => {
  const [enabled, setEnabledState] = useState<boolean>(() => getTranslationEnabled());

  const setEnabled = useCallback((nextEnabled: boolean) => {
    setEnabledState(nextEnabled);
    persistTranslationEnabled(nextEnabled);
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled
    }),
    [enabled, setEnabled]
  );

  return <TranslationEditModeContext.Provider value={value}>{children}</TranslationEditModeContext.Provider>;
};

export const useTranslationEditMode = () => {
  const context = useContext(TranslationEditModeContext);
  if (!context) {
    throw new Error("useTranslationEditMode must be used within a TranslationEditModeProvider");
  }

  return context;
};
