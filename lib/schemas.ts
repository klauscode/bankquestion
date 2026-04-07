import { z } from "zod";

import { ANSWER_OPTIONS, DIFFICULTIES, EXAM_ORIGINS } from "@/lib/constants";

export const answerOptionSchema = z.enum(ANSWER_OPTIONS);
export const examOriginSchema = z.enum(EXAM_ORIGINS);
export const difficultySchema = z.enum(DIFFICULTIES);

export const authSchema = z.object({
  email: z.string().email("Informe um email valido."),
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres.")
    .max(72, "A senha excede o limite aceito."),
  displayName: z.string().trim().min(2, "Informe seu nome.").max(80).optional(),
});

export const historyFiltersSchema = z.object({
  examOrigin: examOriginSchema.optional(),
  subject: z.string().trim().min(1).optional(),
  correctness: z.enum(["correct", "incorrect"]).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const practiceFilterSchema = z
  .object({
    examOrigins: z.array(examOriginSchema).min(1, "Selecione ao menos um vestibular."),
    subjects: z.array(z.string().trim().min(1)).default([]),
    yearFrom: z.number().int().min(1900).max(2100).nullable().optional(),
    yearTo: z.number().int().min(1900).max(2100).nullable().optional(),
    questionCount: z.number().int().min(1).max(100),
    allowReanswer: z.boolean().default(false),
  })
  .refine(
    (value) =>
      value.yearFrom === null ||
      value.yearTo === null ||
      value.yearFrom === undefined ||
      value.yearTo === undefined ||
      value.yearFrom <= value.yearTo,
    {
      path: ["yearTo"],
      message: "O ano final precisa ser maior ou igual ao ano inicial.",
    },
  );

export const attemptSubmissionSchema = z.object({
  sessionId: z.string().uuid("Sessao invalida."),
  questionId: z.string().uuid("Questao invalida."),
  selectedAnswer: answerOptionSchema,
});

export const questionImportSchema = z.object({
  source_ref: z.string().trim().min(3).max(180),
  text: z.string().trim().min(10),
  image_url: z.string().url().nullable(),
  option_a: z.string().trim().min(1),
  option_b: z.string().trim().min(1),
  option_c: z.string().trim().min(1),
  option_d: z.string().trim().min(1),
  option_e: z.string().trim().min(1),
  correct_answer: answerOptionSchema,
  explanation: z.string().trim().min(1).nullable(),
  subject: z.string().trim().min(1).nullable(),
  exam_origin: examOriginSchema,
  difficulty: difficultySchema.nullable(),
  year: z.number().int().min(1900).max(2100).nullable(),
  tags: z.array(z.string().trim().min(1)).nullable(),
});

export const questionImportArraySchema = z.array(questionImportSchema);
