import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Gamepad2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Target,
    title: "Treino com alvo claro",
    description: "Monte listas por vestibular, assunto, ano e quantidade exata para atacar sua maior lacuna.",
  },
  {
    icon: Trophy,
    title: "Feedback imediato",
    description: "Cada resposta vira placar, correção e leitura rápida do que precisa subir no próximo bloco.",
  },
  {
    icon: Layers3,
    title: "Progressão visível",
    description: "Dashboard com precisão por banca, matéria, histórico e evolução recente sem ruído.",
  },
];

const tracks = [
  { label: "ENEM", accent: "from-sky-500 to-cyan-400", note: "ritmo, leitura e repertório" },
  { label: "FUVEST", accent: "from-cyan-400 to-blue-400", note: "profundidade e precisão" },
  { label: "UNICAMP", accent: "from-blue-400 to-sky-300", note: "interpretação e síntese" },
  { label: "VUNESP", accent: "from-cyan-300 to-slate-200", note: "consistência e velocidade" },
];

const highlights = [
  "Sessões fixas para evitar prática solta e sem direção",
  "Fluxo de uma questão por vez com correção instantânea",
  "Base pronta para recursos premium desde o MVP",
  "Arquitetura segura com auth SSR e RLS no Supabase",
];

const proof = [
  { value: "4 bancas", label: "ENEM, FUVEST, UNICAMP e VUNESP desde o lançamento" },
  { value: "1 sessão", label: "um fluxo limpo do filtro até a correção, sem telas perdidas" },
  { value: "100%", label: "foco em clareza de progresso, não em volume vazio de conteúdo" },
];

const phases = [
  {
    icon: Swords,
    title: "Escolha sua fase",
    description: "Defina banca, assunto, período e volume. O Gabaritou monta uma sessão com começo, meio e fim.",
  },
  {
    icon: Zap,
    title: "Jogue a rodada",
    description: "Resolva uma questão por vez, sem bagunça, com feedback imediato e explicação quando existir.",
  },
  {
    icon: Flame,
    title: "Suba o nível",
    description: "O painel mostra onde você está acertando, onde está travando e qual banca merece prioridade.",
  },
];

export default function Home() {
  return (
    <div className="-mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#07111f] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(96,165,250,0.18),_transparent_24%),linear-gradient(180deg,_rgba(7,17,31,0.94)_0%,_rgba(3,7,18,1)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-400/60 to-transparent" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
                Gabaritou
              </span>
              <span className="inline-flex items-center rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
                treino com energia de game
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white md:text-7xl">
                A página de treino que faz vestibular parecer fase final.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Banco de questões com pegada mais intensa, fluxo mais limpo e leitura de desempenho feita para quem
                quer acertar mais, e não só responder mais.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Criar conta grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/questions/solve">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Explorar prática
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {proof.map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-12 h-28 w-28 rounded-full bg-sky-400/25 blur-3xl" />
            <div className="absolute -right-8 bottom-12 h-28 w-28 rounded-full bg-blue-400/25 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-[0_24px_90px_rgba(2,8,23,0.5)]">
              <div className="flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Missão ativa</p>
                  <p className="mt-1 text-lg font-semibold text-white">Fechar suas maiores falhas antes da prova</p>
                </div>
                <div className="rounded-2xl bg-linear-to-br from-cyan-400 to-blue-500 p-3 text-slate-950">
                  <Gamepad2 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-linear-to-br from-sky-500 to-cyan-400 p-5 text-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em]">Precisão atual</p>
                  <p className="mt-3 text-5xl font-semibold">78%</p>
                  <p className="mt-2 text-sm font-medium">subindo nas últimas sessões</p>
                </div>

                <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Streak semanal</p>
                      <p className="mt-1 text-3xl font-semibold text-white">6 dias</p>
                    </div>
                    <Flame className="h-8 w-8 text-cyan-300" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-white/8">
                      <div className="h-2 w-[72%] rounded-full bg-linear-to-r from-cyan-400 to-blue-400" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Progresso do ciclo</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Radar de risco</p>
                    <p className="mt-1 text-xl font-semibold text-white">Química e FUVEST pedindo prioridade</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-sky-300" />
                </div>

                <div className="mt-4 space-y-3">
                  {tracks.map((track) => (
                    <div key={track.label} className="rounded-2xl bg-slate-950/70 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{track.label}</p>
                          <p className="text-sm text-slate-400">{track.note}</p>
                        </div>
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full rounded-full bg-linear-to-r ${track.accent} w-[68%]`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#060d18] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.7rem] border border-white/8 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(2,8,23,0.22)]"
              >
                <div className="inline-flex rounded-2xl bg-linear-to-br from-cyan-400 to-blue-500 p-3 text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-300">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-linear-to-b from-[#060d18] to-[#0b1322] px-4 py-18 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Como funciona</p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              Menos cara de plataforma genérica. Mais cara de progressão real.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-300">
              O Gabaritou foi desenhado para parecer uma campanha em andamento: escolher missão, jogar rodada,
              ler o placar e ajustar a próxima ofensiva.
            </p>

            <div className="rounded-[1.8rem] border border-cyan-300/15 bg-cyan-300/8 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">O que entra no MVP</p>
              <div className="mt-4 space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {phases.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.8rem] border border-white/8 bg-white/[0.05] p-6 transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-500 text-lg font-semibold text-slate-950">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-sky-300" />
                        <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                      </div>
                      <p className="mt-3 text-base leading-7 text-slate-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1322] px-4 py-18 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Rotas de estudo</p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Cada banca pede um tipo diferente de jogo.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Não basta despejar questões. O ideal é sentir rápido onde você domina, onde perde tempo e onde está
              errando sem perceber.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tracks.map((track) => (
              <div key={track.label} className="rounded-[1.7rem] border border-white/8 bg-slate-950/60 p-5">
                <div className={`h-2 rounded-full bg-linear-to-r ${track.accent}`} />
                <p className="mt-5 text-2xl font-semibold text-white">{track.label}</p>
                <p className="mt-2 text-base leading-7 text-slate-300">{track.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-[#0b1322] to-[#050a13] px-4 py-18 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Para vender melhor</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">Visual forte, mensagem direta.</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              A landing agora empurra mais contraste, mais profundidade e mais sensação de avanço. Menos “site escolar”,
              mais “produto que faz você querer entrar e começar”.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {proof.map((item) => (
              <div key={item.label} className="rounded-[1.7rem] border border-white/8 bg-white/[0.04] p-6">
                <p className="text-4xl font-semibold text-white">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-7xl overflow-hidden rounded-[2.2rem] border border-white/10 bg-linear-to-r from-cyan-400 via-sky-400 to-blue-500 p-[1px] shadow-[0_24px_90px_rgba(2,8,23,0.45)]">
          <div className="rounded-[2.15rem] bg-[#07111f] px-6 py-8 sm:px-8 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Pronto para começar</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                Entre no Gabaritou e transforme seu treino em campanha diária.
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Crie sua conta, monte a primeira sessão e veja em minutos onde sua precisão já está forte e onde ainda
                vale atacar.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
