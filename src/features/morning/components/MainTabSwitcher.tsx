import { NAV_TABS } from "../constants";
import type { TabId } from "../types";
import { NavTile } from "./NavTile";

interface Props {
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
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
