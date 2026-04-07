import { startPracticeSession } from "@/lib/actions/practice";
import type { FilterOptions } from "@/lib/types";

import { SubmitButton } from "@/components/SubmitButton";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionFilterProps {
  options: FilterOptions;
  message?: string;
  error?: string;
}

const examOrigins = ["ENEM", "FUVEST", "UNICAMP", "VUNESP"] as const;

export function QuestionFilter({ options, message, error }: QuestionFilterProps) {
  return (
    <Card className="space-y-6 border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_26%),linear-gradient(180deg,_rgba(11,18,32,0.95)_0%,_rgba(11,18,32,0.9)_100%)]">
      <div className="space-y-2">
        <CardTitle>Monte sua sessao</CardTitle>
        <CardDescription>
          Filtre por vestibular, assunto, faixa de ano e quantidade de questoes antes de iniciar.
        </CardDescription>
      </div>

      {message ? <p className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

      <form action={startPracticeSession} className="space-y-6">
        <div className="space-y-3">
          <Label>Vestibulares</Label>
          <div className="grid gap-3 md:grid-cols-4">
            {examOrigins.map((exam) => (
              <label
                key={exam}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/25 hover:bg-cyan-400/8"
              >
                <input type="checkbox" name="examOrigins" value={exam} defaultChecked className="h-4 w-4 accent-cyan-400" />
                {exam}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Assuntos</Label>
          <div className="grid gap-3 md:grid-cols-3">
            {options.subjects.length > 0 ? (
              options.subjects.map((subject) => (
                <label
                  key={subject}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/25 hover:bg-cyan-400/8"
                >
                  <input type="checkbox" name="subjects" value={subject} className="h-4 w-4 accent-cyan-400" />
                  {subject}
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-500">Os assuntos aparecem assim que houver questoes classificadas.</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="yearFrom">Ano inicial</Label>
            <select
              id="yearFrom"
              name="yearFrom"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              defaultValue=""
            >
              <option value="">Todos</option>
              {options.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearTo">Ano final</Label>
            <select
              id="yearTo"
              name="yearTo"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              defaultValue=""
            >
              <option value="">Todos</option>
              {options.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionCount">Quantidade</Label>
            <Input
              id="questionCount"
              name="questionCount"
              type="number"
              min={1}
              max={100}
              step={1}
              defaultValue={10}
              placeholder="10"
            />
            <p className="text-xs text-slate-500">Escolha qualquer valor entre 1 e 100 questoes.</p>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-dashed border-cyan-400/20 bg-cyan-400/6 px-4 py-4 text-sm text-slate-200">
          <input type="checkbox" name="allowReanswer" className="h-4 w-4 accent-cyan-400" />
          Permitir questoes que eu ja respondi anteriormente
        </label>

        <SubmitButton className="w-full md:w-auto" pendingLabel="Montando sessao...">
          Comecar pratica
        </SubmitButton>
      </form>
    </Card>
  );
}
