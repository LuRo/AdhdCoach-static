import type { TabId } from "../features/morning/types";

export const TAB_PATHS: Record<TabId, string> = {
  morning: "/morning",
  today: "/today",
  debriefing: "/debriefing"
};

export const pathToMainTab = (pathname: string): TabId | null => {
  if (pathname === "/morning") return "morning";
  if (pathname === "/today") return "today";
  if (pathname === "/debriefing") return "debriefing";
  return null;
};