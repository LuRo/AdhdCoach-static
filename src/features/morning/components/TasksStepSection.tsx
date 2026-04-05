import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Sortable, { type SortableEvent } from "sortablejs";
import type { RemoveSelectedMode, Task } from "../types";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import { TaskCard } from "./TaskCard";

interface Props {
  canRemoveSelected: boolean;
  currentStep: 1 | 2;
  isLocked: boolean;
  onAddTask: () => void;
  onConfirm: () => void;
  onMoveTask: (from: number, to: number) => void;
  onOpenDetails: (taskId: string) => void;
  onRemoveSelected: (mode: RemoveSelectedMode) => void;
  onSelectStep: (step: 1 | 2) => void;
  onShowHelp: () => void;
  onToggleSelected: (taskId: string, checked: boolean) => void;
  tasks: Task[];
}

export const TasksStepSection = ({
  canRemoveSelected,
  currentStep,
  isLocked,
  onAddTask,
  onConfirm,
  onMoveTask,
  onOpenDetails,
  onRemoveSelected,
  onSelectStep,
  onShowHelp,
  onToggleSelected,
  tasks
}: Props) => {
  const isOpen = currentStep === 2;
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const taskListRef = useRef<HTMLDivElement | null>(null);
  const sortableRef = useRef<Sortable | null>(null);
  const [isRemoveChoiceOpen, setIsRemoveChoiceOpen] = useState(false);

  useEffect(() => {
    const bootstrap = (window as unknown as { bootstrap?: any }).bootstrap;
    if (!bootstrap?.Collapse || !bodyRef.current) return;

    const collapse = bootstrap.Collapse.getOrCreateInstance(bodyRef.current, { toggle: false });
    if (isOpen) {
      collapse.show();
    } else {
      collapse.hide();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!taskListRef.current || sortableRef.current) return;

    sortableRef.current = Sortable.create(taskListRef.current, {
      draggable: ".task-card",
      handle: ".task-grip",
      animation: 150,
      ghostClass: "task-card-ghost",
      chosenClass: "task-card-chosen",
      dragClass: "task-card-dragging",
      fallbackClass: "task-card-fallback",
      filter: "input:not(.task-grip), button:not(.task-grip), a, .task-select, .details-btn",
      preventOnFilter: false,
      fallbackTolerance: 4,
      touchStartThreshold: 4,
      delayOnTouchOnly: true,
      delay: 100,
      swapThreshold: 0.65,
      onEnd: (event: SortableEvent) => {
        if (event.oldIndex == null || event.newIndex == null || event.oldIndex === event.newIndex) {
          return;
        }

        onMoveTask(event.oldIndex, event.newIndex);
      }
    });

    return () => {
      sortableRef.current?.destroy();
      sortableRef.current = null;
    };
  }, [onMoveTask]);

  useEffect(() => {
    sortableRef.current?.option("disabled", isLocked || !isOpen);
  }, [isLocked, isOpen]);

  const addTaskFab = isOpen ? (
    <CoachButton
      id="add-task-btn"
      type="button"
      className="add-task-fab"
      variant="primary"
      disabled={isLocked}
      aria-label="Add new task"
      title="Add new task"
      testId="morning-tasks-add-task-button"
      onClick={onAddTask}
    >
      <i className="bi bi-plus-lg" />
    </CoachButton>
  ) : null;

  return (
    <section className="section-card tasks-glass-section p-3" aria-labelledby="tasks-title" data-testid="morning-tasks-step-section">
      <div className={isOpen ? "step-header mb-2" : "step-header mb-4 mb-collapsed"}>
        <div className="flex-grow-1">
          <button
            className="step-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="tasks-body"
            onClick={() => onSelectStep(2)}
          >
            <h2 id="tasks-title" className="h4 mb-2">
              Rank the task list
            </h2>
          </button>
          <p className="text-secondary mb-0">
            Drag tasks into the right order, check complexity load, and open details or actions as needed.
          </p>
        </div>

        <div className="step-header-actions d-flex align-items-center gap-2">
          <CoachButton
            id="remove-selected-btn"
            type="button"
            className="rounded-pill px-3 py-2"
            variant="danger"
            disabled={!canRemoveSelected || isLocked}
            aria-label="Remove selected tasks"
            title="Remove selected tasks"
            testId="morning-tasks-remove-selected-button"
            onClick={() => setIsRemoveChoiceOpen(true)}
          >
            <i className="bi bi-trash" />
          </CoachButton>

          <CoachButton
            type="button"
            className="rounded-pill px-3 py-2"
            variant="outline"
            onClick={onShowHelp}
          >
            Help
          </CoachButton>
        </div>
      </div>

      <div
        ref={bodyRef}
        id="tasks-body"
        className={isOpen ? "collapse show step-complete-body" : "collapse step-complete-body"}
      >
        <div ref={taskListRef} className="task-list-stage task-sortable-list d-flex flex-column gap-3" aria-label="Sortable task list" data-testid="morning-tasks-list">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              isLocked={isLocked}
              onOpenDetails={onOpenDetails}
              onToggleSelected={onToggleSelected}
              priority={index + 1}
              task={task}
              testId={`morning-tasks-task-item-${task.id}`}
            />
          ))}
        </div>

        <div className="tasks-footer d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mt-2 pt-3">
          <CoachButton
            id="confirm-button"
            className="rounded-pill px-4"
            type="button"
            disabled={isLocked}
            testId="morning-tasks-confirm-button"
            onClick={onConfirm}
          >
            Confirm tasks and go to Today
          </CoachButton>
        </div>
      </div>

      {typeof document !== "undefined" && addTaskFab ? createPortal(addTaskFab, document.body) : null}

      {isRemoveChoiceOpen ? (
        <>
          <div className="modal fade show d-block" role="dialog" aria-modal="true" aria-label="Remove selected tasks" data-testid="morning-remove-selected-modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header">
                  <h2 className="modal-title fs-5">Remove selected tasks</h2>
                  <button type="button" className="btn-close" aria-label="Close" data-testid="morning-remove-selected-close-button" onClick={() => setIsRemoveChoiceOpen(false)} />
                </div>

                <div className="modal-body">
                  <p className="mb-0 text-secondary">
                    Should selected tasks be completely deleted, or only removed from this planner and kept in backlog?
                  </p>
                </div>

                <div className="modal-footer remove-selected-actions">
                  <div className="remove-selected-cancel">
                    <CoachButton type="button" variant="outline" testId="morning-remove-selected-cancel-button" onClick={() => setIsRemoveChoiceOpen(false)}>
                      Cancel
                    </CoachButton>
                  </div>

                  <div className="remove-selected-primary">
                    <CoachButton
                      type="button"
                      variant="outline"
                      testId="morning-remove-selected-from-planner-button"
                      onClick={() => {
                        onRemoveSelected("remove");
                        setIsRemoveChoiceOpen(false);
                      }}
                    >
                      Remove from planner
                    </CoachButton>

                    <CoachButton
                      type="button"
                      variant="danger"
                      testId="morning-remove-selected-delete-button"
                      onClick={() => {
                        onRemoveSelected("delete");
                        setIsRemoveChoiceOpen(false);
                      }}
                    >
                      Delete completely
                    </CoachButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={() => setIsRemoveChoiceOpen(false)} />
        </>
      ) : null}
    </section>
  );
};



