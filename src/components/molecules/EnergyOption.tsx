import { cn } from "../../app/cn";
import type { EnergyLevel } from "../../features/morning/types";

interface Props {
  iconClass: string;
  isSelected: boolean;
  level: EnergyLevel;
  onActivateSelected: () => void;
  onSelect: (level: EnergyLevel) => void;
}

export const EnergyOption = ({
  iconClass,
  isSelected,
  level,
  onActivateSelected,
  onSelect
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
