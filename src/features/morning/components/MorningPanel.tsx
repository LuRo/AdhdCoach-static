import { cn } from "../../../shared/utils/cn";
import type { EnergyLevel, RemoveSelectedMode, Task } from "../types";
import { ComplexitySummaryCard } from "./ComplexitySummaryCard";
import { EnergyStepSection } from "./EnergyStepSection";
import { TasksStepSection } from "./TasksStepSection";
import { StepMarker } from "./StepMarker";
import { useI18n } from "../../../i18n";

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
  onTestDateChange: (date: string) => void;
  onToggleSelected: (taskId: string, checked: boolean) => void;
  selectedEnergy: EnergyLevel;
  selectedTestDate: string;
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
  onTestDateChange,
  onToggleSelected,
  selectedEnergy,
  selectedTestDate,
  tasks,
  tasksLocked,
  totalComplexity
}: Props) => {
  const { copy } = useI18n();

  return (
    <section
      id="morning-panel"
      className={cn("section-panel", isActive && "active")}
      role="tabpanel"
      aria-labelledby="morning-heading"
    >
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div className="flex-grow-1">
          <p className="text-uppercase small fw-semibold text-secondary mb-2">{copy.pages.morning.subtitle}</p>
          <h1 id="morning-heading" className="h2 mb-2">{copy.pages.morning.title}</h1>
          <p className="text-secondary mb-3 mb-lg-0">{copy.pages.morning.description}</p>
        </div>

        <div className="d-grid gap-2 min-w-0">
          <label className="d-grid gap-1">
            <span className="small text-secondary fw-semibold">{copy.ui.planner.testDateLabel}</span>
            <input
              type="date"
              className="form-control"
              value={selectedTestDate}
              onChange={(event) => onTestDateChange(event.target.value)}
            />
          </label>
          <div className="small text-secondary">{copy.ui.planner.localStorageNote}</div>
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
        <div>{copy.ui.planner.complexityWarning}</div>
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
};





