import { useEffect, useMemo, useState } from "react";
import { CoachBadge } from "../../../shared/components/atoms/CoachBadge";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import { SectionCard } from "../../../shared/components/atoms/SectionCard";
import { ModalShell } from "../components/ModalShell";
import {
  appendSubmissionForDate,
  getPlannerSnapshot,
  getQuestionSet,
  getQuestionSetByVersion,
  getSubmissionsForDate,
  type DebriefAnswerValue,
  type DebriefSubmission
} from "../store";
import type { Task } from "../types";

interface Props {
  selectedTestDate: string;
}

type InterruptionKind = "internal" | "external";

type SnapshotTask = Task & {
  blocked?: boolean;
  workElapsedSeconds?: number;
  done?: boolean;
};

type EventRecord =
  | { type: "task_completed"; taskTitle: string; actualMinutes: number; plannedMinutes: number }
  | { type: "task_unfinished"; taskTitle: string; actualMinutes: number; plannedMinutes: number; state: "open" | "blocked" }
  | { type: "interruption_logged"; kind: InterruptionKind; capture: "auto" | "manual"; trigger: string; durationMinutes: number; note?: string }
  | { type: "question_set_updated"; version: number; updatedAt: string; questions: [string, string, string] }
  | { type: "debrief_submitted"; submittedAt: string; questionSetVersion: number; answers: { q1: string; q2: string; q3: string }; note?: string };

const formatMinutes = (minutes: number) => {
  const rounded = Math.round(minutes * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}m`;
};

const formatPercent = (ratio: number) => {
  const rounded = Math.round(ratio * 1000) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
};

const formatDateTime = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const getTimeStatus = (timeRatio: number) => {
  if (timeRatio <= 1) return "On track" as const;
  if (timeRatio <= 1.5) return "Needed extra runway" as const;
  return "High friction day" as const;
};

const getExpectedMinutesForComplexity = (complexity: number) => {
  if (complexity >= 5) return 120;
  if (complexity >= 3) return 60;
  return 25;
};

const deriveMetrics = (selectedTestDate: string) => {
  const plannerSnapshot = getPlannerSnapshot(selectedTestDate);
  const questionSet = getQuestionSet();
  const submissions = getSubmissionsForDate(selectedTestDate);
  const plannedTasks = (plannerSnapshot?.todayTasks.length ? plannerSnapshot.todayTasks : plannerSnapshot?.tasks ?? []) as SnapshotTask[];
  const completedTasks = plannedTasks.filter((task) => task.done === true);
  const incompleteTasks = plannedTasks.filter((task) => task.done !== true);
  const blockedTasks = incompleteTasks.filter((task) => task.blocked === true);
  const openTasks = incompleteTasks.filter((task) => task.blocked !== true);
  const actualMinutes = plannedTasks.reduce((sum, task) => sum + (task.workElapsedSeconds ?? 0) / 60, 0);
  const expectedMinutesAtStart = plannedTasks.reduce((sum, task) => sum + getExpectedMinutesForComplexity(task.complexity), 0);
  const timeRatio = expectedMinutesAtStart > 0 ? actualMinutes / expectedMinutesAtStart : 0;

  const interruptionEvents: Extract<EventRecord, { type: "interruption_logged" }>[] = [
    ...blockedTasks.map((task) => ({
      type: "interruption_logged" as const,
      kind: "internal" as const,
      capture: "manual" as const,
      trigger: task.blocked === true ? "user_blocked_task" : "user_tap",
      durationMinutes: (task.workElapsedSeconds ?? 0) / 60,
      note: `${task.title} was left blocked before completion.`
    })),
    ...openTasks
      .filter((task) => (task.workElapsedSeconds ?? 0) > 0)
      .map((task) => ({
        type: "interruption_logged" as const,
        kind: "external" as const,
        capture: "auto" as const,
        trigger: "long_idle",
        durationMinutes: (task.workElapsedSeconds ?? 0) / 60,
        note: `${task.title} was left open after tracked focus time.`
      }))
  ];

  const eventLog: EventRecord[] = [
    { type: "question_set_updated", version: questionSet.version, updatedAt: questionSet.updatedAt, questions: questionSet.questions },
    ...plannedTasks.map((task) => {
      const actualTaskMinutes = (task.workElapsedSeconds ?? 0) / 60;
      const plannedTaskMinutes = getExpectedMinutesForComplexity(task.complexity);

      if (task.done === true) {
        return {
          type: "task_completed" as const,
          taskTitle: task.title,
          actualMinutes: actualTaskMinutes,
          plannedMinutes: plannedTaskMinutes
        };
      }

      return {
        type: "task_unfinished" as const,
        taskTitle: task.title,
        actualMinutes: actualTaskMinutes,
        plannedMinutes: plannedTaskMinutes,
        state: (task.blocked === true ? "blocked" : "open") as "open" | "blocked"
      };
    }),
    ...interruptionEvents,
    ...submissions.map((submission) => {
      const versionedQuestionSet = getQuestionSetByVersion(submission.questionSetVersion) ?? questionSet;
      return {
        type: "debrief_submitted" as const,
        submittedAt: submission.submittedAt,
        questionSetVersion: submission.questionSetVersion,
        answers: {
          q1: versionedQuestionSet.answerOptions[0][submission.answers.q1 - 1],
          q2: versionedQuestionSet.answerOptions[1][submission.answers.q2 - 1],
          q3: versionedQuestionSet.answerOptions[2][submission.answers.q3 - 1]
        },
        note: submission.answers.note
      };
    })
  ];

  return {
    selectedTestDate,
    plannerSnapshot,
    questionSet,
    submissions,
    plannedTasks,
    totalTasks: plannedTasks.length,
    completedTasks,
    completedTaskCount: completedTasks.length,
    incompleteTasks,
    incompleteTaskCount: incompleteTasks.length,
    blockedTasks,
    openTasks,
    actualMinutes,
    expectedMinutesAtStart,
    timeRatio,
    timeStatus: getTimeStatus(timeRatio),
    internal: interruptionEvents.filter((event) => event.kind === "internal").length,
    external: interruptionEvents.filter((event) => event.kind === "external").length,
    auto: interruptionEvents.filter((event) => event.capture === "auto").length,
    manual: interruptionEvents.filter((event) => event.capture === "manual").length,
    totalInterruptions: interruptionEvents.length,
    interruptedMinutes: interruptionEvents.reduce((sum, event) => sum + event.durationMinutes, 0),
    eventLog
  };
};

const buildCoachingSummary = (metrics: ReturnType<typeof deriveMetrics>) => {
  const completionLine =
    metrics.totalTasks > 0
      ? `You completed ${metrics.completedTaskCount} of ${metrics.totalTasks} planned tasks and left ${metrics.incompleteTaskCount} unfinished.`
      : "No tasks were captured for the selected test date.";
  const interruptionLine =
    metrics.totalInterruptions > 0
      ? `The interruption breakdown shows ${metrics.internal} internal and ${metrics.external} external events, with ${formatMinutes(metrics.interruptedMinutes)} tracked as interrupted time.`
      : "No interruptions were recorded from the current snapshot.";

  if (metrics.completedTaskCount === metrics.totalTasks && metrics.totalTasks > 0 && metrics.timeStatus === "On track") {
    return {
      acknowledgment: "You finished the planned work without losing the thread.",
      insight: `Your tracked focus landed at ${formatPercent(metrics.timeRatio)} of the baseline, and the completion log is clean.`,
      nextStep: "Tomorrow: repeat the same opening routine and keep the first sprint length unchanged."
    };
  }

  if (metrics.incompleteTaskCount > 0 && metrics.blockedTasks.length > 0) {
    return {
      acknowledgment: "You kept moving, even with some work still open.",
      insight: `${completionLine} ${interruptionLine}`,
      nextStep: "Tomorrow: unblock the first stuck task before starting anything new."
    };
  }

  if (metrics.timeStatus === "Needed extra runway") {
    return {
      acknowledgment: "You held the work together without losing the day.",
      insight: `${completionLine} ${interruptionLine}`,
      nextStep: "Tomorrow: shorten the opening sprint or reduce the first task's scope."
    };
  }

  return {
    acknowledgment: "You kept the day moving, even when the pace changed.",
    insight: `${completionLine} ${interruptionLine}`,
    nextStep: metrics.incompleteTaskCount > 0 ? "Tomorrow: finish one unfinished task before opening a new one." : "Tomorrow: keep the same start routine and use the same baseline."
  };
};

const averageForQuestion = (submissions: DebriefSubmission[], key: "q1" | "q2" | "q3") => {
  if (submissions.length === 0) return null;
  const total = submissions.reduce((sum, submission) => sum + submission.answers[key], 0);
  return total / submissions.length;
};

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

const SubmissionTimelineModal = ({
  isOpen,
  onClose,
  submission
}: {
  isOpen: boolean;
  onClose: () => void;
  submission: DebriefSubmission | null;
}) => {
  if (!isOpen || !submission) {
    return null;
  }

  const versionedQuestionSet = getQuestionSetByVersion(submission.questionSetVersion) ?? getQuestionSet();
  const values = [submission.answers.q1, submission.answers.q2, submission.answers.q3] as const;
  const xPositions = [110, 255, 400];
  const yForValue = (value: DebriefAnswerValue) => 170 - ((value - 1) / 4) * 120;
  const polylinePoints = values.map((value, index) => `${xPositions[index]},${yForValue(value)}`).join(" ");

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Submission timeline">
      <div className="d-grid gap-3">
        <div className="small text-secondary">Submission v{submission.questionSetVersion} on {formatDateTime(submission.submittedAt)}</div>
        <svg viewBox="0 0 520 240" className="w-100" role="img" aria-label="Timeline chart of answer values across the three questions">
          {([5, 4, 3, 2, 1] as const).map((level) => {
            const y = 50 + (5 - level) * 30;
            return (
              <g key={level}>
                <line x1="70" y1={y} x2="470" y2={y} stroke="currentColor" strokeOpacity="0.12" />
                <text x="48" y={y + 4} className="small text-secondary" textAnchor="middle">
                  {level}
                </text>
              </g>
            );
          })}
          <line x1="70" y1="50" x2="70" y2="170" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="70" y1="170" x2="470" y2="170" stroke="currentColor" strokeOpacity="0.2" />
          <polyline points={polylinePoints} fill="none" stroke="#7a4dff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {values.map((value, index) => {
            const cx = xPositions[index];
            const cy = yForValue(value);
            return (
              <g key={index}>
                <circle cx={cx} cy={cy} r="8" fill="#7a4dff" />
                <circle cx={cx} cy={cy} r="14" fill="#7a4dff" opacity="0.12" />
                <text x={cx} y={cy - 16} textAnchor="middle" className="small fw-semibold" fill="currentColor">
                  {value}
                </text>
                <text x={cx} y="205" textAnchor="middle" className="small text-secondary">
                  Q{index + 1}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="d-grid gap-2">
          {versionedQuestionSet.questions.map((question, index) => {
            const answerValue = values[index];
            const answerLabel = versionedQuestionSet.answerOptions[index][answerValue - 1] ?? "Unknown";
            return (
              <div key={question} className="d-flex justify-content-between gap-3 small">
                <div className="fw-semibold">{question}</div>
                <div className="text-secondary text-end">
                  {answerValue} / 5, {answerLabel}
                </div>
              </div>
            );
          })}
        </div>
        {submission.answers.note ? <p className="mb-0 text-secondary">{submission.answers.note}</p> : null}
      </div>
    </ModalShell>
  );
};

export const DebriefingPage = ({ selectedTestDate }: Props) => {
  const [questionSet] = useState(() => getQuestionSet());
  const [submissions, setSubmissions] = useState<DebriefSubmission[]>(() => getSubmissionsForDate(selectedTestDate));

  useEffect(() => {
    setSubmissions(getSubmissionsForDate(selectedTestDate));
  }, [selectedTestDate]);

  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [answerDrafts, setAnswerDrafts] = useState<{ q1: DebriefAnswerValue; q2: DebriefAnswerValue; q3: DebriefAnswerValue; note: string }>({
    q1: 4,
    q2: 3,
    q3: 4,
    note: "The first reset worked once messages were closed."
  });

  const metrics = useMemo(() => deriveMetrics(selectedTestDate), [selectedTestDate]);
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
    setSubmissions([record]);
  };

  const snapshotTaskCount = metrics.plannedTasks.length;
  const latestSubmission = submissions[submissions.length - 1] ?? null;

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
                <CoachBadge tone={metrics.timeStatus === "On track" ? "purple" : "warning"} className="rounded-pill px-3 py-2">
                  {metrics.timeStatus}
                </CoachBadge>
                <CoachBadge tone={metrics.incompleteTaskCount > 0 ? "warning" : "purple"} className="rounded-pill px-3 py-2">
                  {metrics.completedTaskCount}/{snapshotTaskCount || 0} completed
                </CoachBadge>
                <CoachBadge tone={metrics.totalInterruptions >= 3 ? "danger" : "purple"} className="rounded-pill px-3 py-2">
                  {metrics.totalInterruptions} interruptions
                </CoachBadge>
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
                <CoachBadge tone={metrics.totalInterruptions >= 3 ? "warning" : "purple"} className="rounded-pill px-3 py-2">
                  Version {questionSet.version}
                </CoachBadge>
              </div>
              <div className="debrief-copy p-3 rounded-4 mb-3">
                <p className="mb-2 fw-semibold">{coaching.acknowledgment}</p>
                <p className="mb-2">{coaching.insight}</p>
                <p className="mb-0 fw-semibold text-purple">Next step: {coaching.nextStep}</p>
              </div>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="debrief-stat-card p-3 h-100">
                    <div className="small text-secondary text-uppercase fw-semibold">Completed</div>
                    <div className="h3 mb-0">{metrics.completedTaskCount}</div>
                    <div className="small text-secondary">of {snapshotTaskCount}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="debrief-stat-card p-3 h-100">
                    <div className="small text-secondary text-uppercase fw-semibold">Unfinished</div>
                    <div className="h3 mb-0">{metrics.incompleteTaskCount}</div>
                    <div className="small text-secondary">{metrics.blockedTasks.length} blocked</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="debrief-stat-card p-3 h-100">
                    <div className="small text-secondary text-uppercase fw-semibold">Actual focus</div>
                    <div className="h3 mb-0">{formatMinutes(metrics.actualMinutes)}</div>
                    <div className="small text-secondary">Tracked work only</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="debrief-stat-card p-3 h-100">
                    <div className="small text-secondary text-uppercase fw-semibold">Expected baseline</div>
                    <div className="h3 mb-0">{formatMinutes(metrics.expectedMinutesAtStart)}</div>
                    <div className="small text-secondary">Complexity-derived</div>
                  </div>
                </div>
              </div>
              <div className="small text-secondary mt-3">
                Time ratio: {formatPercent(metrics.timeRatio)} ({metrics.timeStatus})
              </div>
            </SectionCard>

            <SectionCard className="p-4 mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h2 className="h4 mb-1">Questions from Settings</h2>
                  <p className="text-secondary mb-0">These are read-only here. Answers are stored locally as numbers, while you see the editable labels from settings.</p>
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
                        {questionSet.answerOptions[index].map((option, optionIndex) => {
                          const selected = answerDrafts[key] === optionIndex + 1;
                          return (
                            <div className="col-12 col-sm-6 col-lg-4" key={option}>
                              <button
                                type="button"
                                className={`btn w-100 ${selected ? "btn-purple" : "btn-outline-purple"}`}
                                onClick={() => setAnswerDrafts((previous) => ({ ...previous, [key]: (optionIndex + 1) as DebriefAnswerValue }))}
                              >
                                {option}
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
                <div className="d-flex flex-wrap gap-2">
                  <CoachButton type="button" variant="outline" disabled={!latestSubmission} onClick={() => setIsTimelineOpen(true)}>
                    View timeline
                  </CoachButton>
                  <CoachButton variant="outline" type="button">Simulate check-in</CoachButton>
                </div>
              </div>

              <div className="d-grid gap-4 mb-4">
                <div className="row g-3">
                  <div className="col-12 col-md-4"><CircleAverage label="Question 1" value={averages.q1} count={submissions.length} /></div>
                  <div className="col-12 col-md-4"><CircleAverage label="Question 2" value={averages.q2} count={submissions.length} /></div>
                  <div className="col-12 col-md-4"><CircleAverage label="Question 3" value={averages.q3} count={submissions.length} /></div>
                </div>
              </div>

              <div className="d-grid gap-3">
                {submissions.length > 0 ? submissions.slice().reverse().map((submission) => {
                  const versionedQuestionSet = getQuestionSetByVersion(submission.questionSetVersion) ?? questionSet;

                  return (
                    <div key={submission.submittedAt} className="debrief-history-item p-3">
                      <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                        <strong>Submission v{submission.questionSetVersion}</strong>
                        <span className="small text-secondary">{formatDateTime(submission.submittedAt)}</span>
                      </div>
                      <div className="d-grid gap-2">
                        {versionedQuestionSet.questions.map((question, index) => {
                          const answerKey = `q${index + 1}` as "q1" | "q2" | "q3";
                          const answerLabel = versionedQuestionSet.answerOptions[index][submission.answers[answerKey] - 1] ?? "Unknown";
                          return (
                            <div key={question} className="small">
                              <span className="fw-semibold">{question}</span>
                              <span className="text-secondary"> - {answerLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                      {submission.answers.note ? <p className="mb-0 text-secondary mt-2">{submission.answers.note}</p> : null}
                      <div className="d-flex justify-content-end mt-3">
                        <CoachButton type="button" variant="outline" onClick={() => setIsTimelineOpen(true)}>
                          View timeline
                        </CoachButton>
                      </div>
                    </div>
                  );
                }) : <div className="text-secondary">No submissions yet for this test date.</div>}
              </div>
            </SectionCard>
          </div>

          <div className="col-12 col-lg-5">
            <SectionCard className="p-4 mb-4">
              <h2 className="h4 mb-3">Interruption breakdown</h2>
              <div className="row g-3">
                {[["Internal", metrics.internal], ["External", metrics.external], ["Auto", metrics.auto], ["Manual", metrics.manual]].map(([label, value]) => (
                  <div className="col-6" key={label as string}>
                    <div className="debrief-stat-card p-3 h-100">
                      <div className="small text-secondary text-uppercase fw-semibold">{label}</div>
                      <div className="h3 mb-0">{value as number}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="debrief-stat-card p-3 mt-3">
                <div className="small text-secondary text-uppercase fw-semibold">Interrupted time</div>
                <div className="h4 mb-0">{formatMinutes(metrics.interruptedMinutes)}</div>
                <div className="small text-secondary">Derived from the interruption events below.</div>
              </div>
            </SectionCard>

            <SectionCard className="p-4 mb-4">
              <h2 className="h4 mb-3">How the interruption breakdown is calculated</h2>
              <ul className="debrief-list mb-0">
                <li>Internal = blocked tasks from the selected test date snapshot.</li>
                <li>External = unfinished tasks that still recorded tracked work time.</li>
                <li>Auto = interruption events inferred from tracked work time left open.</li>
                <li>Manual = interruption events created from the blocked-task action.</li>
              </ul>
            </SectionCard>

            <SectionCard className="p-4">
              <h2 className="h4 mb-3">Event log</h2>
              <div className="d-grid gap-2 debrief-event-log">
                {metrics.eventLog.map((event, index) => (
                  <div key={`${event.type}-${index}`} className="debrief-event-item p-3">
                    <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-1">
                      <strong>
                        {event.type === "task_completed"
                          ? "Completed task"
                          : event.type === "task_unfinished"
                            ? `Unfinished task - ${event.state}`
                            : event.type === "interruption_logged"
                              ? `${event.kind} interruption`
                              : event.type === "question_set_updated"
                                ? `Question set v${event.version}`
                                : `Debrief submitted v${event.questionSetVersion}`}
                      </strong>
                      {event.type === "debrief_submitted" ? (
                        <span className="small text-secondary">{formatDateTime(event.submittedAt)}</span>
                      ) : event.type === "question_set_updated" ? (
                        <span className="small text-secondary">{formatDateTime(event.updatedAt)}</span>
                      ) : null}
                    </div>
                    <div className="small text-secondary text-break">
                      {event.type === "task_completed"
                        ? `${event.taskTitle} / planned ${formatMinutes(event.plannedMinutes)} / tracked ${formatMinutes(event.actualMinutes)}`
                        : event.type === "task_unfinished"
                          ? `${event.taskTitle} / state ${event.state} / planned ${formatMinutes(event.plannedMinutes)} / tracked ${formatMinutes(event.actualMinutes)}`
                          : event.type === "interruption_logged"
                            ? `${event.capture} / ${event.trigger} / ${formatMinutes(event.durationMinutes)}${event.note ? ` / ${event.note}` : ""}`
                            : event.type === "question_set_updated"
                              ? `Questions: ${event.questions.join(" | ")}`
                              : `Answers: ${event.answers.q1}, ${event.answers.q2}, ${event.answers.q3}${event.note ? ` / ${event.note}` : ""}`}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <SubmissionTimelineModal
          isOpen={isTimelineOpen}
          onClose={() => setIsTimelineOpen(false)}
          submission={latestSubmission}
        />
      </div>
    </section>
  );
};

