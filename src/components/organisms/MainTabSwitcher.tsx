import { NAV_TABS } from "../../features/morning/constants";
import type { TabId } from "../../features/morning/types";
import { NavTile } from "../molecules/NavTile";

interface Props {
  activeTab: TabId;
  onSelectTab: (panelId: string) => void;
}

export const MainTabSwitcher = ({ activeTab, onSelectTab }: Props) => (
  <section className="mt-3 mt-lg-4" aria-label="Main sections">
    <div className="nav-switcher" role="tablist" aria-label="Main navigation tabs">
      {NAV_TABS.map((tab) => (
        <NavTile key={tab.id} activeTab={activeTab} onSelect={onSelectTab} tab={tab} />
      ))}
    </div>
  </section>
);
