import Link from "next/link";
import { BookOpenText, History, LayoutDashboard, LogIn } from "lucide-react";

import { signOut } from "@/lib/actions/auth";
import { getOptionalUser } from "@/lib/auth";

import { Button } from "@/components/ui/button";

export async function Navbar() {
  const user = await getOptionalUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-slate-50">
          <div className="rounded-2xl bg-linear-to-br from-cyan-400 to-blue-500 p-2 text-slate-950 shadow-[0_12px_28px_rgba(34,211,238,0.26)]">
            <BookOpenText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Treino de Vestibular</p>
            <p className="text-lg font-semibold text-white">Gabaritou</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/questions/solve">
                <Button variant="ghost" size="sm">
                  <BookOpenText className="mr-2 h-4 w-4" />
                  Praticar
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  <History className="mr-2 h-4 w-4" />
                  Historico
                </Button>
              </Link>
              <form action={signOut}>
                <Button size="sm">Sair</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Criar conta</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
