import { type ReactNode } from "react";
import { EditableTranslation } from "../../lib/i18n";

interface Props {
  namespaceKey: string;
  labelDefaultText: string;
  titleDefaultText: string;
  introDefaultText: string;
  labelI18nKey?: string;
  titleI18nKey?: string;
  introI18nKey?: string;
  optionalContent?: ReactNode;
}

export const PageIntroBlock = ({
  namespaceKey,
  labelDefaultText,
  titleDefaultText,
  introDefaultText,
  labelI18nKey,
  titleI18nKey,
  introI18nKey,
  optionalContent
}: Props) => {
  const titleClassName = "h2 mb-2";
  const introClassName = "text-secondary mb-0";
  const resolvedLabelI18nKey = labelI18nKey ?? `${namespaceKey}.label`;
  const resolvedTitleI18nKey = titleI18nKey ?? `${namespaceKey}.title`;
  const resolvedIntroI18nKey = introI18nKey ?? `${namespaceKey}.intro`;

  return (
    <div className="flex-grow-1">
      <p className="text-uppercase small fw-semibold text-secondary mb-2">
        <EditableTranslation
          i18nKey={resolvedLabelI18nKey}
          defaultText={labelDefaultText}
        />
      </p>
      <h1 className={titleClassName}>
        <EditableTranslation
          i18nKey={resolvedTitleI18nKey}
          defaultText={titleDefaultText}
        />
      </h1>
      <p className={introClassName}>
        <EditableTranslation
          i18nKey={resolvedIntroI18nKey}
          defaultText={introDefaultText}
        />
      </p>
      {optionalContent ? <div className="mt-3">{optionalContent}</div> : null}
    </div>
  );
};
