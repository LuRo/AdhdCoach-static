import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { PomodoroMinutes, TodayTask } from "../types";
import { useI18n } from "../../../i18n";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";

interface Props {
  onClose: () => void;
  onStart: (taskId: string, minutes: PomodoroMinutes) => void;
  onStop: (taskId: string) => void;
  task: TodayTask | null;
}

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

export const PomodoroOverlay = ({ onClose, onStart, onStop, task }: Props) => {
  const { copy } = useI18n();
  const [selectedMinutes, setSelectedMinutes] = useState<PomodoroMinutes>(5);

  useEffect(() => {
    if (task) {
      setSelectedMinutes(task.pomodoroMinutes);
    }
  }, [task]);

  if (!task || typeof document === "undefined") {
    return null;
  }

  const totalPomodoroSeconds = task.pomodoroMinutes * 60;
  const remainingFraction = totalPomodoroSeconds > 0 ? Math.max(0, Math.min(task.timerRemainingSeconds / totalPomodoroSeconds, 1)) : 0;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - remainingFraction);

  return createPortal(
    <>
      <div className="pomodoro-overlay" role="dialog" aria-modal="true" aria-label={copy.ui.pomodoroOverlay.ariaLabel} data-testid="today-pomodoro-overlay">
        <div className="pomodoro-overlay-card">
          <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <p className="text-uppercase small text-secondary mb-1">{copy.ui.pomodoroOverlay.title}</p>
              <h2 className="h4 mb-1">{task.title}</h2>
              <p className="text-secondary mb-0">{copy.ui.pomodoroOverlay.cycle.replace("{{minutes}}", String(task.pomodoroMinutes))}</p>
            </div>

            <CoachButton type="button" variant="outline" onClick={onClose} testId="today-pomodoro-close-button">
              {copy.ui.pomodoroOverlay.close}
            </CoachButton>
          </div>

          <div className="d-flex justify-content-center gap-2 mb-3">
            {DURATION_OPTIONS.map((minutes) => (
              <CoachButton
                key={minutes}
                type="button"
                variant={selectedMinutes === minutes ? "primary" : "outline"}
                className="rounded-pill px-2 py-1"
                testId={`today-pomodoro-duration-${minutes}-button`}
                onClick={() => setSelectedMinutes(minutes)}
              >
                {minutes}m
              </CoachButton>
            ))}

            <CoachButton
              type="button"
              variant="primary"
              className="rounded-pill px-3 py-1"
              testId="today-pomodoro-start-button"
              onClick={() => onStart(task.id, selectedMinutes)}
            >
              <i className="bi bi-play-fill" /> {copy.ui.pomodoroOverlay.start}
            </CoachButton>
          </div>

          <div className="pomodoro-overlay-timer">
            <svg viewBox="0 0 280 280" width="280" height="280" aria-hidden="true">
              <circle cx="140" cy="140" r={radius} className="pomodoro-overlay-track" />
              <circle cx="140" cy="140" r={radius} className="pomodoro-overlay-progress" strokeDasharray={circumference} strokeDashoffset={dashOffset} />
            </svg>
            <div className="pomodoro-overlay-time-row">
              <div className="pomodoro-overlay-time">{formatSeconds(task.timerRemainingSeconds)}</div>
              <CoachButton
                type="button"
                variant="outline"
                className="rounded-pill px-3 py-1"
                disabled={!task.timerRunning}
                testId="today-pomodoro-stop-button"
                onClick={() => onStop(task.id)}
              >
                <i className="bi bi-stop-fill" />
              </CoachButton>
            </div>
          </div>
        </div>
      </div>

      <div className="pomodoro-overlay-backdrop" onClick={onClose} />
    </>,
    document.body
  );
};

