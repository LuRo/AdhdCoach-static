import { useTranslation } from "react-i18next";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";

import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  primaryActionLabel?: string;
  testId?: string;
  title: string;
}

export const ModalShell = ({ children, isOpen, onClose, primaryActionLabel, testId, title }: Props) => {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="modal fade show d-block" role="dialog" aria-modal="true" aria-label={title} data-testid={testId}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header">
              <h2 className="modal-title fs-5">{title}</h2>
              <CoachButton type="button" variant="ghost" className="modal-close-button" aria-label={t("Close")} onClick={onClose}>
                <i className="bi bi-x-lg" aria-hidden="true" />
              </CoachButton>
            </div>

            <div className="modal-body">{children}</div>

            <div className="modal-footer">
              <CoachButton type="button" variant="outline" onClick={onClose}>
                {t("Close")}
              </CoachButton>
              {primaryActionLabel ? <CoachButton type="button">{primaryActionLabel}</CoachButton> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose} data-testid={testId ? `${testId}-backdrop` : undefined} />
    </>
  );
};

