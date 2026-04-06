import type { ReactNode } from "react";
import { cn } from "../lib/utils/cn";
import type { TabId } from "../features/morning/types";
import { MainTabSwitcher } from "../features/morning/component/MainTabSwitcher";
import { TopNavigation } from "../components/layout/TopNavigation";

interface Props {
  activeTab: TabId;
  children: ReactNode;
  onOpenHomePage: () => void;
  onOpenProfilePage: () => void;
  onOpenSettingsPage: () => void;
  onSelectTab: (tabId: TabId) => void;
  showMainTabs?: boolean;
}

export const DashboardLayout = ({
  activeTab,
  children,
  onOpenHomePage,
  onOpenProfilePage,
  onOpenSettingsPage,
  onSelectTab,
  showMainTabs = true
}: Props) => (
  <div className="container py-4 py-lg-5 app-shell">
    <div className={cn("p-1 p-lg-4")} data-testid="dashboard-layout-shell">
      <TopNavigation
        onOpenHomePage={onOpenHomePage}
        onOpenProfilePage={onOpenProfilePage}
        onOpenSettingsPage={onOpenSettingsPage}
      />
      {showMainTabs ? <MainTabSwitcher activeTab={activeTab} onSelectTab={onSelectTab} /> : null}
      <main className="mt-4">{children}</main>
    </div>
  </div>
);
