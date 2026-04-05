export type TabId = "morning" | "today" | "debriefing";
export type EnergyLevel = "Low" | "Medium" | "High";
export type StepId = 1 | 2;
export type RemoveSelectedMode = "remove" | "delete";
export type PomodoroMinutes = 5 | 10 | 15 | 20;
export type DaySpeedMultiplier = 1 | 10 | 20 | 50 | 100;

export interface NavTab {
  id: TabId;
  panelId: `${TabId}-panel`;
  title: string;
  subtitle: string;
  iconClass: string;
}

export interface Task {
  id: string;
  title: string;
  summary: string;
  details: string;
  actions: string[];
  complexity: number;
  selected: boolean;
  done: boolean;
}

export interface TodayTask extends Task {
  pomodoroMinutes: PomodoroMinutes;
  timerRemainingSeconds: number;
  timerRunning: boolean;
  blocked: boolean;
  blockedAt?: number | null;
  workElapsedSeconds: number;
  workTimerRunning: boolean;
}

export interface BacklogTask extends Task {
  dueDate?: string | null;
}

export interface CreateTaskInput {
  title: string;
  summary?: string;
  complexity: number;
  storeInBacklog: boolean;
  dueDate?: string | null;
}

export interface ComplexitySnapshot {
  total: number;
  status: "Light" | "Moderate" | "Overloaded";
  angle: number;
}