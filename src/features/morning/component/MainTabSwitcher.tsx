import { useTranslation } from "react-i18next";
import { NAV_TABS } from "../constants";
import type { TabId } from "../types";
import { NavTile } from "./NavTile";

interface Props {
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
}

export const MainTabSwitcher = ({ activeTab, onSelectTab }: Props) => {
  const { t } = useTranslation();

  return (
    <section className="mt-3 mt-lg-4" aria-label={t("Main sections")} data-testid="main-nav-section">
      <div className="nav-switcher" role="tablist" aria-label={t("Main navigation tabs")} data-testid="main-nav-tablist">
        {NAV_TABS.map((tab) => (
          <NavTile key={tab.id} activeTab={activeTab} onSelect={onSelectTab} tab={tab} testId={`main-nav-tab-${tab.id}`} />
        ))}
      </div>
    </section>
  );
};
