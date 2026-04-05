import { createPortal } from "react-dom";
import type { DaySpeedMultiplier, PomodoroMinutes, TodayTask } from "../types";
import type { TestModeSettings } from "../store";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import { TodayTaskCard } from "./TodayTaskCard";

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
  testModeSettings: TestModeSettings;
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
  testDaySpeed,
  testModeSettings
}: Props) => {
  const openTasks = tasks.filter((task) => !task.done);
  const achievedTasks = tasks.filter((task) => task.done);
  const showTestSpeedControl = testModeSettings.enabled && testModeSettings.todaySpeedEnabled;

  const addTaskFab = isActive ? (
    <CoachButton
      id="today-add-task-btn"
      type="button"
      className="add-task-fab"
      variant="primary"
      aria-label="Add new task"
      title="Add new task"
      testId="today-add-task-button"
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
        aria-labelledby="Today"
        data-testid="today-panel"
      >
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase small fw-semibold text-secondary mb-2">Today execution</p>
            <h1 className="h2 mb-2">Work from your confirmed morning plan</h1>
            <p className="text-secondary mb-0">Click the timer circle to open the Pomodoro overlay.</p>
          </div>

          <div className="d-grid gap-2 min-w-0">
            {showTestSpeedControl ? (
              <>
                <span className="small fw-semibold text-secondary">Test day speed</span>
                <div className="d-flex flex-wrap gap-2" role="group" aria-label="Test day speed" data-testid="today-speed-group">
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
                <div className="small text-secondary">Simulation only. All running timers advance at the selected speed.</div>
              </>
            ) : (
              <div className="small text-secondary">Today is running at live speed.</div>
            )}
          </div>
        </div>

        <section className="section-card tasks-glass-section today-section-card p-3" aria-labelledby="today-tasks-title">
          <div className="step-header mb-2">
            <div className="flex-grow-1">
              <h2 id="today-tasks-title" className="h4 mb-2">
                Today tasks
              </h2>
              <p className="text-secondary mb-0">Only the top unblocked task can start. Block unlocks the next task.</p>
            </div>
          </div>

          <div className="task-list-stage d-flex flex-column gap-3" aria-label="Today task list" data-testid="today-open-task-list">
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
                  testId={`today-open-task-item-${task.id}`}
                />
              ))
            ) : (
              <div className="alert alert-success mb-0">All planned tasks are completed.</div>
            )}
          </div>
        </section>

        <section className="section-card tasks-glass-section today-section-card p-3 mt-3" aria-labelledby="today-achieved-title">
          <div className="step-header mb-2">
            <div className="flex-grow-1">
              <h2 id="today-achieved-title" className="h4 mb-2">
                Achieved goals of today
              </h2>
              <p className="text-secondary mb-0">Completed items are moved here automatically.</p>
            </div>
          </div>

          <div className="task-list-stage d-flex flex-column gap-3" aria-label="Achieved goals of today" data-testid="today-achieved-task-list">
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
                  testId={`today-achieved-task-item-${task.id}`}
                />
              ))
            ) : (
              <div className="text-secondary small">No completed goals yet.</div>
            )}
          </div>
        </section>
      </section>

      {typeof document !== "undefined" && addTaskFab ? createPortal(addTaskFab, document.body) : null}
    </>
  );
};
