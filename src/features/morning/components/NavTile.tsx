import { cn } from "../../../shared/utils/cn";
import type { NavTab, TabId } from "../types";

interface Props {
  activeTab: TabId;
  onSelect: (tabId: TabId) => void;
  tab: NavTab;
  testId?: string;
}

export const NavTile = ({ activeTab, onSelect, tab, testId }: Props) => {
  const isActive = activeTab === tab.id;

  return (
    <button
      className={cn("nav-tile", isActive && "active")}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={tab.panelId}
      data-testid={testId}
      onClick={() => onSelect(tab.id)}
    >
      <i className={tab.iconClass} aria-hidden="true" />
      <span className="text-start">
        <span className="d-block fw-semibold">{tab.title}</span>
        <span className="small opacity-75">{tab.subtitle}</span>
      </span>
    </button>
  );
};
