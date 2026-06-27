import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SessionCodeForm } from "@/components/student/session-code-form";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              Acceso estudiante
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl text-white md:text-6xl">
              Ingresa con el código de tu sesión
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Escribe el código que te compartió tu docente para abrir el instrumento,
              responderlo y ver tu retroalimentación al finalizar.
            </p>
            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-slate-950/60 p-5 text-sm leading-7 text-slate-300">
              <p className="font-medium text-white">Antes de empezar</p>
              <p>
                Ten listo tu código de sesión. Si no lo tienes, solicítalo a tu docente.
              </p>
            </div>
          </div>

          <SessionCodeForm />
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Acceso docente</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                Si administras sesiones, instrumentos o respuestas, entra desde el panel
                docente.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              <LayoutDashboard className="size-4" />
              Ir al panel docente
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
