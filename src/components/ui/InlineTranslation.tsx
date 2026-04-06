import { EditableTranslation } from "../../lib/i18n";

interface Props {
  namespaceKey: string;
  translationKey: string;
  defaultText: string;
  ns?: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export const InlineTranslation = ({
  namespaceKey,
  translationKey,
  defaultText,
  ns = "translation",
  className,
  tag = "span"
}: Props) => (
  <EditableTranslation
    i18nKey={`${namespaceKey}.${translationKey}`}
    defaultText={defaultText}
    ns={ns}
    className={className}
    tag={tag}
  />
);
