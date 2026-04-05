# Debrief Event Model Spec

## Purpose

Define an append-only event model for end-of-day debriefing with ADHD-friendly coaching insights, including:
- Emotional/progress feedback (3 questions)
- Time spent vs complexity baseline
- Distraction/interrupt tracking (auto + manual)

## Core Principles

- Event-sourced: never overwrite historical state; append events.
- Versioned debrief questions: preserve historical comparability.
- Transparent interruption capture: always distinguish `auto` vs `manual`.
- Browser-safe heartbeat logic: no assumption of continuous background execution.

## Event Types

### 1. `focus_session_started`

Fields:
- `sessionId: string`
- `taskId: string`
- `userId: string`
- `complexity: "small" | "medium" | "large"`
- `expectedMinutesAtStart: number`
- `startedAt: string` (ISO timestamp)

### 2. `focus_heartbeat`

Fields:
- `sessionId: string`
- `taskId: string`
- `clientTs: string` (ISO timestamp)
- `visible: boolean`
- `hasRecentInteraction: boolean`
- `timerState: "running" | "paused"`
- `source: "foreground_timer" | "resume_ping"`

### 3. `focus_state_changed`

Fields:
- `sessionId: string`
- `taskId: string`
- `fromState: "active" | "paused" | "switched" | "ended"`
- `toState: "active" | "paused" | "switched" | "ended"`
- `reason: "user_pause" | "timer_break" | "app_hidden" | "system_idle" | "manual"`
- `at: string` (ISO timestamp)

### 4. `interruption_logged`

Fields:
- `sessionId: string`
- `taskId: string`
- `kind: "internal" | "external"`
- `capture: "auto" | "manual"`
- `trigger: "missed_heartbeats" | "long_idle" | "user_tap"`
- `durationSeconds?: number`
- `note?: string`
- `at: string` (ISO timestamp)

### 5. `checkin_prompt_sent`

Fields:
- `sessionId: string`
- `taskId: string`
- `channel: "in_app" | "push"`
- `promptType: "still_on_task"`
- `at: string` (ISO timestamp)

### 6. `checkin_prompt_answered`

Fields:
- `sessionId: string`
- `taskId: string`
- `answer: "yes_still_on_task" | "paused" | "switched"`
- `interruptionKind: "internal" | "external" | "none"`
- `at: string` (ISO timestamp)

### 7. `focus_session_ended`

Fields:
- `sessionId: string`
- `taskId: string`
- `endedAt: string` (ISO timestamp)
- `completion: "done" | "partial" | "stopped"`

### 8. `debrief_question_set_updated`

Fields:
- `questionSetVersion: number`
- `questions: [string, string, string]`
- `updatedAt: string` (ISO timestamp)

Behavior:
- Every question edit creates a new `questionSetVersion`.
- Historical debrief entries keep their original version.

### 9. `debrief_submitted`

Fields:
- `sessionId: string`
- `taskId: string`
- `date: string` (YYYY-MM-DD)
- `questionSetVersion: number`
- `answers: { q1: number; q2: number; q3: number; note?: string }`
- `coachingTone: "enabled"`
- `submittedAt: string` (ISO timestamp)

## Complexity Baseline

Initial mapping (tunable):
- `small = 25` minutes
- `medium = 60` minutes
- `large = 120` minutes

Each session snapshots this into `expectedMinutesAtStart`.

## Derived Debrief Metrics

### Time vs complexity

- `actualMinutes = sessionEnd - sessionStart - plannedBreakMinutes`
- `timeRatio = actualMinutes / expectedMinutesAtStart`

Labels:
- `<= 1.0`: `On track`
- `1.01 - 1.5`: `Needed extra runway`
- `> 1.5`: `High friction day`

### Interruptions

- `internalCount`
- `externalCount`
- `totalInterruptions`
- `autoVsManualBreakdown`
- `estimatedInterruptedMinutes` (from duration when available)

## Heartbeat and Check-in Rules (Web/PWA)

- While session is active, page visible, and timer running: emit heartbeat every 90s.
- If 2+ expected heartbeats are missed: trigger potential interruption flow.
- Send `checkin_prompt_sent`:
- `in_app` if app is active
- `push` if app is not active and push is available
- Confirm interruption via:
- explicit user answer (`checkin_prompt_answered`), or
- resumed gap beyond threshold (for example 8+ minutes) logged as `interruption_logged` with `capture = "auto"`.

Note:
- Mobile/browser background throttling applies; do not rely on continuous background JS execution for heartbeat.

## Coaching Output (First Rule-Based Pass)

Always produce supportive, coaching-style copy:
- Focus on progress and recovery, not blame.
- Include one actionable next-step suggestion for tomorrow.

Example rules:
- High interruptions + partial completion:
- "You kept momentum in a high-friction context. Tomorrow: start with a shorter first sprint."
- On-track pacing:
- "Great pacing today. Repeat the same start routine tomorrow."

