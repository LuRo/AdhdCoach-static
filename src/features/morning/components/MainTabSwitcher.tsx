import { getNavTabs } from "../../../i18n/copy";
import { useI18n } from "../../../i18n";
import type { TabId } from "../types";
import { NavTile } from "./NavTile";

interface Props {
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
}

export const MainTabSwitcher = ({ activeTab, onSelectTab }: Props) => {
  const { locale, copy } = useI18n();
  const tabs = getNavTabs(locale);

  return (
    <section className="mt-3 mt-lg-4" aria-label={copy.nav.sectionsAria}>
      <div className="nav-switcher" role="tablist" aria-label={copy.nav.tabsAria}>
        {tabs.map((tab) => (
          <NavTile key={tab.id} activeTab={activeTab} onSelect={onSelectTab} tab={tab} />
        ))}
      </div>
    </section>
  );
};
