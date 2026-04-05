import { createPortal } from "react-dom";
import type { DaySpeedMultiplier, PomodoroMinutes, TodayTask } from "../types";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import { TodayTaskCard } from "./TodayTaskCard";
import { useI18n } from "../../../i18n";

interface Props {
  activeTaskId: string | null;
  isActive: boolean;
  onAddTask: () => void;
  onBlockTask: (taskId: string) => void;
  onOpenPomodoroOverlay: (taskId: string) => void;
  onStartPomodoro: (taskId: string, minutes: PomodoroMinutes) => void;
  onStartWorkTimer: (taskId: string) => void;
  onStopPomodoro: (taskId: string) => void;
  onTestDaySpeedChange: (speed: DaySpeedMultiplier) => void;
  onToggleDone: (taskId: string, checked: boolean) => void;
  tasks: TodayTask[];
  testDaySpeed: DaySpeedMultiplier;
}

const SPEED_OPTIONS: DaySpeedMultiplier[] = [1, 10, 20, 50, 100];

export const TodayPanel = ({
  activeTaskId,
  isActive,
  onAddTask,
  onBlockTask,
  onOpenPomodoroOverlay,
  onStartPomodoro,
  onStartWorkTimer,
  onStopPomodoro,
  onTestDaySpeedChange,
  onToggleDone,
  tasks,
  testDaySpeed
}: Props) => {
  const { copy } = useI18n();
  const openTasks = tasks.filter((task) => !task.done);
  const achievedTasks = tasks.filter((task) => task.done);

  const addTaskFab = isActive ? (
    <CoachButton
      id="today-add-task-btn"
      type="button"
      className="add-task-fab"
      variant="primary"
      aria-label={copy.ui.tasksStepSection.addTaskAria}
      title={copy.ui.tasksStepSection.addTaskAria}
      onClick={onAddTask}
    >
      <i className="bi bi-plus-lg" />
    </CoachButton>
  ) : null;

  return (
    <>
      <section
        id="today-panel"
        className={isActive ? "section-panel active" : "section-panel"}
        role="tabpanel"
        aria-labelledby="today-heading"
      >
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase small fw-semibold text-secondary mb-2">{copy.ui.todayPanel.eyebrow}</p>
            <h1 id="today-heading" className="h2 mb-2">{copy.ui.todayPanel.title}</h1>
            <p className="text-secondary mb-0">{copy.ui.todayPanel.intro}</p>
          </div>

          <div className="d-grid gap-2 min-w-0">
            <span className="small fw-semibold text-secondary">{copy.ui.todayPanel.speedLabel}</span>
            <div className="d-flex flex-wrap gap-2" role="group" aria-label={copy.ui.todayPanel.speedAria}>
              {SPEED_OPTIONS.map((speed) => (
                <CoachButton
                  key={speed}
                  type="button"
                  variant={testDaySpeed === speed ? "primary" : "outline"}
                  className="rounded-pill px-3 py-1"
                  onClick={() => onTestDaySpeedChange(speed)}
                >
                  {speed}x
                </CoachButton>
              ))}
            </div>
            <div className="small text-secondary">{copy.ui.todayPanel.simulationNote}</div>
          </div>
        </div>

        <section className="section-card tasks-glass-section today-section-card p-3" aria-labelledby="today-tasks-title">
          <div className="step-header mb-2">
            <div className="flex-grow-1">
              <h2 id="today-tasks-title" className="h4 mb-2">
                {copy.ui.todayPanel.tasksTitle}
              </h2>
              <p className="text-secondary mb-0">{copy.ui.todayPanel.tasksDescription}</p>
            </div>
          </div>

          <div className="task-list-stage d-flex flex-column gap-3" aria-label={copy.ui.todayPanel.tasksTitle}>
            {openTasks.length > 0 ? (
              openTasks.map((task, index) => (
                <TodayTaskCard
                  key={task.id}
                  isActiveTask={task.id === activeTaskId}
                  isDone={task.done}
                  onBlockTask={onBlockTask}
                  onOpenPomodoroOverlay={onOpenPomodoroOverlay}
                  onStartPomodoro={onStartPomodoro}
                  onStartWorkTimer={onStartWorkTimer}
                  onStopPomodoro={onStopPomodoro}
                  onToggleDone={onToggleDone}
                  priority={index + 1}
                  task={task}
                />
              ))
            ) : (
              <div className="alert alert-success mb-0">{copy.ui.todayPanel.allCompleted}</div>
            )}
          </div>
        </section>

        <section className="section-card tasks-glass-section today-section-card p-3 mt-3" aria-labelledby="today-achieved-title">
          <div className="step-header mb-2">
            <div className="flex-grow-1">
              <h2 id="today-achieved-title" className="h4 mb-2">
                {copy.ui.todayPanel.achievedTitle}
              </h2>
              <p className="text-secondary mb-0">{copy.ui.todayPanel.achievedDescription}</p>
            </div>
          </div>

          <div className="task-list-stage d-flex flex-column gap-3" aria-label={copy.ui.todayPanel.achievedTitle}>
            {achievedTasks.length > 0 ? (
              achievedTasks.map((task) => (
                <TodayTaskCard
                  key={task.id}
                  isActiveTask={false}
                  isDone={task.done}
                  onBlockTask={onBlockTask}
                  onOpenPomodoroOverlay={onOpenPomodoroOverlay}
                  onStartPomodoro={onStartPomodoro}
                  onStartWorkTimer={onStartWorkTimer}
                  onStopPomodoro={onStopPomodoro}
                  onToggleDone={onToggleDone}
                  task={task}
                />
              ))
            ) : (
              <div className="text-secondary small">{copy.ui.todayPanel.noCompleted}</div>
            )}
          </div>
        </section>
      </section>

      {typeof document !== "undefined" && addTaskFab ? createPortal(addTaskFab, document.body) : null}
    </>
  );
};


