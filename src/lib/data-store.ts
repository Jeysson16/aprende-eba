import { randomUUID } from "node:crypto";

import { buildQuestionFeedback } from "@/lib/feedback/rules";
import { evaluateAttempt } from "@/lib/feedback/scoring";
import { generateFeedback } from "@/lib/feedback/generate-feedback";
import {
  getInstrumentById,
  getSessionByCode,
  instruments,
  sessions,
} from "@/lib/pedagogy/seed-instruments";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AttemptRecord, FeedbackReport, Instrument, StudentProfile } from "@/lib/types";

const memoryAttempts: AttemptRecord[] = [];

function normalizeStoredFeedback(
  feedback: FeedbackReport,
  attempt: Omit<AttemptRecord, "feedback">,
  instrument: Instrument | undefined,
): FeedbackReport {
  if (feedback.questionFeedback?.length || !instrument) {
    return feedback;
  }

  return {
    ...feedback,
    questionFeedback: buildQuestionFeedback(attempt, instrument),
  };
}

function normalizeAttemptRecord(record: AttemptRecord): AttemptRecord {
  const { feedback, ...attempt } = record;
  const instrument = getInstrumentById(record.instrumentId);

  return {
    ...attempt,
    feedback: normalizeStoredFeedback(feedback, attempt, instrument),
  };
}

async function createAttemptInSupabase(record: AttemptRecord) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase.from("student_attempts").insert({
    id: record.id,
    session_code: record.sessionCode,
    instrument_id: record.instrumentId,
    student_name: record.student.fullName,
    student_section: record.student.section ?? null,
    consent_accepted: record.student.consentAccepted,
    answers: record.answers,
    total_score: record.totalScore,
    max_score: record.maxScore,
    percentage: record.percentage,
    level: record.level,
    criteria_results: record.criteriaResults,
    feedback: record.feedback,
    created_at: record.createdAt,
  });

  return !error;
}

async function listAttemptsFromSupabase() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("student_attempts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return null;

  return data.map<AttemptRecord>((row) =>
    normalizeAttemptRecord({
      id: row.id,
      sessionCode: row.session_code,
      instrumentId: row.instrument_id,
      student: {
        fullName: row.student_name,
        section: row.student_section ?? undefined,
        consentAccepted: Boolean(row.consent_accepted),
      },
      answers: row.answers as Record<string, string>,
      totalScore: row.total_score,
      maxScore: row.max_score,
      percentage: row.percentage,
      level: row.level,
      createdAt: row.created_at,
      criteriaResults: row.criteria_results,
      feedback: row.feedback,
    }),
  );
}

export async function listAttempts() {
  const remote = await listAttemptsFromSupabase();
  return remote ?? memoryAttempts.map(normalizeAttemptRecord);
}

export async function getAttemptById(id: string) {
  const attempts = await listAttempts();
  return attempts.find((attempt) => attempt.id === id);
}

export function listInstruments() {
  return instruments;
}

export function listSessions() {
  return sessions.map((session) => ({
    ...session,
    instrument: getInstrumentById(session.instrumentId),
  }));
}

export function getInstrumentDetails(id: string): Instrument | undefined {
  return getInstrumentById(id);
}

export function getSessionDetails(code: string) {
  const session = getSessionByCode(code);
  if (!session) return null;

  const instrument = getInstrumentById(session.instrumentId);
  if (!instrument) return null;

  return { session, instrument };
}

export async function createStudentAttempt(input: {
  sessionCode: string;
  student: StudentProfile;
  answers: Record<string, string>;
}) {
  const sessionDetails = getSessionDetails(input.sessionCode);
  if (!sessionDetails) {
    throw new Error("No se encontró una sesión activa con ese código.");
  }

  const base = evaluateAttempt(
    sessionDetails.instrument,
    input.student,
    input.answers,
  );

  const partial = {
    id: randomUUID(),
    sessionCode: sessionDetails.session.code,
    instrumentId: sessionDetails.instrument.id,
    createdAt: new Date().toISOString(),
    ...base,
  };

  const feedback = await generateFeedback(sessionDetails.instrument, partial);
  const record: AttemptRecord = normalizeAttemptRecord({ ...partial, feedback });

  const storedInSupabase = await createAttemptInSupabase(record);
  if (!storedInSupabase) {
    memoryAttempts.unshift(record);
  }

  return record;
}

export async function getDashboardStats() {
  const attempts = await listAttempts();
  const total = attempts.length;
  const average = total
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / total)
    : 0;
  const latest = attempts[0] ?? null;

  const weakestCriterion = attempts
    .flatMap((attempt) => attempt.criteriaResults)
    .sort((a, b) => a.percentage - b.percentage)[0];

  return {
    totalAttempts: total,
    averagePercentage: average,
    activeSessions: sessions.filter((session) => session.active).length,
    latestAttempt: latest,
    weakestCriterion: weakestCriterion?.title ?? "Sin datos",
  };
}
