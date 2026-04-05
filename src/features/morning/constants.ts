import type { BacklogTask, Task } from "./types";

export { NAV_TABS, PAGE_FEATURE_ORDER, PAGE_FEATURES } from "../page-features";

export const INITIAL_TASKS: Task[] = [
  {
    id: "inbox-cleanup",
    title: "Inbox cleanup",
    summary: "Triage communications and unblock the day.",
    details:
      "Clear urgent messages, flag anything that needs a same-day response, and archive the rest before noon.",
    actions: ["Move to later", "Break into subtasks", "Drop for today"],
    complexity: 1,
    selected: false,
    done: false
  },
  {
    id: "client-proposal-revisions",
    title: "Client proposal revisions",
    summary: "High-focus writing and decision making.",
    details:
      "Tighten the summary, adjust timeline assumptions, and send the revised draft to stakeholders before the afternoon review.",
    actions: ["Schedule focus block", "Delegate research prep", "Reduce scope"],
    complexity: 5,
    selected: false,
    done: false
  },
  {
    id: "sprint-planning-check-in",
    title: "Sprint planning check-in",
    summary: "Coordination and scope alignment.",
    details:
      "Confirm upcoming sprint capacity, identify blockers, and leave the meeting with a clear owner for each open dependency.",
    actions: ["Convert to checklist", "Attach meeting notes", "Push to tomorrow"],
    complexity: 3,
    selected: false,
    done: false
  }
];

export const INITIAL_BACKLOG_TASKS: BacklogTask[] = [
  {
    id: "backlog-weekly-review",
    title: "Weekly review prep",
    summary: "Collect open loops before planning next week.",
    details: "Summarize wins, blockers, and deferred items to reduce planning overhead.",
    actions: ["Break into subtasks", "Move to later"],
    complexity: 2,
    selected: false,
    done: false,
    dueDate: null
  },
  {
    id: "backlog-doc-cleanup",
    title: "Documentation cleanup",
    summary: "Tighten outdated process notes.",
    details: "Refresh docs with current ownership, links, and decision history.",
    actions: ["Reduce scope", "Move to later"],
    complexity: 3,
    selected: false,
    done: false,
    dueDate: null
  }
];

export const COMPLEXITY_THRESHOLD = 10;
export const COMPLEXITY_MAX = 15;
