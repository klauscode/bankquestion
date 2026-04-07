import Link from "next/link";
import { redirect } from "next/navigation";

import { SubmitButton } from "@/components/SubmitButton";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/actions/auth";
import { getOptionalUser } from "@/lib/auth";

interface RegisterPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const user = await getOptionalUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <div className="mx-auto max-w-xl py-12">
      <div className="mb-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Criar conta</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white">Entre no Gabaritou e comece forte.</h1>
        <p className="max-w-lg text-base leading-7 text-slate-400">
          Sua conta já nasce pronta para sessões guiadas, histórico de tentativas e leitura clara de progresso.
        </p>
      </div>

      <Card className="space-y-6 border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_28%),linear-gradient(180deg,_rgba(11,18,32,0.96)_0%,_rgba(11,18,32,0.9)_100%)]">
        <div className="space-y-2">
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Comece gratis e acompanhe seus resultados desde a primeira sessao.</CardDescription>
        </div>

        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

        <form action={signUp} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nome</Label>
            <Input id="displayName" name="displayName" type="text" required placeholder="Seu nome" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="voce@email.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required placeholder="Minimo de 8 caracteres" />
          </div>

          <SubmitButton className="w-full" pendingLabel="Criando conta...">
            Criar conta
          </SubmitButton>
        </form>

        <p className="text-sm text-slate-400">
          Ja possui conta?{" "}
          <Link href="/login" className="font-semibold text-cyan-300">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
