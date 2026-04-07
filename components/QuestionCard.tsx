import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ImageDisplay } from "@/components/ImageDisplay";
import type { AnswerOption, Question } from "@/lib/types";
import { cn, toQuestionOptions } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: AnswerOption | null;
  revealAnswer?: boolean;
}

export function QuestionCard({ question, selectedAnswer, revealAnswer = false }: QuestionCardProps) {
  return (
    <Card className="space-y-6 border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.1),_transparent_28%),linear-gradient(180deg,_rgba(11,18,32,0.96)_0%,_rgba(11,18,32,0.88)_100%)]">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{question.exam_origin}</Badge>
        {question.subject ? <Badge className="bg-blue-400/10 text-blue-200 ring-blue-400/20">{question.subject}</Badge> : null}
        {question.year ? <Badge className="bg-slate-400/10 text-slate-200 ring-slate-400/20">{question.year}</Badge> : null}
      </div>

      <div className="space-y-3">
        <CardDescription>Resolva a questao e avance para a proxima.</CardDescription>
        <CardTitle className="text-2xl leading-tight">Enunciado</CardTitle>
        <div className="prose prose-invert max-w-none prose-p:leading-7 prose-strong:text-white prose-headings:text-white">
          <ReactMarkdown>{question.text}</ReactMarkdown>
        </div>
      </div>

      {question.image_url ? <ImageDisplay src={question.image_url} alt={`Imagem da questao ${question.source_ref}`} /> : null}

      <div className="space-y-3">
        {toQuestionOptions(question).map((option) => {
          const isSelected = selectedAnswer === option.key;
          const isCorrect = revealAnswer && question.correct_answer === option.key;
          const isIncorrectChoice = revealAnswer && isSelected && !isCorrect;

          return (
            <div
              key={option.key}
              className={cn(
                "rounded-2xl border p-4 text-sm leading-6 transition-colors",
                isCorrect && "border-cyan-400/50 bg-cyan-400/10 text-cyan-50",
                isIncorrectChoice && "border-rose-400/50 bg-rose-500/10 text-rose-100",
                !isCorrect && !isIncorrectChoice && "border-white/10 bg-white/[0.04]",
              )}
            >
              <p className="font-semibold text-slate-50">{option.key}</p>
              <p className="mt-1 text-slate-300">{option.value}</p>
            </div>
          );
        })}
      </div>

      {revealAnswer && question.explanation ? (
        <div className="rounded-2xl border border-cyan-400/12 bg-[#060d18] p-5 text-sm leading-7 text-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Explicacao</p>
          <ReactMarkdown>{question.explanation}</ReactMarkdown>
        </div>
      ) : null}
    </Card>
  );
}
