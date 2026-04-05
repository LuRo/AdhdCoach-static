import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../../i18n";
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
  const { copy } = useI18n();
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
      <div className="modal fade show d-block add-task-modal" role="dialog" aria-modal="true" aria-label={copy.ui.addTaskModal.ariaLabel}>
        <div className="modal-dialog modal-dialog-centered add-task-modal-dialog">
          <div className="modal-content border-0 shadow-lg add-task-modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">{stage === "backlog" ? copy.ui.addTaskModal.backlogTitle : copy.ui.addTaskModal.newTaskTitle}</h2>
              <button type="button" className="btn-close" aria-label={copy.ui.addTaskModal.close} onClick={onClose} />
            </div>

            <div className="modal-body">
              {stage === "backlog" ? (
                <div className="d-flex flex-column gap-3">
                  <p className="mb-0 text-secondary">{copy.ui.addTaskModal.intro}</p>

                  <div className="add-task-backlog-list d-flex flex-column gap-2">
                    {backlogTasks.length === 0 ? (
                      <p className="mb-0 text-secondary small">{copy.ui.addTaskModal.emptyBacklog}</p>
                    ) : (
                      backlogTasks.map((task) => (
                        <div key={task.id} className="add-task-backlog-item d-flex align-items-center justify-content-between gap-2">
                          <div>
                            <div className="fw-semibold">{task.title}</div>
                            <div className="small text-secondary">
                              {task.summary}
                              {task.dueDate ? ` · due ${task.dueDate}` : ""}
                            </div>
                          </div>

                          <CoachButton
                            type="button"
                            className="rounded-pill px-3 py-1"
                            variant="outline"
                            onClick={() => onAddFromBacklog(task.id)}
                          >
                            {copy.ui.addTaskModal.add}
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
                      {copy.ui.addTaskModal.titleLabel} <span className="text-danger">*</span>
                    </label>
                    <input
                      id="new-task-title"
                      className="form-control"
                      value={title}
                      onChange={(event) => setTitle(event.currentTarget.value)}
                      placeholder={copy.ui.addTaskModal.titlePlaceholder}
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold" htmlFor="new-task-summary">
                      {copy.ui.addTaskModal.summaryLabel}
                    </label>
                    <textarea
                      id="new-task-summary"
                      className="form-control"
                      rows={2}
                      value={summary}
                      onChange={(event) => setSummary(event.currentTarget.value)}
                      placeholder={copy.ui.addTaskModal.summaryPlaceholder}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="small text-secondary">
                      {copy.ui.addTaskModal.complexityLabel}: {complexity}
                    </div>
                    <CoachButton
                      type="button"
                      variant="outline"
                      className="rounded-pill px-3 py-1"
                      disabled={!canCreate}
                      onClick={() => setComplexity(estimateComplexityFromTitle(title))}
                    >
                      {copy.ui.addTaskModal.calculateComplexity}
                    </CoachButton>
                  </div>

                  <div className="form-check">
                    <input
                      id="store-in-backlog"
                      type="checkbox"
                      className="form-check-input"
                      checked={storeInBacklog}
                      onChange={(event) => setStoreInBacklog(event.currentTarget.checked)}
                    />
                    <label className="form-check-label" htmlFor="store-in-backlog">
                      {copy.ui.addTaskModal.storeInBacklog}
                    </label>
                  </div>

                  <div>
                    <label className="form-label fw-semibold" htmlFor="new-task-due-date">
                      {copy.ui.addTaskModal.dueDateLabel}
                    </label>
                    <input
                      id="new-task-due-date"
                      type="date"
                      className="form-control"
                      value={dueDate}
                      disabled={!storeInBacklog}
                      onChange={(event) => setDueDate(event.currentTarget.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <div>
                {stage === "new" ? (
                  <CoachButton type="button" variant="outline" onClick={() => setStage("backlog")}>{copy.ui.addTaskModal.backToBacklog}</CoachButton>
                ) : null}
              </div>

              <div className="d-flex gap-2">
                <CoachButton type="button" variant="outline" onClick={onClose}>
                  {copy.ui.addTaskModal.close}
                </CoachButton>

                {stage === "backlog" ? (
                  <CoachButton type="button" onClick={() => setStage("new")}>{copy.ui.addTaskModal.createNewTask}</CoachButton>
                ) : (
                  <CoachButton type="button" disabled={!canCreate} onClick={handleCreate}>
                    {storeInBacklog ? copy.ui.addTaskModal.saveToBacklog : copy.ui.addTaskModal.addToToday}
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

