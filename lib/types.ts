import type { ANSWER_OPTIONS, DIFFICULTIES, EXAM_ORIGINS, PLANS } from "@/lib/constants";

export type AnswerOption = (typeof ANSWER_OPTIONS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type ExamOrigin = (typeof EXAM_ORIGINS)[number];
export type PlanType = (typeof PLANS)[number];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  plan: PlanType;
  plan_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  source_ref: string;
  text: string;
  image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: AnswerOption;
  explanation: string | null;
  subject: string | null;
  exam_origin: ExamOrigin;
  difficulty: Difficulty | null;
  year: number | null;
  tags: string[] | null;
  created_at: string;
}

export interface AttemptRecord {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string | null;
  selected_answer: AnswerOption;
  is_correct: boolean;
  answered_at: string;
}

export interface AttemptWithQuestion extends AttemptRecord {
  questions: Pick<
    Question,
    | "id"
    | "text"
    | "exam_origin"
    | "subject"
    | "correct_answer"
    | "explanation"
    | "image_url"
    | "year"
  > | null;
}

export interface FilterOptions {
  subjects: string[];
  years: number[];
}

export interface DashboardMetric {
  label: string;
  accuracy: number;
  attempts: number;
  correct: number;
}

export interface ProgressPoint {
  date: string;
  accuracy: number;
  attempts: number;
}

export interface DashboardData {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  accuracyByExam: DashboardMetric[];
  accuracyBySubject: DashboardMetric[];
  weakestSubjects: DashboardMetric[];
  weakestExams: DashboardMetric[];
  progress: ProgressPoint[];
  recentAttempts: AttemptWithQuestion[];
}

export interface HistoryFilters {
  examOrigin?: ExamOrigin;
  subject?: string;
  correctness?: "correct" | "incorrect";
  from?: string;
  to?: string;
  page: number;
}

export interface HistoryData {
  attempts: AttemptWithQuestion[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  filters: Json;
  question_count: number;
  allow_reanswer: boolean;
  started_at: string;
  completed_at: string | null;
}

export interface PracticeSessionItem {
  session_id: string;
  question_id: string;
  position: number;
  questions: Question;
}

export interface SolvePageData {
  session: PracticeSession;
  items: PracticeSessionItem[];
  currentItem: PracticeSessionItem | null;
  existingAttempt: AttemptRecord | null;
}

export interface QuestionImport {
  source_ref: string;
  text: string;
  image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: AnswerOption;
  explanation: string | null;
  subject: string | null;
  exam_origin: ExamOrigin;
  difficulty: Difficulty | null;
  year: number | null;
  tags: string[] | null;
}
