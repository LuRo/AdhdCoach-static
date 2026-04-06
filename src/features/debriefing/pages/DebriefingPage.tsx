import { useMemo, useState } from "react";
import { useI18n } from "../../../lib/i18n";
import { CoachBadge } from "../../../components/ui/CoachBadge";
import { CoachButton } from "../../../components/ui/CoachButton";
import { SectionCard } from "../../../components/ui/SectionCard";
import { PageIntroBlock } from "../../../components/ui/PageIntroBlock";
import { DebriefSummaryCard } from "../component/DebriefSummaryCard";
import {
  appendSubmissionForDate,
  getAnswerOptions,
  getQuestionSet,
  getQuestionSetByVersion,
  getSelectedTestDate,
  getSubmissionsForDate,
  type DebriefAnswerValue,
  type DebriefSubmission
} from "../../morning/store";

type InterruptionKind = "internal" | "external";

type EventRecord =
  | { type: "interruption_logged"; kind: InterruptionKind; capture: "auto" | "manual"; trigger: string; durationSeconds?: number; note?: string; at: string }
  | { type: "checkin_prompt_sent"; channel: "in_app" | "push"; promptType: "still_on_task"; at: string }
  | { type: "checkin_prompt_answered"; answer: "yes_still_on_task" | "paused" | "switched"; interruptionKind: InterruptionKind | "none"; at: string };

interface Props {
  selectedTestDate?: string;
}

const formatMinutes = (minutes: number, locale: string) => `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(minutes))}m`;
const formatPercent = (ratio: number, locale: string) => `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(ratio * 100))}%`;
const formatDateTime = (value: string, locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const formatTimeOnly = (value: string, locale: string) => new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date(value));

const getTimeStatusKey = (timeRatio: number) => {
  if (timeRatio <= 1) return "onTrack" as const;
  if (timeRatio <= 1.5) return "extraRunway" as const;
  return "highFriction" as const;
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
    timeStatusKey: getTimeStatusKey(timeRatio),
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

const buildCoachingSummary = (
  metrics: ReturnType<typeof deriveMetrics>,
  locale: "en" | "de" | "fr",
  ui: any
) => {

  const labels = ui.localeLabels;
  const dominantCause = metrics.external >= metrics.internal ? labels.causes.external : labels.causes.internal;

  if (metrics.totalInterruptions >= 3) {
    return {
      acknowledgment: ui.coaching.highInterruptions.acknowledgment,
      insight: ui.coaching.highInterruptions.insight.replace("{{dominantCause}}", dominantCause).replace("{{minutes}}", formatMinutes(metrics.interruptedMinutes, locale)),
      nextStep: ui.coaching.highInterruptions.nextStep
    };
  }

  if (metrics.timeStatusKey === "extraRunway" && metrics.totalInterruptions <= 2) {
    return {
      acknowledgment: ui.coaching.extraRunway.acknowledgment,
      insight: ui.coaching.extraRunway.insight.replace("{{ratio}}", formatPercent(metrics.timeRatio, locale)),
      nextStep: ui.coaching.extraRunway.nextStep
    };
  }

  if (metrics.timeStatusKey === "onTrack") {
    return {
      acknowledgment: ui.coaching.onTrack.acknowledgment,
      insight: ui.coaching.onTrack.insight,
      nextStep: ui.coaching.onTrack.nextStep
    };
  }

  return {
    acknowledgment: ui.coaching.default.acknowledgment,
    insight: ui.coaching.default.insight.replace("{{status}}", ui.status[metrics.timeStatusKey]).replace("{{ratio}}", formatPercent(metrics.timeRatio, locale)),
    nextStep: ui.coaching.default.nextStep
  };
};

export const DebriefingPage = ({ selectedTestDate: selectedTestDateProp }: Props) => {
  const { copy, locale } = useI18n();
  const debriefingUi = copy.ui.debriefingPage as any;
  const [questionSet] = useState(() => getQuestionSet());
  const [selectedTestDate] = useState(() => selectedTestDateProp ?? getSelectedTestDate());
  const [submissions, setSubmissions] = useState<DebriefSubmission[]>(() => getSubmissionsForDate(selectedTestDate));
  const [answerDrafts, setAnswerDrafts] = useState<{ q1: DebriefAnswerValue; q2: DebriefAnswerValue; q3: DebriefAnswerValue; note: string }>({
    q1: 4,
    q2: 3,
    q3: 4,
    note: debriefingUi.initialNote
  });

  const metrics = useMemo(() => deriveMetrics(), []);
  const coaching = useMemo(() => buildCoachingSummary(metrics, locale, debriefingUi), [metrics, locale, debriefingUi]);
  const answerOptions = useMemo(() => getAnswerOptions(locale), [locale]);
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

  const labels = debriefingUi.localeLabels;
  const timeStatus = debriefingUi.status[metrics.timeStatusKey];
  const strategyItems = Array.isArray(debriefingUi.strategy)
    ? debriefingUi.strategy
    : typeof debriefingUi.strategy === "string"
      ? [debriefingUi.strategy]
      : Object.values(debriefingUi.strategy ?? {}).filter((item): item is string => typeof item === "string");

  return (
    <section id="debriefing-panel" className="section-panel active" role="tabpanel" aria-labelledby="debriefing-heading">
      <div className="debrief-page">
        <SectionCard className="app-hero mb-4">
          <div className="app-hero-content d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center h-100">
            <PageIntroBlock
              namespaceKey="debriefingPage"
              labelI18nKey="debriefingPage.heroEyebrow"
              titleI18nKey="debriefingPage.heroTitle"
              introI18nKey="debriefingPage.heroLead"
              labelDefaultText={debriefingUi.heroEyebrow ?? "Append-only reflection trail"}
              titleDefaultText={debriefingUi.heroTitle ?? "Close the day without turning it into a scorecard."}
              introDefaultText={debriefingUi.heroLead ?? "Review the work, notice the friction honestly, and leave with one practical adjustment for tomorrow."}
            />            
            <DebriefSummaryCard
              selectedTestDate={selectedTestDate}
              timeStatus={timeStatus}
              timeStatusKey={metrics.timeStatusKey}
              totalInterruptions={metrics.totalInterruptions}
            />
          </div>
        </SectionCard>

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <SectionCard className="p-4 mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h2 className="h4 mb-1">{debriefingUi.summaryHeading}</h2>
                  <p className="text-secondary mb-0">{debriefingUi.summaryLead}</p>
                </div>
                <CoachBadge tone={metrics.totalInterruptions >= 3 ? "warning" : "purple"} className="rounded-pill px-3 py-2">{debriefingUi.versionLabel} {questionSet.version}</CoachBadge>
              </div>
              <div className="debrief-copy p-3 rounded-4 mb-3">
                <p className="mb-2 fw-semibold">{coaching.acknowledgment}</p>
                <p className="mb-2">{coaching.insight}</p>
                <p className="mb-0 fw-semibold text-purple">{coaching.nextStep}</p>
              </div>
              <div className="row g-3">
                <div className="col-md-4"><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">{debriefingUi.actualFocus}</div><div className="h3 mb-0">{formatMinutes(metrics.actualMinutes, locale)}</div><div className="small text-secondary">{debriefingUi.actualFocusNote}</div></div></div>
                <div className="col-md-4"><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">{debriefingUi.expectedBaseline}</div><div className="h3 mb-0">60m</div><div className="small text-secondary">{debriefingUi.expectedBaselineNote}</div></div></div>
                <div className="col-md-4"><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">{debriefingUi.timeRatio}</div><div className="h3 mb-0">{formatPercent(metrics.timeRatio, locale)}</div><div className="small text-secondary">{timeStatus}</div></div></div>
              </div>
            </SectionCard>

            <SectionCard className="p-4 mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h2 className="h4 mb-1">{debriefingUi.questionsHeading}</h2>
                  <p className="text-secondary mb-0">{debriefingUi.questionsLead}</p>
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
                          <div className="small text-secondary fw-semibold">{debriefingUi.questionLabel.replace("{{index}}", String(index + 1))}</div>
                          <div className="h5 mb-0">{question}</div>
                        </div>
                        <CoachBadge tone="purple" className="rounded-pill px-3 py-2">{debriefingUi.storedValueHidden}</CoachBadge>
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
                <span className="small text-secondary fw-semibold mb-1 d-block">{debriefingUi.optionalNote}</span>
                <textarea
                  className="form-control"
                  rows={3}
                  value={answerDrafts.note}
                  onChange={(event) => setAnswerDrafts((previous) => ({ ...previous, note: event.target.value }))}
                />
              </label>

              <div className="d-flex flex-wrap gap-2 mt-3">
                <CoachButton type="button" onClick={submitDebrief}>{debriefingUi.submit}</CoachButton>
              </div>
            </SectionCard>

            <SectionCard className="p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h2 className="h4 mb-1">{debriefingUi.historyHeading}</h2>
                  <p className="text-secondary mb-0">{debriefingUi.historyLead}</p>
                </div>
                <CoachButton variant="outline" type="button">{debriefingUi.simulateCheckin}</CoachButton>
              </div>

              <div className="d-grid gap-4 mb-4">
                <div className="row g-3">
                  <div className="col-12 col-md-4"><CircleAverage label={debriefingUi.questionLabel.replace("{{index}}", "1")} value={averages.q1} count={submissions.length} countLabel={debriefingUi.localeLabels.submissions} locale={locale} /></div>
                  <div className="col-12 col-md-4"><CircleAverage label={debriefingUi.questionLabel.replace("{{index}}", "2")} value={averages.q2} count={submissions.length} countLabel={debriefingUi.localeLabels.submissions} locale={locale} /></div>
                  <div className="col-12 col-md-4"><CircleAverage label={debriefingUi.questionLabel.replace("{{index}}", "3")} value={averages.q3} count={submissions.length} countLabel={debriefingUi.localeLabels.submissions} locale={locale} /></div>
                </div>
              </div>

              <div className="d-grid gap-3">
                {submissions.length > 0 ? submissions.slice().reverse().map((submission) => (
                  <div key={submission.submittedAt} className="debrief-history-item p-3">
                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                      <strong>{debriefingUi.submissionVersion.replace("{{version}}", String(submission.questionSetVersion))}</strong>
                      <span className="small text-secondary">{formatDateTime(submission.submittedAt, locale)}</span>
                    </div>
                    <div className="d-grid gap-2">
                      {(getQuestionSetByVersion(submission.questionSetVersion)?.questions ?? questionSet.questions).map((question, index) => {
                        const answerKey = `q${index + 1}` as "q1" | "q2" | "q3";
                        const answerLabel = answerOptions.find((option) => option.value === submission.answers[answerKey])?.label ?? "-";
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
                )) : <div className="text-secondary">{debriefingUi.noSubmissions}</div>}
              </div>
            </SectionCard>
          </div>

          <div className="col-12 col-lg-5">
            <SectionCard className="p-4 mb-4">
              <h2 className="h4 mb-3">{debriefingUi.interruptionHeading}</h2>
              <div className="row g-3">
                {[ [debriefingUi.status.highFriction, metrics.internal], [debriefingUi.status.onTrack, metrics.external], [debriefingUi.checkinSentLabel, metrics.auto], [debriefingUi.checkinAnsweredLabel, metrics.manual] ].map(([label, value]) => (
                  <div className="col-6" key={label as string}><div className="debrief-stat-card p-3 h-100"><div className="small text-secondary text-uppercase fw-semibold">{label}</div><div className="h3 mb-0">{value as number}</div></div></div>
                ))}
              </div>
              <div className="debrief-stat-card p-3 mt-3">
                <div className="small text-secondary text-uppercase fw-semibold">{debriefingUi.interruptionTime}</div>
                <div className="h4 mb-0">{formatMinutes(metrics.interruptedMinutes, locale)}</div>
                <div className="small text-secondary">{debriefingUi.checkinsSummary.replace("{{sent}}", String(metrics.checkinsSent)).replace("{{answered}}", String(metrics.checkinsAnswered))}</div>
              </div>
            </SectionCard>

            <SectionCard className="p-4 mb-4">
              <h2 className="h4 mb-3">{debriefingUi.strategyHeading}</h2>
              <ul className="debrief-list mb-0">
                {strategyItems.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard className="p-4">
              <h2 className="h4 mb-3">{debriefingUi.eventLogHeading}</h2>
              <div className="d-grid gap-2 debrief-event-log">
                {metrics.eventLog.map((event) => (
                  <div key={`${event.type}-${event.at}`} className="debrief-event-item p-3">
                    <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-1">
                      <strong>
                        {event.type === "interruption_logged"
                          ? debriefingUi.interruptionLabel.replace("{{kind}}", labels.kind[event.kind])
                          : event.type === "checkin_prompt_sent"
                            ? debriefingUi.checkinSentLabel
                            : debriefingUi.checkinAnsweredLabel}
                      </strong>
                      <span className="small text-secondary">{formatTimeOnly(event.at, locale)}</span>
                    </div>
                    <div className="small text-secondary text-break">
                      {event.type === "interruption_logged"
                        ? `${event.capture} / ${event.trigger}${event.note ? ` / ${event.note}` : ""}`
                        : event.type === "checkin_prompt_sent"
                          ? debriefingUi.channelLabel.replace("{{channel}}", labels.channel[event.channel])
                          : debriefingUi.answerLabel.replace("{{answer}}", labels.answer[event.answer])}
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

const CircleAverage = ({ label, value, count, countLabel, locale }: { label: string; value: number | null; count: number; countLabel: string; locale: string }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const ratio = value ? value / 5 : 0;
  const dashOffset = circumference * (1 - ratio);

  return (
    <div className="debrief-average-item d-flex flex-column align-items-center gap-2 text-center">
      <svg className="debrief-average-circle" viewBox="0 0 96 96" role="img" aria-label={`${label} average ${value ? value.toFixed(1) : "no data"} out of 5`}>
        <circle cx="48" cy="48" r={radius} className="debrief-average-track" />
        {value ? <circle cx="48" cy="48" r={radius} className="debrief-average-progress" strokeDasharray={circumference} strokeDashoffset={dashOffset} /> : null}
        <text x="48" y="44" textAnchor="middle" className="debrief-average-value">{value ? new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value) : "--"}</text>
        <text x="48" y="58" textAnchor="middle" className="debrief-average-subvalue">/ 5</text>
      </svg>
      <div>
        <div className="fw-semibold">{label}</div>
        <div className="small text-secondary">{count} {countLabel}</div>
      </div>
    </div>
  );
};


