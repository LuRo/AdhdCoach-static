import { cn } from "../../../lib/utils/cn";
import type { EnergyLevel } from "../types";

interface Props {
  iconClass: string;
  isSelected: boolean;
  level: EnergyLevel;
  onActivateSelected: () => void;
  onSelect: (level: EnergyLevel) => void;
  testId?: string;
}

export const EnergyOption = ({
  iconClass,
  isSelected,
  level,
  onActivateSelected,
  onSelect,
  testId
}: Props) => {
  const id = `energy-${level.toLowerCase()}`;

  return (
    <>
      <input
        id={id}
        className="btn-check energy-input"
        type="radio"
        name="energy"
        checked={isSelected}
        data-testid={testId}
        onChange={() => onSelect(level)}
      />
      <label
        className={cn("energy-option", isSelected && "energy-selected-ring", isSelected && "energy-active-spin")}
        htmlFor={id}
        onClick={(event) => {
          if (!isSelected) return;
          event.preventDefault();
          onActivateSelected();
        }}
      >
        <i className={iconClass} />
      </label>
    </>
  );
};

