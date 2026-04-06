import { MorningPanel } from "../component/MorningPanel";
import type { useMorningPlanner } from "../hooks/useMorningPlanner";

type PlannerState = ReturnType<typeof useMorningPlanner>;

interface Props {
  planner: PlannerState;
}

export const MorningPage = ({ planner }: Props) => (
  <MorningPanel
    canRemoveSelected={planner.hasTaskSelection}
    complexityStatus={planner.complexity.status}
    currentStep={planner.currentStep}
    gaugeAngle={planner.gauge.angle}
    gaugeTransition={planner.gauge.transition}
    isActive
    onAddTask={planner.openAddTaskModal}
    onChooseEnergy={planner.chooseEnergy}
    onConfirmTasks={planner.confirmTasks}
    onMoveTask={planner.moveTask}
    onOpenDetails={planner.openTaskDetails}
    onRecalculateGauge={planner.triggerGaugeRecalculation}
    onRemoveSelected={planner.removeSelectedTasks}
    onSelectStep={planner.openStep}
    onShowHelp={() => planner.setIsHelpOpen(true)}
    onTestDateChange={planner.setSelectedTestDate}
    onToggleSelected={planner.toggleTaskSelected}
    selectedEnergy={planner.selectedEnergy}
    selectedTestDate={planner.selectedTestDate}
    tasks={planner.tasks}
    tasksLocked={planner.tasksLocked}
    testModeSettings={planner.testModeSettings}
    totalComplexity={planner.complexity.total}
  />
);
