import { cn } from "../../app/cn";
import type { EnergyLevel, RemoveSelectedMode, Task } from "../../features/morning/types";
import { ComplexitySummaryCard } from "./ComplexitySummaryCard";
import { EnergyStepSection } from "./EnergyStepSection";
import { TasksStepSection } from "./TasksStepSection";
import { StepMarker } from "../molecules/StepMarker";

interface Props {
  canRemoveSelected: boolean;
  complexityStatus: "Light" | "Moderate" | "Overloaded";
  currentStep: 1 | 2;
  gaugeAngle: number;
  gaugeTransition: string;
  isActive: boolean;
  onAddTask: () => void;
  onChooseEnergy: (level: EnergyLevel) => void;
  onConfirmTasks: () => void;
  onMoveTask: (from: number, to: number) => void;
  onOpenDetails: (taskId: string) => void;
  onRecalculateGauge: () => void;
  onRemoveSelected: (mode: RemoveSelectedMode) => void;
  onSelectStep: (step: 1 | 2) => void;
  onShowHelp: () => void;
  onToggleSelected: (taskId: string, checked: boolean) => void;
  selectedEnergy: EnergyLevel;
  tasks: Task[];
  tasksLocked: boolean;
  totalComplexity: number;
}

export const MorningPanel = ({
  canRemoveSelected,
  complexityStatus,
  currentStep,
  gaugeAngle,
  gaugeTransition,
  isActive,
  onAddTask,
  onChooseEnergy,
  onConfirmTasks,
  onMoveTask,
  onOpenDetails,
  onRecalculateGauge,
  onRemoveSelected,
  onSelectStep,
  onShowHelp,
  onToggleSelected,
  selectedEnergy,
  tasks,
  tasksLocked,
  totalComplexity
}: Props) => (
  <section
    id="morning-panel"
    className={cn("section-panel", isActive && "active")}
    role="tabpanel"
    aria-labelledby="Morning"
  >
    <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
      <div>
        <p className="text-uppercase small fw-semibold text-secondary mb-2">Morning sequence</p>
        <h1 className="h2 mb-2">Build a plan that matches today&apos;s capacity</h1>
        <p className="text-secondary mb-0">
          Capture energy first, then shape the task load before making a commitment.
        </p>
      </div>

      <ComplexitySummaryCard
        gaugeAngle={gaugeAngle}
        gaugeTransition={gaugeTransition}
        onRecalculate={onRecalculateGauge}
        snapshot={{ angle: gaugeAngle, status: complexityStatus, total: totalComplexity }}
      />
    </div>

    <div
      id="complexity-warning"
      className={
        totalComplexity > 10
          ? "alert alert-danger d-flex align-items-center gap-2"
          : "alert alert-danger d-none align-items-center gap-2"
      }
      role="alert"
    >
      <i className="bi bi-exclamation-triangle-fill" />
      <div>Total planned complexity is above the recommended threshold for a focused day.</div>
    </div>

    <div className="morning-steps">
      <div className="step-row align-items-start">
        <StepMarker currentStep={currentStep} step={1} onSelectStep={onSelectStep} className="pt-md-3" />

        <EnergyStepSection
          currentStep={currentStep}
          onChooseEnergy={onChooseEnergy}
          onSelectStep={onSelectStep}
          selectedEnergy={selectedEnergy}
        />
      </div>

      <div className="step-row align-items-start">
        <StepMarker currentStep={currentStep} step={2} onSelectStep={onSelectStep} className="pt-md-4" />

        <TasksStepSection
          canRemoveSelected={canRemoveSelected}
          currentStep={currentStep}
          isLocked={tasksLocked}
          onAddTask={onAddTask}
          onConfirm={onConfirmTasks}
          onMoveTask={onMoveTask}
          onOpenDetails={onOpenDetails}
          onRemoveSelected={onRemoveSelected}
          onSelectStep={onSelectStep}
          onShowHelp={onShowHelp}
          onToggleSelected={onToggleSelected}
          tasks={tasks}
        />
      </div>
    </div>
  </section>
);
