import type { TestModeSettings } from "../store";
import { cn } from "../../../lib/utils/cn";
import type { EnergyLevel, RemoveSelectedMode, Task } from "../types";
import { useTranslation } from "react-i18next";
import { EditableTranslation } from "../../../lib/i18n";
import { ComplexitySummaryCard } from "./ComplexitySummaryCard";
import { EnergyStepSection } from "./EnergyStepSection";
import { TasksStepSection } from "./TasksStepSection";
import { StepMarker } from "./StepMarker";

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
  testModeSettings: TestModeSettings;
  totalComplexity: number;
}

const formatDotDate = (value: Date) => {
  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();
  return `${day}.${month}.${year}`;
};

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
  testModeSettings,
  totalComplexity
}: Props) => {
  const { t } = useTranslation();
  const showTestDateControl = testModeSettings.enabled && testModeSettings.morningDateEnabled;
  const currentDateLabel = formatDotDate(new Date());

  return (
    <section
      id="morning-panel"
      className={cn("section-panel", isActive && "active")}
      role="tabpanel"
      aria-labelledby="Morning"
      data-testid="morning-panel"
    >
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div className="flex-grow-1">
          <p className="text-uppercase small fw-semibold text-secondary mb-2">
            <EditableTranslation i18nKey="Morning sequence" defaultText="Morning sequence" />
          </p>
          <h1 className="h2 mb-2">
            <EditableTranslation i18nKey="Build a plan that matches today's capacity" defaultText="Build a plan that matches today's capacity" />
          </h1>
          <p className="text-secondary mb-1">
            <EditableTranslation i18nKey="Capture energy first, then shape the task load before making a commitment." defaultText="Capture energy first, then shape the task load before making a commitment." />
          </p>
          {!showTestDateControl ? (
            <div className="h5 mb-0">{t("Today is the {{date}}", { date: currentDateLabel })}</div>
          ) : null}
        </div>

        <div className="d-grid gap-2 min-w-0">
          {showTestDateControl ? (
            <label className="d-grid gap-1">
              <span className="small text-secondary fw-semibold">{t("Set current day manually")}</span>
              <input
                type="date"
                className="form-control"
                data-testid="morning-selected-date-input"
                value={selectedTestDate}
                onChange={(event) => onTestDateChange(event.target.value)}
              />
            </label>
          ) : null}
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
        data-testid="morning-complexity-warning"
      >
        <i className="bi bi-exclamation-triangle-fill" />
        <div>
          <EditableTranslation i18nKey="Total planned complexity is above the recommended threshold for a focused day." defaultText="Total planned complexity is above the recommended threshold for a focused day." />
        </div>
      </div>

      <div className="morning-steps" data-testid="morning-steps">
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
