import { TodayPanel } from "../components/TodayPanel";
import type { useMorningPlanner } from "../hooks/useMorningPlanner";

type PlannerState = ReturnType<typeof useMorningPlanner>;

interface Props {
  planner: PlannerState;
}

export const TodayPage = ({ planner }: Props) => (
  <TodayPanel
    activeTaskId={planner.activeTodayTaskId}
    isActive
    onAddTask={planner.openAddTaskModal}
    onBlockTask={planner.blockTodayTask}
    onOpenPomodoroOverlay={planner.openPomodoroOverlay}
    onStartPomodoro={planner.startTodayTaskPomodoro}
    onStartWorkTimer={planner.startTodayTaskWorkTimer}
    onStopPomodoro={planner.stopTodayTaskPomodoro}
    onTestDaySpeedChange={planner.setTestDaySpeed}
    onToggleDone={planner.toggleTodayTaskDone}
    tasks={planner.todayTasks}
    testDaySpeed={planner.testDaySpeed}
    testModeSettings={planner.testModeSettings}
  />
);
