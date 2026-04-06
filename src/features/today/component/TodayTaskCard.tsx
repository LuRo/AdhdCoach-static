import { useMemo } from "react";
import { useI18n } from "../../../lib/i18n";
import { cn } from "../../../lib/utils/cn";
import type { PomodoroMinutes, TodayTask } from "../../morning/types";
import { CoachButton } from "../../../components/ui/CoachButton";

interface Props {
  isActiveTask: boolean;
  isDone: boolean;
  onBlockTask: (taskId: string) => void;
  onOpenPomodoroOverlay: (taskId: string) => void;
  onStartPomodoro: (taskId: string, minutes: PomodoroMinutes) => void;
  onStartWorkTimer: (taskId: string) => void;
  onStopPomodoro: (taskId: string) => void;
  onToggleDone: (taskId: string, checked: boolean) => void;
  priority?: number;
  task: TodayTask;
  testId?: string;
}

const complexityClassByValue: Record<number, string> = {
  1: "complexity-small",
  2: "complexity-small",
  3: "complexity-medium",
  4: "complexity-medium",
  5: "complexity-large"
};

const DURATION_OPTIONS: PomodoroMinutes[] = [5, 10, 15, 20];

const formatSeconds = (seconds: number): string => {
  const safe = Math.max(seconds, 0);
  const mm = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
};

const formatElapsed = (seconds: number): string => {
  const safe = Math.max(seconds, 0);
  const hh = Math.floor(safe / 3600)
    .toString()
    .padStart(2, "0");
  const mm = Math.floor((safe % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const TodayTaskCard = ({
  isActiveTask,
  isDone,
  onBlockTask,
  onOpenPomodoroOverlay,
  onStartPomodoro,
  onStartWorkTimer,
  onStopPomodoro,
  onToggleDone,
  priority,
  task,
  testId
}: Props) => {
  const { copy } = useI18n();
  const ui = copy.ui.todayTaskCard;

  const complexityClass = useMemo(() => {
    if (task.complexity >= 5) {
      return "complexity-large";
    }

    return complexityClassByValue[task.complexity] ?? "complexity-medium";
  }, [task.complexity]);

  const totalPomodoroSeconds = task.pomodoroMinutes * 60;
  const remainingFraction =
    totalPomodoroSeconds > 0 ? Math.max(0, Math.min(task.timerRemainingSeconds / totalPomodoroSeconds, 1)) : 0;

  const pomodoroRadius = 20;
  const pomodoroCircumference = 2 * Math.PI * pomodoroRadius;
  const pomodoroDashOffset = pomodoroCircumference * (1 - remainingFraction);

  const fourHoursSeconds = 4 * 60 * 60;
  const borderProgress = Math.max(0, Math.min(task.workElapsedSeconds / fourHoursSeconds, 1));

  return (
    <article className={cn("task-card today-task-card p-3 p-lg-4", isDone && "today-task-card-done")} data-testid={testId ?? `morning-today-task-card-${task.id}`}>
      {task.workElapsedSeconds > 0 ? (
        <div className="today-task-work-progress" aria-hidden="true">
          <div className="today-task-work-progress-fill" style={{ width: `${borderProgress * 100}%` }} />
        </div>
      ) : null}

      <div className="d-flex align-items-center">
        <div className="today-task-side d-flex flex-column align-items-start justify-content-start gap-1 ps-2 pe-2">
          <span className="small text-secondary fw-semibold">{formatElapsed(task.workElapsedSeconds)}</span>
          {task.blocked && !isDone ? (
            <span className="badge text-bg-warning today-tracking-pill">{ui.blocked}</span>
          ) : task.workTimerRunning && !isDone ? (
            <span className="badge text-bg-purple today-tracking-pill">{ui.tracking}</span>
          ) : (
            <span className="today-tracking-pill-spacer" aria-hidden="true" />
          )}

          <div className="d-flex align-items-center">
            <input
              className="form-check-input task-select"
              type="checkbox"
              checked={isDone}
              aria-label={ui.markDoneAria.replace("{{title}}", task.title)}
              data-testid={testId ? `${testId}-done-checkbox` : undefined}
              onChange={(event) => onToggleDone(task.id, event.currentTarget.checked)}
            />

            <div className="d-flex align-items-center ps-md-3 pe-md-3 ps-1 pe-2">
              <span
                className={cn("complexity-pill my-auto", complexityClass)}
                role="img"
                aria-label={ui.complexityAria.replace("{{value}}", String(task.complexity))}
                data-testid={testId ? `${testId}-complexity-indicator` : undefined}
              />
            </div>
          </div>
        </div>

        <div className="flex-grow-1 d-flex flex-column justify-content-between align-self-stretch">
          <div className="d-flex align-items-start justify-content-between gap-2">
            <div className={cn("task-text fw-semibold", isDone && "today-task-text-done")}>{task.title}</div>

            <div className="d-flex align-items-center gap-2">
              {isActiveTask && !isDone ? (
                <>
                  <CoachButton
                    type="button"
                    variant="outline"
                    className="rounded-pill px-3 py-1"
                    testId={testId ? `${testId}-start-work-button` : undefined}
                    onClick={() => onStartWorkTimer(task.id)}
                  >
                    <i className="bi bi-play-fill" /> <span className="task-action-label">{ui.play}</span>
                  </CoachButton>

                  <CoachButton
                    type="button"
                    variant="outline"
                    className="rounded-pill px-3 py-1"
                    testId={testId ? `${testId}-block-button` : undefined}
                    onClick={() => onBlockTask(task.id)}
                  >
                    <i className="bi bi-check2-square" /> <span className="task-action-label">{ui.block}</span>
                  </CoachButton>

                  <CoachButton
                    type="button"
                    variant="outline"
                    className="rounded-pill px-2 py-1 d-md-none"
                    onClick={() => onOpenPomodoroOverlay(task.id)}
                    aria-label={ui.openPomodoroAria}
                  >
                    <i className="bi bi-stopwatch" />
                  </CoachButton>
                </>
              ) : null}

              {typeof priority === "number" ? (
                <span className="priority-number fw-semibold text-purple">{priority}</span>
              ) : null}
            </div>
          </div>

          <div className="d-flex align-items-start justify-content-between gap-3 mt-2">
            <div className={cn("task-subtext small text-secondary", isDone && "today-task-text-done")}>{task.summary}</div>

            {isActiveTask && !isDone ? (
              <div className="today-pomodoro-block d-none d-md-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-1">
                  {DURATION_OPTIONS.map((minutes) => (
                    <CoachButton
                      key={minutes}
                      type="button"
                      variant={task.pomodoroMinutes === minutes && task.timerRunning ? "primary" : "outline"}
                      className="rounded-pill px-2 py-1 today-duration-btn"
                      testId={testId ? `${testId}-duration-${minutes}-button` : undefined}
                      onClick={() => onStartPomodoro(task.id, minutes)}
                    >
                      {minutes}{ui.minutesSuffix}
                    </CoachButton>
                  ))}
                </div>

                <button
                  type="button"
                  className="today-timer-visual d-flex align-items-center gap-2"
                  data-testid={testId ? `${testId}-timer-visual` : undefined}
                  onClick={() => onOpenPomodoroOverlay(task.id)}
                >
                  <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
                    <circle cx="24" cy="24" r={pomodoroRadius} className="today-timer-track" />
                    <circle
                      cx="24"
                      cy="24"
                      r={pomodoroRadius}
                      className="today-timer-progress"
                      strokeDasharray={pomodoroCircumference}
                      strokeDashoffset={pomodoroDashOffset}
                    />
                  </svg>
                  <span className="small fw-semibold text-purple">{formatSeconds(task.timerRemainingSeconds)}</span>
                </button>

                <CoachButton
                  type="button"
                  variant="outline"
                  className="rounded-pill px-2 py-1"
                  disabled={!task.timerRunning}
                  testId={testId ? `${testId}-stop-pomodoro-button` : undefined}
                  onClick={() => onStopPomodoro(task.id)}
                >
                  <i className="bi bi-stop-fill" />
                </CoachButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};
