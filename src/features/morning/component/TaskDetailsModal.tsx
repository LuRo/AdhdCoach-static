import { useTranslation } from "react-i18next";
import type { Task } from "../types";
import { ModalShell } from "./ModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskDetailsModal = ({ isOpen, onClose, task }: Props) => {
  const { t } = useTranslation();

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} primaryActionLabel={t("Mark ready")} title={task?.title ?? t("Task details")} testId="task-details-modal">
      <p className="mb-0 text-secondary">{task?.details}</p>
      <div className="task-modal-actions d-flex flex-wrap mt-3" data-testid="task-details-actions">
        {task?.actions.map((actionLabel) => (
          <button key={actionLabel} type="button" className={/drop|reduce|push/i.test(actionLabel) ? "btn btn-outline-danger btn-sm" : "btn btn-outline-purple btn-sm"}>
            {actionLabel}
          </button>
        ))}
      </div>
    </ModalShell>
  );
};
