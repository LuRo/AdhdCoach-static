import type { NavTab, TabId } from "./morning/types";

export interface PageFeature extends NavTab {
  path: `/${TabId}`;
  description: string;
}

export const PAGE_FEATURE_ORDER = ["morning", "today", "debriefing"] as const satisfies readonly TabId[];

export const PAGE_FEATURES: Record<TabId, PageFeature> = {
  morning: {
    id: "morning",
    panelId: "morning-panel",
    path: "/morning",
    title: "Morning",
    subtitle: "Planning setup",
    iconClass: "bi bi-cup-hot",
    description: "Capture energy, prioritize tasks, and confirm the morning plan."
  },
  today: {
    id: "today",
    panelId: "today-panel",
    path: "/today",
    title: "Today",
    subtitle: "Work in progress",
    iconClass: "bi bi-sun",
    description: "Execute the confirmed plan with timers, blockers, and completion tracking."
  },
  debriefing: {
    id: "debriefing",
    panelId: "debriefing-panel",
    path: "/debriefing",
    title: "Debriefing",
    subtitle: "Close the day",
    iconClass: "bi bi-chat-dots",
    description: "Review the day, capture interruption patterns, and leave with one next step."
  }
};

export const NAV_TABS: NavTab[] = PAGE_FEATURE_ORDER.map((tabId) => {
  const { id, panelId, title, subtitle, iconClass } = PAGE_FEATURES[tabId];
  return { id, panelId, title, subtitle, iconClass };
});
