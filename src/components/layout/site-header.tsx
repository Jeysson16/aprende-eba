import Link from "next/link";
import { BotMessageSquare, GraduationCap, LayoutDashboard } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-2">
            <BotMessageSquare className="size-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              Evaluación formativa
            </p>
            <p className="font-semibold">
              Instrumento digital con retroalimentación automatizada
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/ingresar"
            className="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
          >
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="size-4" />
              Estudiantes
            </span>
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-cyan-300 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-200"
          >
            <span className="inline-flex items-center gap-2">
              <LayoutDashboard className="size-4" />
              Administradores
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
