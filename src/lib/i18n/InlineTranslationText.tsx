import { useI18n } from ".";

interface Props {
  className?: string;
  multiline?: boolean;
  path: string;
  value: string;
}

export const InlineTranslationText = ({ className, multiline = false, path, value }: Props) => {
  const { locale, setTranslationValue, translationEnabled } = useI18n();

  if (!translationEnabled) {
    return <>{value}</>;
  }

  const baseClassName = ["inline-translation-editor", className].filter(Boolean).join(" ");

  return (
    <textarea
      className={baseClassName}
      rows={multiline ? 2 : 1}
      spellCheck
      value={value}
      onChange={(event) => setTranslationValue(locale, path, event.currentTarget.value)}
    />
  );
};
