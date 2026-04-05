import type { PropsWithChildren } from "react";
import { useI18n } from "../../../i18n";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";

interface Props extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  primaryActionLabel?: string;
  testId?: string;
  title: string;
}

export const ModalShell = ({ children, isOpen, onClose, primaryActionLabel, testId, title }: Props) => {
  const { copy } = useI18n();

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
              <button type="button" className="btn-close" aria-label={copy.common.close} onClick={onClose} />
            </div>

            <div className="modal-body">{children}</div>

            <div className="modal-footer">
              <CoachButton type="button" variant="outline" onClick={onClose}>
                {copy.common.close}
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
