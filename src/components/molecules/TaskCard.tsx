import { useMemo } from "react";
import { cn } from "../../app/cn";
import { CoachButton } from "../atoms/CoachButton";
import type { Task } from "../../features/morning/types";

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

export const TaskCard = ({
  isLocked,
  onOpenDetails,
  onToggleSelected,
  priority,
  task
}: Props) => {
  const complexityClass = useMemo(() => {
    if (task.complexity >= 5) {
      return "complexity-large";
    }

    return complexityClassByValue[task.complexity] ?? "complexity-medium";
  }, [task.complexity]);

  return (
    <article className="task-card p-3 p-lg-4">
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center pt-1 ps-md-2 pe-md-2 ">
          <button className="task-grip" type="button" aria-label="Drag to reorder" disabled={isLocked}>
            <i className="bi bi-grip-vertical" />
          </button>
        </div>

        <div className="d-flex align-items-center ps-2 pe-2">
          <input
            className="form-check-input task-select"
            type="checkbox"
            checked={task.selected}
            disabled={isLocked}
            aria-label={`Select ${task.title} for removal`}
            onChange={(event) => onToggleSelected(task.id, event.currentTarget.checked)}
          />
        </div>

        <div className="d-flex align-items-center ps-md-3 pe-md-3 ps-1 pe-2">
          <span
            className={cn("complexity-pill my-auto", complexityClass)}
            role="img"
            aria-label={`Complexity ${task.complexity}`}
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
                aria-label="Open task details and actions"
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





