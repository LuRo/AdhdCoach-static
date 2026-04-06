import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import type { BacklogTask, CreateTaskInput } from "../types";

interface Props {
  backlogTasks: BacklogTask[];
  isOpen: boolean;
  onAddFromBacklog: (backlogTaskId: string) => void;
  onClose: () => void;
  onCreateTask: (input: CreateTaskInput) => void;
}

type Stage = "backlog" | "new";

const estimateComplexityFromTitle = (title: string): number => {
  const normalized = title.toLowerCase();
  const words = normalized.trim().split(/\s+/).filter(Boolean);
  let score = 1;

  if (words.length >= 5) score += 1;
  if (words.length >= 9) score += 1;
  if (/review|align|coordinate|prepare|refactor|analy|design|proposal|timeline/.test(normalized)) score += 1;
  if (/urgent|critical|client|deadline|multi|cross/.test(normalized)) score += 1;

  return Math.max(1, Math.min(5, score));
};

export const AddTaskModal = ({ backlogTasks, isOpen, onAddFromBacklog, onClose, onCreateTask }: Props) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>("backlog");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [complexity, setComplexity] = useState<number>(2);
  const [storeInBacklog, setStoreInBacklog] = useState(false);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setStage("backlog");
    setTitle("");
    setSummary("");
    setComplexity(2);
    setStoreInBacklog(false);
    setDueDate("");
  }, [isOpen]);

  const canCreate = useMemo(() => title.trim().length > 0, [title]);

  if (!isOpen) {
    return null;
  }

  const handleCreate = () => {
    if (!canCreate) return;

    onCreateTask({
      title,
      summary,
      complexity,
      storeInBacklog,
      dueDate: storeInBacklog ? dueDate || null : null
    });
  };

  return (
    <>
      <div className="modal fade show d-block add-task-modal" role="dialog" aria-modal="true" aria-label={t("Add task")} data-testid="morning-add-task-modal">
        <div className="modal-dialog modal-dialog-centered add-task-modal-dialog">
          <div className="modal-content border-0 shadow-lg add-task-modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">{stage === "backlog" ? t("Backlog") : t("Create a new task")}</h2>
              <CoachButton type="button" variant="ghost" className="modal-close-button" aria-label={t("Close")} testId="morning-add-task-close-button" onClick={onClose}>
                <i className="bi bi-x-lg" aria-hidden="true" />
              </CoachButton>
            </div>

            <div className="modal-body">
              {stage === "backlog" ? (
                <div className="d-flex flex-column gap-3">
                  <p className="mb-0 text-secondary">{t("Choose a task from backlog or create a completely new one.")}</p>

                  <div className="add-task-backlog-list d-flex flex-column gap-2" data-testid="morning-add-task-backlog-list">
                    {backlogTasks.length === 0 ? (
                      <p className="mb-0 text-secondary small">{t("No backlog tasks available.")}</p>
                    ) : (
                      backlogTasks.map((task) => (
                        <div key={task.id} className="add-task-backlog-item d-flex align-items-center justify-content-between gap-2" data-testid={`morning-add-task-backlog-item-${task.id}`}>
                          <div>
                            <div className="fw-semibold">{task.title}</div>
                            <div className="small text-secondary">
                              {task.summary}
                              {task.dueDate ? ` ${t("due")} ${task.dueDate}` : ""}
                            </div>
                          </div>

                          <CoachButton type="button" className="rounded-pill px-3 py-1" variant="outline" testId={`morning-add-task-backlog-add-button-${task.id}`} onClick={() => onAddFromBacklog(task.id)}>
                            {t("Add")}
                          </CoachButton>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-semibold" htmlFor="new-task-title">
                      {t("Title")} <span className="text-danger">*</span>
                    </label>
                    <input id="new-task-title" className="form-control" data-testid="morning-add-task-title-input" value={title} onChange={(event) => setTitle(event.currentTarget.value)} placeholder={t("What needs to be done?")} />
                  </div>

                  <div>
                    <label className="form-label fw-semibold" htmlFor="new-task-summary">
                      {t("Subtext (optional)")}
                    </label>
                    <textarea id="new-task-summary" className="form-control" data-testid="morning-add-task-summary-input" rows={2} value={summary} onChange={(event) => setSummary(event.currentTarget.value)} placeholder={t("Helpful context for the task")} />
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="small text-secondary">
                      {t("Estimated complexity")}: {complexity}
                    </div>
                    <CoachButton type="button" variant="outline" className="rounded-pill px-3 py-1" disabled={!canCreate} testId="morning-add-task-calculate-complexity-button" onClick={() => setComplexity(estimateComplexityFromTitle(title))}>
                      {t("Calculate complexity")}
                    </CoachButton>
                  </div>

                  <div className="form-check">
                    <input id="store-in-backlog" type="checkbox" className="form-check-input" data-testid="morning-add-task-store-backlog-checkbox" checked={storeInBacklog} onChange={(event) => setStoreInBacklog(event.currentTarget.checked)} />
                    <label className="form-check-label" htmlFor="store-in-backlog">
                      {t("Store in backlog")}
                    </label>
                  </div>

                  <div>
                    <label className="form-label fw-semibold" htmlFor="new-task-due-date">
                      {t("Due date (optional)")}
                    </label>
                    <input id="new-task-due-date" type="date" className="form-control" data-testid="morning-add-task-due-date-input" value={dueDate} disabled={!storeInBacklog} onChange={(event) => setDueDate(event.currentTarget.value)} />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <div>{stage === "new" ? <CoachButton type="button" variant="outline" testId="morning-add-task-back-button" onClick={() => setStage("backlog")}>{t("Back to backlog")}</CoachButton> : null}</div>

              <div className="d-flex gap-2">
                <CoachButton type="button" variant="outline" onClick={onClose}>
                  {t("Close")}
                </CoachButton>

                {stage === "backlog" ? (
                  <CoachButton type="button" testId="morning-add-task-create-new-button" onClick={() => setStage("new")}>
                    {t("Create new task")}
                  </CoachButton>
                ) : (
                  <CoachButton type="button" disabled={!canCreate} testId="morning-add-task-submit-button" onClick={handleCreate}>
                    {storeInBacklog ? t("Save to backlog") : t("Add to today")}
                  </CoachButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show add-task-modal-backdrop" onClick={onClose} />
    </>
  );
};
