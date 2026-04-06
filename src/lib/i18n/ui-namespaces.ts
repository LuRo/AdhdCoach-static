export const UI_BACKEND_NAMESPACES = [
  "planner",
  "complexitySummaryCard",
  "energyStepSection",
  "tasksStepSection",
  "addTaskModal",
  "taskDetailsModal",
  "step2HelpModal",
  "placeholderPanel",
  "pomodoroOverlay",
  "taskCard",
  "todayTaskCard",
  "todayPanel",
  "debriefingPage"
] as const;

export type UiBackendNamespace = (typeof UI_BACKEND_NAMESPACES)[number];
