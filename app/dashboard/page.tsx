import { KPIStats } from "@/components/KPIStats";
import { ProgressChart } from "@/components/ProgressChart";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries";
import { formatDateTime, formatPercent, truncateText } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge>Dashboard</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Seu desempenho em um unico lugar</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-400">
          Acompanhe seu volume de respostas, precisao e os temas em que vale concentrar a proxima sessao.
        </p>
      </section>

      <KPIStats totalAnswered={data.totalAnswered} totalCorrect={data.totalCorrect} accuracy={data.accuracy} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardTitle>Precisao nos ultimos 30 dias</CardTitle>
          <CardDescription className="mt-2">
            O grafico mostra a precisao diaria para identificar constancia e oscilacoes recentes.
          </CardDescription>
          <div className="mt-6">
            <ProgressChart data={data.progress} />
          </div>
        </Card>

        <Card className="space-y-4">
          <CardTitle>Pontos de atencao</CardTitle>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-300">Piores assuntos</p>
              <div className="mt-3 space-y-3">
                {data.weakestSubjects.length > 0 ? (
                  data.weakestSubjects.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                      <p className="font-semibold text-slate-100">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatPercent(item.accuracy)} de precisao em {item.attempts} tentativas
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Ainda faltam 5 tentativas por assunto para destacar fraquezas.</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-300">Vestibulares com menor precisao</p>
              <div className="mt-3 space-y-3">
                {data.weakestExams.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                    <p className="font-semibold text-slate-100">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatPercent(item.accuracy)} de precisao em {item.attempts} tentativas
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Precisao por vestibular</CardTitle>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Vestibular</TableHeaderCell>
                  <TableHeaderCell>Tentativas</TableHeaderCell>
                  <TableHeaderCell>Acertos</TableHeaderCell>
                  <TableHeaderCell>Precisao</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {data.accuracyByExam.map((item) => (
                  <tr key={item.label}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell>{item.attempts}</TableCell>
                    <TableCell>{item.correct}</TableCell>
                    <TableCell>{formatPercent(item.accuracy)}</TableCell>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card>
          <CardTitle>Precisao por assunto</CardTitle>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Assunto</TableHeaderCell>
                  <TableHeaderCell>Tentativas</TableHeaderCell>
                  <TableHeaderCell>Acertos</TableHeaderCell>
                  <TableHeaderCell>Precisao</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {data.accuracyBySubject.length > 0 ? (
                  data.accuracyBySubject.map((item) => (
                    <tr key={item.label}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{item.attempts}</TableCell>
                      <TableCell>{item.correct}</TableCell>
                      <TableCell>{formatPercent(item.accuracy)}</TableCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <TableCell colSpan={4} className="text-sm text-slate-500">
                      Os assuntos so aparecem aqui a partir de 3 tentativas.
                    </TableCell>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Atividade recente</CardTitle>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
            <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Questao</TableHeaderCell>
                <TableHeaderCell>Origem</TableHeaderCell>
                <TableHeaderCell>Resposta</TableHeaderCell>
                <TableHeaderCell>Resultado</TableHeaderCell>
                <TableHeaderCell>Data</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {data.recentAttempts.length > 0 ? (
                data.recentAttempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <TableCell>{truncateText(attempt.questions?.text ?? "Questao indisponivel")}</TableCell>
                    <TableCell>{attempt.questions?.exam_origin ?? "-"}</TableCell>
                    <TableCell>{attempt.selected_answer}</TableCell>
                    <TableCell>{attempt.is_correct ? "Correta" : "Incorreta"}</TableCell>
                    <TableCell>{formatDateTime(attempt.answered_at)}</TableCell>
                  </tr>
                ))
              ) : (
                <tr>
                  <TableCell colSpan={5} className="text-sm text-slate-500">
                    Nenhuma tentativa registrada ainda.
                  </TableCell>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
