# Debrief Page 7-Step Plan (Refined)

## Scope

Create an end-of-day debrief page that helps ADHD users reflect without shame, understand effort vs estimates, and improve tomorrow's setup with coaching-style feedback.

## 1. Define Goal and Tone

- Keep the flow short, low-friction, and non-judgmental.
- Frame it as progress evidence, not a performance score.
- Use coaching-style language and always end with one actionable suggestion for tomorrow.

## 2. Build 3 Core Blocks

- `How I feel now`: exactly 3 debrief questions.
- `Effort vs estimate`: actual focus time vs complexity baseline.
- `Interruptions`: internal (own) vs external (outside) distractions.

## 3. Debrief Questions (Editable, Unique, Versioned)

- Store exactly 3 active questions per debrief set.
- Questions are editable by the user.
- Every edit creates a new immutable `questionSetVersion`.
- Each `debrief_submitted` entry references the version used at submission time.
- Historical reports never backfill newer question text into old entries.

## 4. Metrics and Calculation Logic

- Complexity model: `small | medium | large`.
- Initial baseline mapping (tunable):
- `small=25m`
- `medium=60m`
- `large=120m`
- Snapshot baseline into `expectedMinutesAtStart` when the session starts.
- Compute:
- `actualMinutes = sessionEnd - sessionStart - plannedBreakMinutes`
- `timeRatio = actualMinutes / expectedMinutesAtStart`
- Show status labels:
- `On track` (`<= 1.0`)
- `Needed extra runway` (`1.01-1.5`)
- `High friction day` (`> 1.5`)

## 5. Interruption Capture (Partial Auto + Manual)

- Automatic capture sources:
- Pomodoro pause/stop events
- Missed heartbeats
- Long idle gaps
- App/tab visibility loss while session is active (where available)
- Manual capture sources:
- Quick actions for `Internal distraction` and `External interruption`
- Optional note for context
- Persist interruption source metadata (`capture: auto | manual`) and cause (`trigger`).
- Report both totals and breakdowns (`internal`, `external`, `auto`, `manual`).

## 6. Heartbeat and Check-in Strategy (Browser/PWA)

- During active focus in foreground, emit heartbeat every ~90 seconds.
- If 2 or more expected heartbeats are missed, create a potential interruption event and send a check-in.
- Check-in channel priority:
- `in_app` when app is currently active
- `push` when app is not active and push is available
- Important browser constraint:
- Do not assume continuous background JavaScript on mobile browsers.
- On iOS/iPadOS, push for web apps requires Home Screen installation (PWA path).
- Confirm interruption through user response or inferred long-gap resume logic.


### Coaching-Style Debrief Output Contract

- Output shape (always):
- `Acknowledgment`: recognize effort/context (especially on high-friction days)
- `Insight`: one concrete signal from today's data (time ratio or interruption pattern)
- `Next step`: exactly one actionable adjustment for tomorrow
- Tone rules:
- No blame language
- No moral framing (`good`/`bad` person)
- Keep statements specific and behavioral
- Keep it short (2-4 sentences total)
- Suggestion selection rules (first pass):
- If interruptions are high: suggest shorter first focus sprint or interruption buffer
- If time ratio is high and interruptions are low: suggest complexity recalibration (`medium` to `large`, etc.)
- If on track: suggest repeating the same start routine
- Example outputs:
- `You kept momentum despite multiple interruptions. Most friction came from external context switches. Tomorrow: start with one 20-minute protected sprint before checking messages.`
- `Your pacing matched the planned effort today. You recovered quickly after pauses and finished on track. Tomorrow: repeat the same opening routine.`
## 7. Integration and Data Flow

- Use append-only event storage aligned with `debrief-event-model.agent.md`.
- Core events to support this plan:
- `focus_session_started`
- `focus_heartbeat`
- `focus_state_changed`
- `interruption_logged`
- `checkin_prompt_sent`
- `checkin_prompt_answered`
- `focus_session_ended`
- `debrief_question_set_updated`
- `debrief_submitted`
- Debrief output includes:
- 3 question answers
- time-vs-complexity insight
- interruption breakdown
- coaching-style summary with one next-step suggestion
- Optional next link: feed tomorrow's morning setup with one selected improvement.

