import { useI18n } from "../../../i18n";
import { cn } from "../../../shared/utils/cn";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import type { Task } from "../types";

interface Props {
  isLocked: boolean;
  onOpenDetails: (taskId: string) => void;
  onToggleSelected: (taskId: string, checked: boolean) => void;
  priority: number;
  task: Task;
}

const complexityClassByValue: Record<number, string> = {
  1: "complexity-small",
  2: "complexity-small",
  3: "complexity-medium",
  4: "complexity-medium",
  5: "complexity-large"
};

export const TaskCard = ({ isLocked, onOpenDetails, onToggleSelected, priority, task }: Props) => {
  const { copy } = useI18n();
  const complexityClass = task.complexity >= 5 ? "complexity-large" : complexityClassByValue[task.complexity] ?? "complexity-medium";

  return (
    <article className="task-card p-3 p-lg-4">
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center pt-1 ps-md-2 pe-md-2 ">
          <button className="task-grip" type="button" aria-label={copy.ui.taskCard.dragAria} disabled={isLocked}>
            <i className="bi bi-grip-vertical" />
          </button>
        </div>

        <div className="d-flex align-items-center ps-2 pe-2">
          <input
            className="form-check-input task-select"
            type="checkbox"
            checked={task.selected}
            disabled={isLocked}
            aria-label={copy.ui.taskCard.selectAria.replace("{{title}}", task.title)}
            onChange={(event) => onToggleSelected(task.id, event.currentTarget.checked)}
          />
        </div>

        <div className="d-flex align-items-center ps-md-3 pe-md-3 ps-1 pe-2">
          <span
            className={cn("complexity-pill my-auto", complexityClass)}
            role="img"
            aria-label={copy.ui.taskCard.complexityAria.replace("{{value}}", String(task.complexity))}
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column justify-content-between align-self-stretch">
          <div className="d-flex align-items-start justify-content-between">
            <div className="task-text fw-semibold">{task.title}</div>
            <span className="priority-number fw-semibold text-purple">{priority}</span>
          </div>

          <div className="d-flex align-items-start justify-content-between">
            <div className="task-subtext small text-secondary">{task.summary}</div>
            <div className="task-controls justify-content-end d-flex align-items-center gap-1">
              <CoachButton
                className="details-btn icon-square-btn"
                type="button"
                variant="outline"
                disabled={isLocked}
                aria-label={copy.ui.taskCard.detailsAria}
                onClick={() => onOpenDetails(task.id)}
              >
                <i className="bi bi-three-dots" />
              </CoachButton>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
