import Link from "next/link";
import { redirect } from "next/navigation";

import { SubmitButton } from "@/components/SubmitButton";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth";
import { getOptionalUser } from "@/lib/auth";

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getOptionalUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const message = typeof params.message === "string" ? params.message : undefined;

  return (
    <div className="mx-auto max-w-xl py-12">
      <div className="mb-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Acesso</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white">Volte para o controle da sua campanha.</h1>
        <p className="max-w-lg text-base leading-7 text-slate-400">
          Entre para continuar suas sessões, rever o histórico e ajustar a próxima rodada de treino.
        </p>
      </div>

      <Card className="space-y-6 border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_28%),linear-gradient(180deg,_rgba(11,18,32,0.96)_0%,_rgba(11,18,32,0.9)_100%)]">
        <div className="space-y-2">
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Use seu email e senha para acessar o painel de estudos.</CardDescription>
        </div>

        {message ? <p className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">{message}</p> : null}
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

        <form action={signIn} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="voce@email.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required placeholder="********" />
          </div>

          <SubmitButton className="w-full" pendingLabel="Entrando...">
            Acessar conta
          </SubmitButton>
        </form>

        <p className="text-sm text-slate-400">
          Ainda nao tem conta?{" "}
          <Link href="/register" className="font-semibold text-cyan-300">
            Criar agora
          </Link>
        </p>
      </Card>
    </div>
  );
}
