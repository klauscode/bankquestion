import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { EXAM_ORIGINS } from "@/lib/constants";
import { getHistoryData, getQuestionFilterOptions } from "@/lib/queries";
import { historyFiltersSchema } from "@/lib/schemas";
import { buildSearchParams, formatDateTime, truncateText } from "@/lib/utils";

interface HistoryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const filters = historyFiltersSchema.parse({
    examOrigin: typeof params.examOrigin === "string" ? params.examOrigin : undefined,
    subject: typeof params.subject === "string" ? params.subject : undefined,
    correctness: typeof params.correctness === "string" ? params.correctness : undefined,
    from: typeof params.from === "string" ? params.from : undefined,
    to: typeof params.to === "string" ? params.to : undefined,
    page: typeof params.page === "string" ? params.page : "1",
  });

  const [history, options] = await Promise.all([getHistoryData(user.id, filters), getQuestionFilterOptions()]);
  const totalPages = Math.max(1, Math.ceil(history.total / history.pageSize));

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge>Historico</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Suas tentativas anteriores</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-400">
          Revise respostas passadas, filtre por resultado e veja padroes recorrentes nas bancas e materias.
        </p>
      </section>

      <Card className="border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_24%),linear-gradient(180deg,_rgba(11,18,32,0.96)_0%,_rgba(11,18,32,0.9)_100%)]">
        <CardTitle>Filtros</CardTitle>
        <CardDescription className="mt-2">Combine banca, assunto, resultado e intervalo de datas.</CardDescription>

        <form className="mt-6 grid gap-4 md:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="examOrigin">Vestibular</Label>
            <select
              id="examOrigin"
              name="examOrigin"
              defaultValue={filters.examOrigin ?? ""}
              className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Todos</option>
              {EXAM_ORIGINS.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <select
              id="subject"
              name="subject"
              defaultValue={filters.subject ?? ""}
              className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Todos</option>
              {options.subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctness">Resultado</Label>
            <select
              id="correctness"
              name="correctness"
              defaultValue={filters.correctness ?? ""}
              className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Todos</option>
              <option value="correct">Corretas</option>
              <option value="incorrect">Incorretas</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">De</Label>
            <Input id="from" name="from" type="date" defaultValue={filters.from ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Ate</Label>
            <Input id="to" name="to" type="date" defaultValue={filters.to ?? ""} />
          </div>

          <div className="md:col-span-5 flex gap-3">
            <Button type="submit">Aplicar filtros</Button>
            <Link href="/history">
              <Button variant="secondary">Limpar</Button>
            </Link>
          </div>
        </form>
      </Card>

      <Card className="border-cyan-400/10 bg-[linear-gradient(180deg,_rgba(11,18,32,0.96)_0%,_rgba(11,18,32,0.9)_100%)]">
        <CardTitle>Resultados</CardTitle>
        <CardDescription className="mt-2">{history.total} tentativas encontradas.</CardDescription>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Questao</TableHeaderCell>
                <TableHeaderCell>Vestibular</TableHeaderCell>
                <TableHeaderCell>Assunto</TableHeaderCell>
                <TableHeaderCell>Resposta</TableHeaderCell>
                <TableHeaderCell>Resultado</TableHeaderCell>
                <TableHeaderCell>Data</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {history.attempts.length > 0 ? (
                history.attempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <TableCell>{truncateText(attempt.questions?.text ?? "Questao indisponivel")}</TableCell>
                    <TableCell>{attempt.questions?.exam_origin ?? "-"}</TableCell>
                    <TableCell>{attempt.questions?.subject ?? "-"}</TableCell>
                    <TableCell>{attempt.selected_answer}</TableCell>
                    <TableCell>{attempt.is_correct ? "Correta" : "Incorreta"}</TableCell>
                    <TableCell>{formatDateTime(attempt.answered_at)}</TableCell>
                  </tr>
                ))
              ) : (
                <tr>
                    <TableCell colSpan={6} className="text-sm text-slate-500">
                      Nenhuma tentativa encontrada para os filtros atuais.
                    </TableCell>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Pagina {history.page} de {totalPages}
          </p>
          <div className="flex gap-3">
            {history.page > 1 ? (
              <Link
                href={`/history?${buildSearchParams({ ...filters, page: history.page - 1 })}`}
                className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                Anterior
              </Link>
            ) : null}
            {history.page < totalPages ? (
              <Link
                href={`/history?${buildSearchParams({ ...filters, page: history.page + 1 })}`}
                className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                Proxima
              </Link>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
