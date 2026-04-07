import Link from "next/link";
import { redirect } from "next/navigation";

import { AnswerForm } from "@/components/AnswerForm";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionFilter } from "@/components/QuestionFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getQuestionFilterOptions, getSolvePageData } from "@/lib/queries";

interface SolvePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SolvePage({ searchParams }: SolvePageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const error = typeof params.error === "string" ? params.error : undefined;
  const message = typeof params.message === "string" ? params.message : undefined;
  const sessionId = typeof params.session === "string" ? params.session : undefined;
  const position = typeof params.position === "string" ? Number(params.position) : 1;

  if (!sessionId) {
    const options = await getQuestionFilterOptions();

    return (
      <div className="space-y-8">
        <section className="space-y-3">
          <Badge>Pratica guiada</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Monte uma sessao de resolucao</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-400">
            Escolha vestibulares, assuntos, periodo e quantidade de questoes para criar uma trilha objetiva.
          </p>
        </section>

        <QuestionFilter options={options} message={message} error={error} />
      </div>
    );
  }

  if (!Number.isFinite(position) || position < 1) {
    redirect("/questions/solve");
  }

  const solveData = await getSolvePageData(user.id, sessionId, position);

  if (!solveData) {
    redirect("/questions/solve?error=Sessao+nao+encontrada.");
  }

  const total = solveData.items.length;
  const currentItem = solveData.currentItem;

  if (!currentItem) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-10">
        <Card className="space-y-4 border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_28%),linear-gradient(180deg,_rgba(11,18,32,0.96)_0%,_rgba(11,18,32,0.9)_100%)]">
          <Badge>Sessao concluida</Badge>
          <CardTitle>Voce terminou esta lista</CardTitle>
          <CardDescription>
            Revise seu dashboard para ver a atualizacao das metricas ou monte uma nova sessao com outros filtros.
          </CardDescription>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button>Ir para o dashboard</Button>
            </Link>
            <Link href="/questions/solve">
              <Button variant="secondary">Nova sessao</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const nextPosition = currentItem.position + 1;
  const hasNext = nextPosition <= total;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge>
          Sessao {currentItem.position} / {total}
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Resolucao em foco</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-400">
          Responda uma questao por vez e acompanhe o feedback logo apos o envio.
        </p>
      </section>

      {message ? <p className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <QuestionCard
          question={currentItem.questions}
          selectedAnswer={solveData.existingAttempt?.selected_answer ?? null}
          revealAnswer={Boolean(solveData.existingAttempt)}
        />

        <Card className="space-y-5 border-cyan-400/10 bg-[linear-gradient(180deg,_rgba(11,18,32,0.96)_0%,_rgba(11,18,32,0.9)_100%)]">
          <CardTitle>{solveData.existingAttempt ? "Resultado" : "Sua resposta"}</CardTitle>
          <CardDescription>
            {solveData.existingAttempt
              ? "A questao ja foi corrigida nesta sessao. Avance para a proxima quando quiser."
              : "Selecione uma alternativa e envie para ver o gabarito comentado."}
          </CardDescription>

          {solveData.existingAttempt ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400">Resposta marcada</p>
                <p className="mt-1 text-3xl font-semibold text-white">{solveData.existingAttempt.selected_answer}</p>
                <p className="mt-2 text-sm text-slate-400">
                  Resultado: {solveData.existingAttempt.is_correct ? "Correta" : "Incorreta"}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {hasNext ? (
                  <Link href={`/questions/solve?session=${sessionId}&position=${nextPosition}`}>
                    <Button className="w-full">Proxima questao</Button>
                  </Link>
                ) : (
                  <Link href={`/questions/solve?session=${sessionId}&position=${nextPosition}`}>
                    <Button className="w-full">Finalizar sessao</Button>
                  </Link>
                )}
                <Link href="/questions/solve">
                  <Button variant="secondary" className="w-full">
                    Trocar filtros
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <AnswerForm sessionId={sessionId} question={currentItem.questions} />
          )}
        </Card>
      </div>
    </div>
  );
}
