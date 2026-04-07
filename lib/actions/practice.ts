"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { practiceFilterSchema, attemptSubmissionSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { shuffle } from "@/lib/utils";

function redirectToSolve(params: Record<string, string>): never {
  const search = new URLSearchParams(params);
  redirect(`/questions/solve?${search.toString()}`);
}

function normalizeYear(value: FormDataEntryValue | null) {
  if (!value || value === "") {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export async function startPracticeSession(formData: FormData) {
  const user = await requireUser();
  const parsed = practiceFilterSchema.safeParse({
    examOrigins: formData.getAll("examOrigins"),
    subjects: formData.getAll("subjects"),
    yearFrom: normalizeYear(formData.get("yearFrom")),
    yearTo: normalizeYear(formData.get("yearTo")),
    questionCount: Number(formData.get("questionCount")),
    allowReanswer: formData.get("allowReanswer") === "on",
  });

  if (!parsed.success) {
    redirectToSolve({ error: parsed.error.issues[0]?.message ?? "Filtros invalidos." });
  }

  const data = parsed.data;
  const supabase = await createClient();
  let query = supabase
    .from("questions")
    .select(
      "id, source_ref, text, image_url, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, subject, exam_origin, difficulty, year, tags, created_at",
    )
    .in("exam_origin", data.examOrigins);

  if (data.subjects.length > 0) {
    query = query.in("subject", data.subjects);
  }

  if (data.yearFrom) {
    query = query.gte("year", data.yearFrom);
  }

  if (data.yearTo) {
    query = query.lte("year", data.yearTo);
  }

  const { data: allQuestions, error: questionsError } = await query;

  if (questionsError) {
    redirectToSolve({ error: "Nao foi possivel buscar as questoes." });
  }

  let availableQuestions = allQuestions ?? [];

  if (!data.allowReanswer) {
    const { data: attempts, error: attemptsError } = await supabase
      .from("attempts")
      .select("question_id")
      .eq("user_id", user.id);

    if (attemptsError) {
      redirectToSolve({ error: "Nao foi possivel carregar seu historico." });
    }

    const answeredIds = new Set((attempts ?? []).map((attempt) => attempt.question_id));
    availableQuestions = availableQuestions.filter((question) => !answeredIds.has(question.id));
  }

  const selectedQuestions = shuffle(availableQuestions).slice(0, data.questionCount);

  if (selectedQuestions.length === 0) {
    redirectToSolve({ error: "Nenhuma questao encontrada para esses filtros." });
  }

  const { data: session, error: sessionError } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: user.id,
      filters: data,
      question_count: selectedQuestions.length,
      allow_reanswer: data.allowReanswer,
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    redirectToSolve({ error: "Nao foi possivel iniciar a sessao." });
  }

  const items = selectedQuestions.map((question, index) => ({
    session_id: session.id,
    question_id: question.id,
    position: index + 1,
  }));

  const { error: itemsError } = await supabase.from("practice_session_items").insert(items);

  if (itemsError) {
    redirectToSolve({ error: "Nao foi possivel montar a sessao." });
  }

  const params: Record<string, string> = {
    session: session.id,
    position: "1",
  };

  if (selectedQuestions.length < data.questionCount) {
    params.message = `Foram encontradas apenas ${selectedQuestions.length} questoes para este filtro.`;
  }

  redirectToSolve(params);
}

export async function submitAttempt(formData: FormData) {
  const user = await requireUser();
  const parsed = attemptSubmissionSchema.safeParse({
    sessionId: formData.get("sessionId"),
    questionId: formData.get("questionId"),
    selectedAnswer: formData.get("selectedAnswer"),
  });

  if (!parsed.success) {
    redirectToSolve({ error: parsed.error.issues[0]?.message ?? "Resposta invalida." });
  }

  const data = parsed.data;
  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase
    .from("practice_sessions")
    .select("id, user_id")
    .eq("id", data.sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (sessionError || !session) {
    redirectToSolve({ error: "Sessao nao encontrada." });
  }

  const { data: sessionItems, error: sessionItemsError } = await supabase
    .from("practice_session_items")
    .select("session_id, question_id, position")
    .eq("session_id", data.sessionId)
    .order("position", { ascending: true });

  if (sessionItemsError) {
    redirectToSolve({ error: "Nao foi possivel validar a sessao." });
  }

  const currentItem = (sessionItems ?? []).find((item) => item.question_id === data.questionId);

  if (!currentItem) {
    redirectToSolve({ error: "Questao fora da sessao." });
  }

  const { data: existingAttempt } = await supabase
    .from("attempts")
    .select("id")
    .eq("user_id", user.id)
    .eq("session_id", data.sessionId)
    .eq("question_id", data.questionId)
    .maybeSingle();

  if (existingAttempt) {
    redirectToSolve({
      session: data.sessionId,
      position: String(currentItem.position),
      message: "Esta questao ja foi respondida nesta sessao.",
    });
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id, correct_answer")
    .eq("id", data.questionId)
    .maybeSingle();

  if (questionError || !question) {
    redirectToSolve({ error: "Questao nao encontrada." });
  }

  const isCorrect = question.correct_answer === data.selectedAnswer;

  const { error: insertError } = await supabase.from("attempts").insert({
    user_id: user.id,
    question_id: data.questionId,
    session_id: data.sessionId,
    selected_answer: data.selectedAnswer,
    is_correct: isCorrect,
  });

  if (insertError) {
    redirectToSolve({ error: "Nao foi possivel registrar a resposta." });
  }

  const nextPosition = currentItem.position + 1;
  const total = sessionItems?.length ?? currentItem.position;

  if (nextPosition > total) {
    await supabase
      .from("practice_sessions")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", data.sessionId)
      .eq("user_id", user.id);
  }

  redirectToSolve({
    session: data.sessionId,
    position: String(currentItem.position),
    message: isCorrect ? "Resposta correta." : "Resposta registrada.",
  });
}
