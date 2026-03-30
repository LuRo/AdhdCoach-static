import { DashboardTemplate } from "../components/templates/DashboardTemplate";
import { useMorningPlanner } from "../features/morning/hooks/useMorningPlanner";
import { MorningPanel } from "../components/organisms/MorningPanel";
import { PlaceholderPanel } from "../components/organisms/PlaceholderPanel";
import { cn } from "./cn";
import { TaskDetailsModal } from "../components/organisms/TaskDetailsModal";
import { Step2HelpModal } from "../components/organisms/Step2HelpModal";
import { AddTaskModal } from "../components/organisms/AddTaskModal";
import { TodayPanel } from "../components/organisms/TodayPanel";
import { PomodoroOverlay } from "../components/organisms/PomodoroOverlay";

export const App = () => {
  const planner = useMorningPlanner();

  return (
    <>
      <DashboardTemplate activeTab={planner.activeTab} onSelectTab={planner.setActiveTabFromPanel}>
        <MorningPanel
          canRemoveSelected={planner.hasTaskSelection}
          complexityStatus={planner.complexity.status}
          currentStep={planner.currentStep}
          gaugeAngle={planner.gauge.angle}
          gaugeTransition={planner.gauge.transition}
          isActive={planner.activeTab === "morning"}
          onAddTask={planner.openAddTaskModal}
          onChooseEnergy={planner.chooseEnergy}
          onConfirmTasks={planner.confirmTasks}
          onMoveTask={planner.moveTask}
          onOpenDetails={planner.openTaskDetails}
          onRecalculateGauge={planner.triggerGaugeRecalculation}
          onRemoveSelected={planner.removeSelectedTasks}
          onSelectStep={planner.openStep}
          onShowHelp={() => planner.setIsHelpOpen(true)}
          onToggleSelected={planner.toggleTaskSelected}
          selectedEnergy={planner.selectedEnergy}
          tasks={planner.tasks}
          tasksLocked={planner.tasksLocked}
          totalComplexity={planner.complexity.total}
        />

        <TodayPanel
          activeTaskId={planner.activeTodayTaskId}
          isActive={planner.activeTab === "today"}
          onAddTask={planner.openAddTaskModal}
          onBlockTask={planner.blockTodayTask}
          onOpenPomodoroOverlay={planner.openPomodoroOverlay}
          onStartPomodoro={planner.startTodayTaskPomodoro}
          onStartWorkTimer={planner.startTodayTaskWorkTimer}
          onStopPomodoro={planner.stopTodayTaskPomodoro}
          onToggleDone={planner.toggleTodayTaskDone}
          tasks={planner.todayTasks}
        />

        <section
          id="debriefing-panel"
          className={cn("section-panel", planner.activeTab === "debriefing" && "active")}
          role="tabpanel"
          aria-labelledby="Debriefing"
        >
          <PlaceholderPanel panelKey="debriefing" />
        </section>
      </DashboardTemplate>

      <TaskDetailsModal
        isOpen={Boolean(planner.selectedTask)}
        onClose={planner.closeTaskDetails}
        task={planner.selectedTask}
      />

      <PomodoroOverlay
        task={planner.pomodoroOverlayTask}
        onClose={planner.closePomodoroOverlay}
        onStart={planner.startTodayTaskPomodoro}
        onStop={planner.stopTodayTaskPomodoro}
      />

      <Step2HelpModal isOpen={planner.isHelpOpen} onClose={() => planner.setIsHelpOpen(false)} />

      <AddTaskModal
        backlogTasks={planner.backlogTasks}
        isOpen={planner.isAddTaskModalOpen}
        onAddFromBacklog={planner.addTaskFromBacklog}
        onClose={planner.closeAddTaskModal}
        onCreateTask={planner.createTask}
      />
    </>
  );
};
