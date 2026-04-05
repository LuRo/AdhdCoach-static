import { useMemo, useState } from "react";
import { CoachBadge } from "../../../shared/components/atoms/CoachBadge";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import { SectionCard } from "../../../shared/components/atoms/SectionCard";
import {
  appendSubmissionForDate,
  getAnswerOptions,
  getQuestionSet,
  getQuestionSetByVersion,
  getSelectedTestDate,
  getSubmissionsForDate,
  type DebriefAnswerValue,
  type DebriefSubmission
} from "../store";

type InterruptionKind = "internal" | "external";

type EventRecord =
  | { type: "interruption_logged"; kind: InterruptionKind; capture: "auto" | "manual"; trigger: string; durationSeconds?: number; note?: string; at: string }
  | { type: "checkin_prompt_sent"; channel: "in_app" | "push"; promptType: "still_on_task"; at: string }
  | { type: "checkin_prompt_answered"; answer: "yes_still_on_task" | "paused" | "switched"; interruptionKind: InterruptionKind | "none"; at: string };

const formatMinutes = (minutes: number) => `${Math.round(minutes)}m`;
const formatPercent = (ratio: number) => `${Math.round(ratio * 100)}%`;
const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const formatTimeOnly = (value: string) =>
  new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));

const getTimeStatus = (timeRatio: number) => {
  if (timeRatio <= 1) return "On track" as const;
  if (timeRatio <= 1.5) return "Needed extra runway" as const;
  return "High friction day" as const;
};

const buildCoachingSummary = (metrics: ReturnType<typeof deriveMetrics>) => {
  const dominantCause = metrics.external >= metrics.internal ? "external context switches" : "internal distractions";

  if (metrics.totalInterruptions >= 3) {
    return {
      acknowledgment: "You kept momentum through a noisy day and still closed the loop.",
      insight: `Most friction came from ${dominantCause}, with about ${formatMinutes(metrics.interruptedMinutes)} of interrupted time.`,
      nextStep: "Tomorrow: start with one protected 20-minute sprint before checking messages."
    };
  }

  if (metrics.timeStatus === "Needed extra runway" && metrics.totalInterruptions <= 2) {
    return {
      acknowledgment: "You held the work together without losing the thread.",
      insight: `Your pacing landed at ${formatPercent(metrics.timeRatio)} of the baseline, while interruptions stayed contained.`,
      nextStep: "Tomorrow: split the opening step in half or move the task up one complexity level."
    };
  }

  if (metrics.timeStatus === "On track") {
    return {
      acknowledgment: "You matched the plan with steady follow-through.",
      insight: "The day finished on the expected rhythm, with no major recovery cost.",
      nextStep: "Tomorrow: repeat the same opening routine and keep the first sprint length unchanged."
    };
  }

  return {
    acknowledgment: "You kept moving even when the day pushed back.",
    insight: `The session landed in a ${metrics.timeStatus.toLowerCase()} pattern at ${formatPercent(metrics.timeRatio)} of plan.`,
    nextStep: "Tomorrow: add a short buffer before the first deep-work block."
  };
};

const deriveMetrics = () => {
  const startedAt = new Date("2026-04-04T08:12:00.000Z").getTime();
  const endedAt = new Date("2026-04-04T10:08:00.000Z").getTime();
  const expectedMinutesAtStart = 60;
  const plannedBreakMinutes = 10;
  const actualMinutes = Math.max((endedAt - startedAt) / 60_000 - plannedBreakMinutes, 0);
  const timeRatio = actualMinutes / expectedMinutesAtStart;
  const interruptions: EventRecord[] = [
    { type: "interruption_logged", kind: "external", capture: "manual", trigger: "user_tap", durationSeconds: 360, note: "A quick context switch to answer a message thread.", at: "2026-04-04T08:31:00.000Z" },
    { type: "checkin_prompt_sent", channel: "in_app", promptType: "still_on_task", at: "2026-04-04T08:32:00.000Z" },
    { type: "checkin_prompt_answered", answer: "paused", interruptionKind: "external", at: "2026-04-04T08:33:00.000Z" },
    { type: "interruption_logged", kind: "internal", capture: "auto", trigger: "missed_heartbeats", durationSeconds: 480, note: "Long idle gap while regathering the next step.", at: "2026-04-04T09:04:00.000Z" },
    { type: "interruption_logged", kind: "external", capture: "auto", trigger: "long_idle", durationSeconds: 300, note: "Browser focus dropped briefly while the session stayed open.", at: "2026-04-04T09:22:00.000Z" }
  ];
  return {
    actualMinutes,
    expectedMinutesAtStart,
    timeRatio,
    timeStatus: getTimeStatus(timeRatio),
    internal: interruptions.filter((event) => event.type === "interruption_logged" && event.kind === "internal").length,
    external: interruptions.filter((event) => event.type === "interruption_logged" && event.kind === "external").length,
    auto: interruptions.filter((event) => event.type === "interruption_logged" && event.capture === "auto").length,
    manual: interruptions.filter((event) => event.type === "interruption_logged" && event.capture === "manual").length,
    totalInterruptions: interruptions.filter((event): event is Extract<EventRecord, { type: "interruption_logged" }> => event.type === "interruption_logged").length,
    interruptedMinutes: interruptions.reduce((sum, event) => sum + (event.type === "interruption_logged" ? event.durationSeconds ?? 0 : 0), 0) / 60,
    checkinsSent: interruptions.filter((event) => event.type === "checkin_prompt_sent").length,
    checkinsAnswered: interruptions.filter((event) => event.type === "checkin_prompt_answered").length,
    eventLog: interruptions
  };
};

const averageForQuestion = (submissions: DebriefSubmission[], key: "q1" | "q2" | "q3") => {
  if (submissions.length === 0) return null;
  const total = submissions.reduce((sum, submission) => sum + submission.answers[key], 0);
  return total / submissions.length;
};

const answerOptions = getAnswerOptions();

const CircleAverage = ({ label, value, count }: { label: string; value: number | null; count: number }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const ratio = value ? value / 5 : 0;
  const dashOffset = circumference * (1 - ratio);

  return (
    <div className="debrief-average-item d-flex flex-column align-items-center gap-2 text-center">
      <svg className="debrief-average-circle" viewBox="0 0 96 96" role="img" aria-label={`${label} average ${value ? value.toFixed(1) : "no data"} out of 5`}>
        <circle cx="48" cy="48" r={radius} className="debrief-average-track" />
        {value ? <circle cx="48" cy="48" r={radius} className="debrief-average-progress" strokeDasharray={circumference} strokeDashoffset={dashOffset} /> : null}
        <text x="48" y="44" textAnchor="middle" className="debrief-average-value">{value ? value.toFixed(1) : "--"}</text>
        <text x="48" y="58" textAnchor="middle" className="debrief-average-subvalue">/ 5</text>
      </svg>
      <div>
        <div className="fw-semibold">{label}</div>
        <div className="small text-secondary">{count} submissions</div>
      </div>
    </div>
  );
};

export const DebriefingPage = () => {
  const [questionSet] = useState(() => getQuestionSet());
  const [selectedTestDate] = useState(() => getSelectedTestDate());
  const [submissions, setSubmissions] = useState<DebriefSubmission[]>(() => getSubmissionsForDate(selectedTestDate));
  const [answerDrafts, setAnswerDrafts] = useState<{ q1: DebriefAnswerValue; q2: DebriefAnswerValue; q3: DebriefAnswerValue; note: string }>({
    q1: 4,
    q2: 3,
    q3: 4,
    note: "The first reset worked once messages were closed."
  });

  const metrics = useMemo(() => deriveMetrics(), []);
  const coaching = useMemo(() => buildCoachingSummary(metrics), [metrics]);
  const averages = useMemo(
    () => ({
      q1: averageForQuestion(submissions, "q1"),
      q2: averageForQuestion(submissions, "q2"),
      q3: averageForQuestion(submissions, "q3")
    }),
    [submissions]
  );

  const submitDebrief = () => {
    const submittedAt = new Date().toISOString();
    const record: DebriefSubmission = {
      submittedAt,
      date: selectedTestDate,
      questionSetVersion: questionSet.version,
      answers: { ...answerDrafts }
    };

    appendSubmissionForDate(selectedTestDate, record);
    setSubmissions((previous) => [...previous, record]);
  };

  return (
    <section id="debriefing-panel" className="section-panel active" role="tabpanel" aria-labelledby="Debriefing">
      <div className="debrief-page">
        <SectionCard className="debrief-hero p-4 p-lg-5 mb-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-start">
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <CoachBadge tone="purple" className="rounded-pill px-3 py-2">End-of-day debrief</CoachBadge>
                <span className="text-uppercase small fw-semibold text-secondary">Append-only reflection trail</span>
              </div>
              <h1 className="display-6 fw-semibold mb-2">Close the day without turning it into a scorecard.</h1>
              <p className="lead text-secondary mb-0">Review the work, notice the friction honestly, and leave with one practical adjustment for tomorrow.</p>
            </div>
            <div className="debrief-summary-box">
              <div className="small text-secondary text-uppercase fw-semibold mb-1">Selected test date</div>
              <div className="fw-semibold mb-2">{selectedTestDate}</div>
              <div className="d-flex flex-wrap gap-2">
                <CoachBadge tone={metrics.timeStatus === "On track" ? "purple" : "warning"} className="rounded-pill px-3 py-2">{metrics.timeStatus}</CoachBadge>
                <CoachBadge tone={metrics.totalInterruptions >= 3 ? "danger" : "purple"} className="rounded-pill px-3 py-2">{metrics.totalInterruptions} interruptions</CoachBadge>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <SectionCard className="p-4 mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h2 className="h4 mb-1">Coaching-style summary</h2>
                  <p className="text-secondary mb-0">One acknowledgment, one signal, one next move.</p>
                </div>
                <CoachBadge tone={metrics.totalInterruptions >= 3 ? "warning" : "purple"} className="rounded-pill px-3 py-2">Version {questionSet.version}</CoachBadge>
              </div>
              <div className="debrief-copy p-3 rounded-4 mb-3">
                <p className="mb-2 fw-semibold">{coaching.acknowledgment}</p>
                <p className="mb-2">{coaching.insight}</p>
                <p className="mb-0 fw-semibold text-purple">Next step: {coaching.nextStep}</p>
              </div>
              <div className="row g-3">
                <div className="col-md-4"><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">Actual focus</div><div className="h3 mb-0">{formatMinutes(metrics.actualMinutes)}</div><div className="small text-secondary">Planned break already removed</div></div></div>
                <div className="col-md-4"><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">Expected baseline</div><div className="h3 mb-0">60m</div><div className="small text-secondary">medium complexity snapshot</div></div></div>
                <div className="col-md-4"><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">Time ratio</div><div className="h3 mb-0">{formatPercent(metrics.timeRatio)}</div><div className="small text-secondary">{metrics.timeStatus}</div></div></div>
              </div>
            </SectionCard>

            <SectionCard className="p-4 mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h2 className="h4 mb-1">Questions from Settings</h2>
                  <p className="text-secondary mb-0">These are read-only here. Answers are stored locally as numbers, while you see text labels.</p>
                </div>
                <CoachBadge tone="purple" className="rounded-pill px-3 py-2">v{questionSet.version}</CoachBadge>
              </div>

              <div className="d-grid gap-4">
                {questionSet.questions.map((question, index) => {
                  const key = `q${index + 1}` as "q1" | "q2" | "q3";
                  return (
                    <div key={question} className="debrief-question-block">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                        <div>
                          <div className="small text-secondary fw-semibold">Question {index + 1}</div>
                          <div className="h5 mb-0">{question}</div>
                        </div>
                        <CoachBadge tone="purple" className="rounded-pill px-3 py-2">Stored value: hidden</CoachBadge>
                      </div>
                      <div className="row g-2">
                        {answerOptions.map((option) => {
                          const selected = answerDrafts[key] === option.value;
                          return (
                            <div className="col-12 col-sm-6 col-lg-4" key={option.value}>
                              <button
                                type="button"
                                className={`btn w-100 ${selected ? "btn-purple" : "btn-outline-purple"}`}
                                onClick={() => setAnswerDrafts((previous) => ({ ...previous, [key]: option.value }))}
                              >
                                {option.label}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <label className="mt-4 d-block">
                <span className="small text-secondary fw-semibold mb-1 d-block">Optional note</span>
                <textarea
                  className="form-control"
                  rows={3}
                  value={answerDrafts.note}
                  onChange={(event) => setAnswerDrafts((previous) => ({ ...previous, note: event.target.value }))}
                />
              </label>

              <div className="d-flex flex-wrap gap-2 mt-3">
                <CoachButton type="button" onClick={submitDebrief}>Submit debrief</CoachButton>
              </div>
            </SectionCard>

            <SectionCard className="p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h2 className="h4 mb-1">Submission history</h2>
                  <p className="text-secondary mb-0">Historical entries keep the question version that was active when they were submitted.</p>
                </div>
                <CoachButton variant="outline" type="button">Simulate check-in</CoachButton>
              </div>

              <div className="d-grid gap-4 mb-4">
                <div className="row g-3">
                  <div className="col-12 col-md-4"><CircleAverage label="Question 1" value={averages.q1} count={submissions.length} /></div>
                  <div className="col-12 col-md-4"><CircleAverage label="Question 2" value={averages.q2} count={submissions.length} /></div>
                  <div className="col-12 col-md-4"><CircleAverage label="Question 3" value={averages.q3} count={submissions.length} /></div>
                </div>
              </div>

              <div className="d-grid gap-3">
                {submissions.length > 0 ? submissions.slice().reverse().map((submission) => (
                  <div key={submission.submittedAt} className="debrief-history-item p-3">
                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                      <strong>Submission v{submission.questionSetVersion}</strong>
                      <span className="small text-secondary">{formatDateTime(submission.submittedAt)}</span>
                    </div>
                    <div className="d-grid gap-2">
                      {(getQuestionSetByVersion(submission.questionSetVersion)?.questions ?? questionSet.questions).map((question, index) => {
                        const answerKey = `q${index + 1}` as "q1" | "q2" | "q3";
                        const answerLabel = answerOptions.find((option) => option.value === submission.answers[answerKey])?.label ?? "Unknown";
                        return (
                          <div key={question} className="small">
                            <span className="fw-semibold">{question}</span>
                            <span className="text-secondary"> - {answerLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                    {submission.answers.note ? <p className="mb-0 text-secondary mt-2">{submission.answers.note}</p> : null}
                  </div>
                )) : <div className="text-secondary">No submissions yet for this test date.</div>}
              </div>
            </SectionCard>
          </div>

          <div className="col-12 col-lg-5">
            <SectionCard className="p-4 mb-4">
              <h2 className="h4 mb-3">Interruption breakdown</h2>
              <div className="row g-3">
                {[["Internal", metrics.internal], ["External", metrics.external], ["Auto", metrics.auto], ["Manual", metrics.manual]].map(([label, value]) => (
                  <div className="col-6" key={label as string}><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">{label}</div><div className="h3 mb-0">{value as number}</div></div></div>
                ))}
              </div>
              <div className="debrief-stat-card p-3 mt-3">
                <div className="small text-secondary text-uppercase fw-semibold">Interrupted time</div>
                <div className="h4 mb-0">{formatMinutes(metrics.interruptedMinutes)}</div>
                <div className="small text-secondary">Check-ins sent: {metrics.checkinsSent} | answered: {metrics.checkinsAnswered}</div>
              </div>
            </SectionCard>

            <SectionCard className="p-4 mb-4">
              <h2 className="h4 mb-3">Heartbeat and check-in strategy</h2>
              <ul className="debrief-list mb-0">
                <li>Foreground heartbeats are expected about every 90 seconds during active focus.</li>
                <li>Two missed heartbeats trigger a check-in; the channel prefers in-app first, then push.</li>
                <li>Mobile browsers can throttle background JavaScript, so resume pings matter when the page returns to foreground.</li>
              </ul>
            </SectionCard>

            <SectionCard className="p-4">
              <h2 className="h4 mb-3">Event log</h2>
              <div className="d-grid gap-2 debrief-event-log">
                {metrics.eventLog.map((event) => (
                  <div key={`${event.type}-${event.at}`} className="debrief-event-item p-3">
                    <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-1">
                      <strong>{event.type === "interruption_logged" ? `${event.kind} interruption` : event.type === "checkin_prompt_sent" ? "Check-in sent" : "Check-in answered"}</strong>
                      <span className="small text-secondary">{formatTimeOnly(event.at)}</span>
                    </div>
                    <div className="small text-secondary text-break">
                      {event.type === "interruption_logged"
                        ? `${event.capture} / ${event.trigger}${event.note ? ` / ${event.note}` : ""}`
                        : event.type === "checkin_prompt_sent"
                          ? `Channel: ${event.channel}`
                          : `Answer: ${event.answer}`}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </section>
  );
};



