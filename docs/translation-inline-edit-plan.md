# Translation Inline Edit Plan (Full Coverage + List Modal)

## Goal
Implement full translation coverage for all UI labels across all pages, with:
- inline editing for single labels
- modal editing for list values (dropdown/options arrays)
- immediate runtime i18next update after save

## Implementation Plan
1. Complete coverage inventory and migration
- Keep one translation source strategy per area:
  - `t("...")` or `EditableTranslation` for direct labels
  - `copy.ui.*` for structured page copy blocks
- Replace all remaining hardcoded UI strings with translatable keys.
- Add a small coverage check script to detect labels rendered in components that are not mapped to i18n.

2. Inline label editor (single value)
- Continue using `EditableTranslation` for normal labels.
- Save flow:
  - `POST /api/translations`
  - payload `{ lng, ns, key, value }`
- On success, update i18next resource in memory and rerender immediately.

3. List values editor (modal)
- Add reusable `TranslationListEditorModal` for option arrays.
- Show an `Edit options` action when translation edit mode is enabled.
- Support ordered list editing: add, remove, move up/down, save, cancel.
- Save flow:
  - `POST /api/translations/list`
  - payload `{ lng, ns, key, values: string[] }`
- On success, update i18next array value in memory and rerender controls immediately.

4. Runtime update utility
- Extend resource update helper to handle:
  - scalar values (string)
  - array values (`string[]`) at dot paths
- Keep nested path support (e.g. `debrief.answerOptions.q1`).

5. Validation and rollout
- Typecheck and smoke test all routes (`/morning`, `/today`, `/debriefing`, `/settings`, `/profile`).
- Confirm edit mode off = read-only labels.
- Confirm edit mode on = inline editor + list modal available.

## Page Label Inventory (All Pages)

### Shared App Shell
- Source: `TopNavigation`, `MainTabSwitcher`, `DashboardLayout`
- Labels:
  - `Main sections`
  - `Main navigation tabs`
  - `ADHD Coach home`
  - `Language`
  - `English`, `Deutsch`, `French`
  - `Open settings`
  - `Open profile`
  - `Logout`

### Morning Page (`/morning`)
- Source: `MorningPanel`, `ComplexitySummaryCard`, `EnergyStepSection`, `TasksStepSection`, `Step2HelpModal`, `AddTaskModal`, `TaskCard`, `TaskDetailsModal`, `PomodoroOverlay`, `PlaceholderPanel`
- Labels currently mapped through i18n:
  - `Morning sequence`
  - `Build a plan that matches today's capacity`
  - `Capture energy first, then shape the task load before making a commitment.`
  - `Today is the {{date}}`
  - `Set current day manually`
  - `Total planned complexity is above the recommended threshold for a focused day.`
  - `Daily complexity`, `Light`, `Moderate`, `High`, `Recommended threshold: 10 points`, `points`, `Recalculate daily complexity gauge`
  - `Set your energy baseline`, `Choose the level that best reflects what you can realistically sustain this morning.`, `Energy selection`
  - `Rank the task list`, `Drag tasks into the right order, check complexity load, and open details or actions as needed.`
  - `Add new task`, `Remove selected tasks`, `Help`, `Confirm tasks and go to Today`
  - `Should selected tasks be completely deleted, or only removed from this planner and kept in backlog?`
  - `Remove from planner`, `Delete completely`, `Cancel`, `Close`
  - `Drag to reorder`, `Select {{title}} for removal`, `Complexity {{value}}`, `Open task details and actions`
  - `Task details`, `Mark ready`
  - `Step 2 Help`, help bullet list labels
  - `Add task`, `Backlog`, `Create a new task`, `Choose a task from backlog or create a completely new one.`, `No backlog tasks available.`
  - `Add`, `Title`, `What needs to be done?`, `Subtext (optional)`, `Helpful context for the task`
  - `Estimated complexity`, `Calculate complexity`, `Store in backlog`, `Due date (optional)`, `due`, `Back to backlog`, `Create new task`, `Save to backlog`, `Add to today`
  - `Pomodoro`, `Pomodoro timer overlay`, `{{minutes}} minute cycle`, `Start`, `Close`
  - `Today`, `Working view placeholder`, `Debriefing`, `Day-close placeholder`, placeholder helper text

### Today Page (`/today`)
- Source: `TodayPanel`, `TodayTaskCard`
- Labels already in i18n source (`copy.ui.todayPanel`, `copy.ui.todayTaskCard`) but not fully wired in components:
  - `Today execution`
  - `Work from your confirmed morning plan`
  - `Click the timer circle to open the Pomodoro overlay.`
  - `Test day speed`
  - `Simulation only. All running timers advance at the selected speed.`
  - `Today tasks`
  - `Only the top unblocked task can start. Block unlocks the next task.`
  - `All planned tasks are completed.`
  - `Achieved goals of today`
  - `Completed items are moved here automatically.`
  - `No completed goals yet.`
  - `Blocked`, `Tracking`
  - `Mark {{title}} as done`
  - `Complexity {{value}}`
  - `Play`, `Block`
  - `Open Pomodoro`
  - `minutesSuffix`
- Current hardcoded labels to migrate in implementation:
  - `Today execution`
  - `Work from your confirmed morning plan`
  - `Click the timer circle to open the Pomodoro overlay.`
  - `Test day speed`
  - `Simulation only. All running timers advance at the selected speed.`
  - `Today is running at live speed.`
  - `Today tasks`
  - `Only the top unblocked task can start. Block unlocks the next task.`
  - `All planned tasks are completed.`
  - `Achieved goals of today`
  - `Completed items are moved here automatically.`
  - `No completed goals yet.`
  - `Blocked`, `Tracking`, `Play`, `Block`, `Open Pomodoro`
  - ARIA labels: `Mark ${task.title} as done`, `Complexity ${task.complexity}`

### Debriefing Page (`/debriefing`)
- Source: `DebriefingPage` using `copy.ui.debriefingPage.*`
- Label groups in use:
  - Hero: `heroBadge`, `heroEyebrow`, `heroTitle`, `heroLead`, `selectedDate`
  - Summary: `summaryHeading`, `summaryLead`, `versionLabel`, `actualFocus`, `actualFocusNote`, `expectedBaseline`, `expectedBaselineNote`, `timeRatio`, `status.*`, `coaching.*`
  - Questions: `questionsHeading`, `questionsLead`, `questionLabel`, `storedValueHidden`, `optionalNote`, `submit`
  - History: `historyHeading`, `historyLead`, `simulateCheckin`, `submissionVersion`, `noSubmissions`
  - Interruptions: `interruptionHeading`, `interruptionTime`, `checkinsSummary`, `checkinSentLabel`, `checkinAnsweredLabel`, `interruptionLabel`
  - Strategy and log: `strategyHeading`, `strategy[]`, `eventLogHeading`, `channelLabel`, `answerLabel`
- Additional locale-bound labels from page-local structures (not currently in i18n namespace):
  - `localeLabels.*` values (`submissions`, cause/kind/channel/answer strings)
  - `initialNotes.*`
- Implementation note: migrate these page-local label structures into i18n resources for complete coverage.

### Settings Page (`/settings`)
- Source: `SettingsPage` with `copy.settings.*`, `copy.common.close`, plus `EditableTranslation` examples.
- Labels in use include:
  - `settings.sectionLabel`, `settings.title`, `settings.description`, `settings.closeAria`
  - `settings.debriefBadge`, `settings.versionLabel`, `settings.questionSetHeading`, `settings.questionSetDescription`
  - `settings.lastUpdated`, `settings.questionLabel`, `settings.answerLabelsBadge`, `settings.answerLabelsUsedFor`, `settings.answerLabel`
  - `settings.saveQuestionSet`, `settings.resetToSaved`, `settings.plannerBadge`, `settings.plannerTitle`, `settings.plannerText`
  - `common.close`
  - Editable examples: `common.save`, `auth.login.title`, `form.description`

### Profile Page (`/profile`)
- Source: `ProfilePage`
- Labels:
  - `Profile`
  - `User profile`
  - `Review account details, coaching preferences, and activity context.`
  - `Close profile page`
  - `Close`
  - `Profile page scaffold`
  - `Add avatar, identity fields, and profile-specific actions here.`

## Dropdown/List Modal Targets
- Language selector labels (`English`, `Deutsch`, `French`) if they should be editable at runtime.
- Debrief answer option arrays from store (`getAnswerOptions`) for each question scale.
- Any future select/radio option arrays in forms.

## UI Constraint (Edit Icon)

- Edit button icon sizing rule:
  - The pencil icon must keep a fixed visual size independent of parent font size.
  - Implement with explicit icon dimensions (for example font-size: 14px; width: 14px; height: 14px; line-height: 1; flex: 0 0 14px;).
  - Do not use `em`-based sizing for the icon.

## Acceptance Criteria
- No visible UI label remains hardcoded on any page route.
- Edit mode off: no editing affordance.
- Edit mode on: inline editing for scalar labels and modal editing for list values.
- Saved changes appear immediately without reload.
- Coverage report can list labels by page and flag missing mappings.





