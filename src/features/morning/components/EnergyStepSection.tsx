import { useEffect, useRef } from "react";
import { useI18n } from "../../../i18n";
import type { EnergyLevel } from "../types";
import { EnergyOption } from "./EnergyOption";

interface Props {
  currentStep: 1 | 2;
  onChooseEnergy: (level: EnergyLevel) => void;
  onSelectStep: (step: 1 | 2) => void;
  selectedEnergy: EnergyLevel;
  testId?: string;
}

const options: Array<{ iconClass: string; level: EnergyLevel }> = [
  { iconClass: "bi bi-emoji-frown", level: "Low" },
  { iconClass: "bi bi-emoji-neutral", level: "Medium" },
  { iconClass: "bi bi-emoji-smile", level: "High" }
];

export const EnergyStepSection = ({ currentStep, onChooseEnergy, onSelectStep, selectedEnergy, testId }: Props) => {
  const { copy } = useI18n();
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const isOpen = currentStep === 1;

  useEffect(() => {
    const bootstrap = (window as unknown as { bootstrap?: any }).bootstrap;
    if (!bootstrap?.Collapse || !bodyRef.current) return;

    const collapse = bootstrap.Collapse.getOrCreateInstance(bodyRef.current, { toggle: false });
    if (isOpen) {
      collapse.show();
    } else {
      collapse.hide();
    }
  }, [isOpen]);

  return (
    <section className="section-card tasks-glass-section p-3 p-lg-3 p-xl-3 energy-step-compact" aria-labelledby="energy-title" data-testid={testId ?? "morning-energy-step-section"}>
      <div className="step-header mb-2">
        <div className="flex-grow-1">
          <button
            className="step-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="energy-body"
            onClick={() => onSelectStep(1)}
          >
            <h2 id="energy-title" className="h4 mb-0">
              {copy.ui.energyStepSection.title}
            </h2>
          </button>
        </div>
      </div>

      <div
        ref={bodyRef}
        id="energy-body"
        className={isOpen ? "collapse show step-complete-body" : "collapse step-complete-body"}
      >
        <p className="text-secondary mb-2">{copy.ui.energyStepSection.description}</p>

        <div className="energy-choice">
          <div className="energy-toggle gap-md-3" role="group" aria-label={copy.ui.energyStepSection.groupAria} data-testid="morning-energy-selection-group">
            {options.map((option) => (
              <EnergyOption
                key={option.level}
                iconClass={option.iconClass}
                isSelected={selectedEnergy === option.level}
                level={option.level}
                onActivateSelected={() => onSelectStep(2)}
                onSelect={onChooseEnergy}
                testId={`morning-energy-option-${option.level.toLowerCase()}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
