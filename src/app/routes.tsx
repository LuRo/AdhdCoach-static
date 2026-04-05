import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PAGE_FEATURES, type TabId } from "../features";
import { AddTaskModal } from "../features/morning/components/AddTaskModal";
import { PomodoroOverlay } from "../features/morning/components/PomodoroOverlay";
import { Step2HelpModal } from "../features/morning/components/Step2HelpModal";
import { TaskDetailsModal } from "../features/morning/components/TaskDetailsModal";
import { useMorningPlanner } from "../features/morning/hooks/useMorningPlanner";
import { DebriefingPage } from "../features/morning/pages/DebriefingPage";
import { MorningPage } from "../features/morning/pages/MorningPage";
import { TodayPage } from "../features/morning/pages/TodayPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SettingsPage } from "../pages/SettingsPage";

const TAB_PATHS: Record<TabId, string> = {
  morning: PAGE_FEATURES.morning.path,
  today: PAGE_FEATURES.today.path,
  debriefing: PAGE_FEATURES.debriefing.path
};

const pathToMainTab = (pathname: string): TabId | null => {
  const feature = Object.values(PAGE_FEATURES).find((entry) => entry.path === pathname);
  return feature?.id ?? null;
};

const RoutedApp = () => {
  const { locale } = useI18n();
  const planner = useMorningPlanner(locale);
  const location = useLocation();
  const navigate = useNavigate();
  const lastMainTabRef = useRef<TabId>("morning");

  useEffect(() => {
    const routeTab = pathToMainTab(location.pathname);

    if (routeTab) {
      lastMainTabRef.current = routeTab;
    }

    if (routeTab && planner.activeTab !== routeTab) {
      planner.setActiveTabFromPanel(`${routeTab}-panel`);
    }
  }, [location.pathname, planner.activeTab, planner.setActiveTabFromPanel]);

  const isMainTabRoute = pathToMainTab(location.pathname) !== null;

  const handleSelectTab = (tabId: TabId) => {
    planner.setActiveTabFromPanel(`${tabId}-panel`);
    navigate(TAB_PATHS[tabId]);
  };

  const handleCloseAuxPage = () => {
    handleSelectTab(lastMainTabRef.current);
  };

  return (
    <>
      <DashboardLayout
        activeTab={planner.activeTab}
        onOpenHomePage={() => handleSelectTab("morning")}
        onOpenProfilePage={() => navigate("/profile")}
        onOpenSettingsPage={() => navigate("/settings")}
        onSelectTab={handleSelectTab}
        showMainTabs={isMainTabRoute}
      >
        <Routes>
          <Route path="/" element={<Navigate to={TAB_PATHS.morning} replace />} />
          <Route path={TAB_PATHS.morning} element={<MorningPage planner={planner} />} />
          <Route path={TAB_PATHS.today} element={<TodayPage planner={planner} />} />
          <Route path={TAB_PATHS.debriefing} element={<DebriefingPage />} />
          <Route path="/settings" element={<SettingsPage onClose={handleCloseAuxPage} />} />
          <Route path="/profile" element={<ProfilePage onClose={handleCloseAuxPage} />} />
          <Route path="*" element={<Navigate to={TAB_PATHS.morning} replace />} />
        </Routes>
      </DashboardLayout>

      <TaskDetailsModal
        isOpen={Boolean(planner.selectedTask)}
        onClose={planner.closeTaskDetails}
        task={planner.selectedTask}
      />

      <PomodoroOverlay
        task={planner.pomodoroOverlayTask}
        onClose={planner.closePomodoroOverlay}
        onStart={planner.startTodayTaskPomodoro}
        onStop={planner.stopTodayTaskPomodoro}
      />

      <Step2HelpModal isOpen={planner.isHelpOpen} onClose={() => planner.setIsHelpOpen(false)} />

      <AddTaskModal
        backlogTasks={planner.backlogTasks}
        isOpen={planner.isAddTaskModalOpen}
        onAddFromBacklog={planner.addTaskFromBacklog}
        onClose={planner.closeAddTaskModal}
        onCreateTask={planner.createTask}
      />
    </>
  );
};

export const AppRoutes = () => (
  <BrowserRouter>
    <RoutedApp />
  </BrowserRouter>
);
