import { submitAttempt } from "@/lib/actions/practice";
import type { Question } from "@/lib/types";
import { cn, toQuestionOptions } from "@/lib/utils";

import { SubmitButton } from "@/components/SubmitButton";

interface AnswerFormProps {
  sessionId: string;
  question: Question;
}

export function AnswerForm({ sessionId, question }: AnswerFormProps) {
  return (
    <form action={submitAttempt} className="space-y-4">
      <input type="hidden" name="sessionId" value={sessionId} />
      <input type="hidden" name="questionId" value={question.id} />

      <div className="space-y-3">
        {toQuestionOptions(question).map((option) => (
          <label
            key={option.key}
            className={cn(
              "flex cursor-pointer gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-400/30 hover:bg-cyan-400/8",
            )}
          >
            <input
              type="radio"
              name="selectedAnswer"
              value={option.key}
              required
              className="mt-1 h-4 w-4 accent-cyan-400"
            />
            <div>
              <p className="font-semibold text-slate-50">{option.key}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{option.value}</p>
            </div>
          </label>
        ))}
      </div>

      <SubmitButton pendingLabel="Corrigindo resposta...">Enviar resposta</SubmitButton>
    </form>
  );
}
