import type { ReactNode } from "react";
import { cn } from "../../app/cn";
import type { TabId } from "../../features/morning/types";
import { MainTabSwitcher } from "../organisms/MainTabSwitcher";
import { TopNavigation } from "../organisms/TopNavigation";

interface Props {
  activeTab: TabId;
  children: ReactNode;
  onSelectTab: (panelId: string) => void;
}

export const DashboardTemplate = ({ activeTab, children, onSelectTab }: Props) => (
  <div className="container py-4 py-lg-5 app-shell">
    <div className={cn("p-1 p-lg-4") }>
      <TopNavigation />
      <MainTabSwitcher activeTab={activeTab} onSelectTab={onSelectTab} />
      <main className="mt-4">{children}</main>
    </div>
  </div>
);
