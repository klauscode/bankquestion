export const EXAM_ORIGINS = ["ENEM", "FUVEST", "UNICAMP", "VUNESP"] as const;
export const ANSWER_OPTIONS = ["A", "B", "C", "D", "E"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const PLANS = ["free", "pro", "lifetime"] as const;
export const QUESTION_COUNT_OPTIONS = [10, 20, 30, 50] as const;

export const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);
export const AUTH_PATHS = new Set(["/login", "/register"]);
export const PROTECTED_PREFIXES = ["/dashboard", "/history", "/questions"];
