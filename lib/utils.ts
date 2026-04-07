import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { AnswerOption, DashboardMetric, Question } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function toQuestionOptions(question: Pick<Question, "option_a" | "option_b" | "option_c" | "option_d" | "option_e">) {
  return [
    { key: "A" as AnswerOption, value: question.option_a },
    { key: "B" as AnswerOption, value: question.option_b },
    { key: "C" as AnswerOption, value: question.option_c },
    { key: "D" as AnswerOption, value: question.option_d },
    { key: "E" as AnswerOption, value: question.option_e },
  ];
}

export function truncateText(value: string, max = 92) {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max).trimEnd()}...`;
}

export function buildSearchParams(values: Record<string, string | number | undefined | null>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  return params.toString();
}

export function computeWeakest(metrics: DashboardMetric[], limit = 3) {
  return [...metrics]
    .sort((left, right) => {
      if (left.accuracy === right.accuracy) {
        return right.attempts - left.attempts;
      }

      return left.accuracy - right.accuracy;
    })
    .slice(0, limit);
}
