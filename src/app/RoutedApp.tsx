import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AddTaskModal } from "../features/morning/component/AddTaskModal";
import { PomodoroOverlay } from "../features/today/component/PomodoroOverlay";
import { Step2HelpModal } from "../features/morning/component/Step2HelpModal";
import { TaskDetailsModal } from "../features/morning/component/TaskDetailsModal";
import { useMorningPlanner } from "../features/morning/hooks/useMorningPlanner";
import { DebriefingPage } from "../features/debriefing/pages/DebriefingPage";
import { MorningPage } from "../features/morning/pages/MorningPage";
import { TodayPage } from "../features/today/pages/TodayPage";
import type { TabId } from "../features/morning/types";
import { TAB_PATHS, pathToMainTab } from "./routePaths";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";

const RoutedApp = () => {
  const planner = useMorningPlanner();
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
          <Route path="/" element={<Navigate to="/morning" replace />} />
          <Route path="/morning" element={<MorningPage planner={planner} />} />
          <Route path="/today" element={<TodayPage planner={planner} />} />
          <Route path="/debriefing" element={<DebriefingPage selectedTestDate={planner.effectiveSelectedTestDate} />} />
          <Route path="/settings" element={<SettingsPage onClose={handleCloseAuxPage} selectedTestDate={planner.selectedTestDate} testDaySpeed={planner.testDaySpeed} testModeSettings={planner.testModeSettings} onTestModeSettingsChange={planner.setTestModeSettings} />} />
          <Route path="/profile" element={<ProfilePage onClose={handleCloseAuxPage} />} />
          <Route path="*" element={<Navigate to="/morning" replace />} />
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


