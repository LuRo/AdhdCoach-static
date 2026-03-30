import { cn } from "../../app/cn";
import type { StepId } from "../../features/morning/types";

interface Props {
  currentStep: StepId;
  step: StepId;
  onSelectStep: (step: StepId) => void;
  className?: string;
}

export const StepMarker = ({ currentStep, onSelectStep, step, className }: Props) => {
  const isCompleted = step < currentStep;
  const stateClass = isCompleted ? "completed" : step === currentStep ? "active" : "pending";

  return (
    <div className={cn("step-marker d-flex align-items-start py-4 align-self-stretch", className)} aria-hidden="true">
      <div className={cn("step-item", stateClass)} data-step={step} onClick={() => onSelectStep(step)}>
        <span className="step-dot">{isCompleted ? <i className="bi bi-check-lg" aria-hidden="true" /> : step}</span>
      </div>
    </div>
  );
};

