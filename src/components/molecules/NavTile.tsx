import { cn } from "../../app/cn";
import type { NavTab, TabId } from "../../features/morning/types";

interface Props {
  activeTab: TabId;
  onSelect: (panelId: string) => void;
  tab: NavTab;
}

export const NavTile = ({ activeTab, onSelect, tab }: Props) => {
  const isActive = activeTab === tab.id;

  return (
    <button
      className={cn("nav-tile", isActive && "active")}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={tab.panelId}
      onClick={() => onSelect(tab.panelId)}
    >
      <i className={tab.iconClass} aria-hidden="true" />
      <span className="text-start">
        <span className="d-block fw-semibold">{tab.title}</span>
        <span className="small opacity-75">{tab.subtitle}</span>
      </span>
    </button>
  );
};
