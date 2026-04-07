import { cache } from "react";

import { EXAM_ORIGINS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type {
  AttemptRecord,
  AttemptWithQuestion,
  DashboardData,
  DashboardMetric,
  FilterOptions,
  HistoryData,
  HistoryFilters,
  PracticeSession,
  PracticeSessionItem,
  SolvePageData,
} from "@/lib/types";
import { computeWeakest } from "@/lib/utils";

function safeQuestionSnippet(value: string) {
  return value.replaceAll(/\s+/g, " ").trim();
}

function normalizeJoinedQuestion<T extends { questions: unknown }>(row: T) {
  const question = Array.isArray(row.questions) ? row.questions[0] ?? null : row.questions;
  return {
    ...row,
    questions: question,
  };
}

function groupAccuracy(
  attempts: AttemptWithQuestion[],
  extractor: (attempt: AttemptWithQuestion) => string | null,
): DashboardMetric[] {
  const map = new Map<string, { attempts: number; correct: number }>();

  for (const attempt of attempts) {
    const label = extractor(attempt);

    if (!label) {
      continue;
    }

    const current = map.get(label) ?? { attempts: 0, correct: 0 };
    current.attempts += 1;
    current.correct += attempt.is_correct ? 1 : 0;
    map.set(label, current);
  }

  return Array.from(map.entries())
    .map(([label, value]) => ({
      label,
      attempts: value.attempts,
      correct: value.correct,
      accuracy: value.attempts === 0 ? 0 : (value.correct / value.attempts) * 100,
    }))
    .sort((left, right) => right.attempts - left.attempts || right.accuracy - left.accuracy);
}

export const getQuestionFilterOptions = cache(async (): Promise<FilterOptions> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("subject, year")
    .order("year", { ascending: false });

  if (error) {
    throw error;
  }

  const subjects = Array.from(
    new Set(
      (data ?? [])
        .map((item) => item.subject)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((left, right) => left.localeCompare(right, "pt-BR"));

  const years = Array.from(
    new Set(
      (data ?? [])
        .map((item) => item.year)
        .filter((value): value is number => typeof value === "number"),
    ),
  ).sort((left, right) => right - left);

  return { subjects, years };
});

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attempts")
    .select(
      "id, user_id, question_id, session_id, selected_answer, is_correct, answered_at, questions(id, text, exam_origin, subject, correct_answer, explanation, image_url, year)",
    )
    .eq("user_id", userId)
    .order("answered_at", { ascending: false });

  if (error) {
    throw error;
  }

  const attempts = ((data ?? []) as unknown as AttemptWithQuestion[])
    .map((attempt) => normalizeJoinedQuestion(attempt))
    .map((attempt) => ({
    ...attempt,
    questions: attempt.questions
      ? {
          ...attempt.questions,
          text: safeQuestionSnippet(attempt.questions.text),
        }
      : null,
    }));

  const totalAnswered = attempts.length;
  const totalCorrect = attempts.filter((attempt) => attempt.is_correct).length;
  const accuracy = totalAnswered === 0 ? 0 : (totalCorrect / totalAnswered) * 100;

  const accuracyByExam = groupAccuracy(attempts, (attempt) => attempt.questions?.exam_origin ?? null);
  const accuracyBySubject = groupAccuracy(attempts, (attempt) => attempt.questions?.subject ?? null).filter(
    (item) => item.attempts >= 3,
  );

  const weakestSubjects = computeWeakest(
    groupAccuracy(attempts, (attempt) => attempt.questions?.subject ?? null).filter((item) => item.attempts >= 5),
  );
  const weakestExams = computeWeakest(
    groupAccuracy(attempts, (attempt) => attempt.questions?.exam_origin ?? null),
  );

  const last30Dates = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (29 - index));
    return date;
  });

  const progress = last30Dates.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const dailyAttempts = attempts.filter((attempt) => attempt.answered_at.slice(0, 10) === key);
    const dailyCorrect = dailyAttempts.filter((attempt) => attempt.is_correct).length;

    return {
      date: key,
      attempts: dailyAttempts.length,
      accuracy: dailyAttempts.length === 0 ? 0 : (dailyCorrect / dailyAttempts.length) * 100,
    };
  });

  return {
    totalAnswered,
    totalCorrect,
    accuracy,
    accuracyByExam,
    accuracyBySubject,
    weakestSubjects,
    weakestExams,
    progress,
    recentAttempts: attempts.slice(0, 10),
  };
}

export async function getHistoryData(userId: string, filters: HistoryFilters): Promise<HistoryData> {
  const supabase = await createClient();

  let query = supabase
    .from("attempts")
    .select(
      "id, user_id, question_id, session_id, selected_answer, is_correct, answered_at, questions(id, text, exam_origin, subject, correct_answer, explanation, image_url, year)",
    )
    .eq("user_id", userId)
    .order("answered_at", { ascending: false });

  if (filters.correctness) {
    query = query.eq("is_correct", filters.correctness === "correct");
  }

  if (filters.from) {
    query = query.gte("answered_at", `${filters.from}T00:00:00.000Z`);
  }

  if (filters.to) {
    query = query.lte("answered_at", `${filters.to}T23:59:59.999Z`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const attempts = ((data ?? []) as unknown as AttemptWithQuestion[])
    .map((attempt) => normalizeJoinedQuestion(attempt))
    .filter((attempt) => {
    if (filters.examOrigin && attempt.questions?.exam_origin !== filters.examOrigin) {
      return false;
    }

    if (filters.subject && attempt.questions?.subject !== filters.subject) {
      return false;
    }

    return true;
    });

  const pageSize = 20;
  const total = attempts.length;
  const start = (filters.page - 1) * pageSize;

  return {
    attempts: attempts.slice(start, start + pageSize),
    page: filters.page,
    pageSize,
    total,
  };
}

export async function getSolvePageData(
  userId: string,
  sessionId: string,
  position: number,
): Promise<SolvePageData | null> {
  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase
    .from("practice_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("practice_session_items")
    .select(
      "session_id, question_id, position, questions(id, source_ref, text, image_url, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, subject, exam_origin, difficulty, year, tags, created_at)",
    )
    .eq("session_id", sessionId)
    .order("position", { ascending: true });

  if (itemsError) {
    throw itemsError;
  }

  const typedItems = (items ?? []) as unknown as PracticeSessionItem[];
  const currentItem = typedItems.find((item) => item.position === position) ?? null;

  let existingAttempt: AttemptRecord | null = null;

  if (currentItem) {
    const { data: attempt, error: attemptError } = await supabase
      .from("attempts")
      .select("id, user_id, question_id, session_id, selected_answer, is_correct, answered_at")
      .eq("user_id", userId)
      .eq("session_id", sessionId)
      .eq("question_id", currentItem.question_id)
      .maybeSingle();

    if (attemptError) {
      throw attemptError;
    }

    existingAttempt = attempt as AttemptRecord | null;
  }

  return {
    session: session as PracticeSession,
    items: typedItems,
    currentItem,
    existingAttempt,
  };
}

export function getExamOriginOptions() {
  return [...EXAM_ORIGINS];
}
