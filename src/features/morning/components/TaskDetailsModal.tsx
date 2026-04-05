import { useI18n } from "../../../i18n";
import type { Task } from "../types";
import { ModalShell } from "./ModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskDetailsModal = ({ isOpen, onClose, task }: Props) => {
  const { copy } = useI18n();

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} primaryActionLabel={copy.ui.taskDetailsModal.primaryAction} title={task?.title ?? copy.ui.taskDetailsModal.defaultTitle}>
      <p className="mb-0 text-secondary">{task?.details}</p>
      <div className="task-modal-actions d-flex flex-wrap mt-3">
        {task?.actions.map((actionLabel) => (
          <button
            key={actionLabel}
            type="button"
            className={/drop|reduce|push/i.test(actionLabel) ? "btn btn-outline-danger btn-sm" : "btn btn-outline-purple btn-sm"}
          >
            {actionLabel}
          </button>
        ))}
      </div>
    </ModalShell>
  );
};
