import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, School } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { instruments, sessions } from "@/lib/pedagogy/seed-instruments";

export default function Home() {
  const mainInstrument = instruments[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
              Solución recomendada según la rúbrica
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">
              Plataforma de evaluación formativa con chatbot de retroalimentación automatizada
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Diseñada para estudiantes de EBA y docentes administradores. Permite aplicar
              un instrumento digital, registrar respuestas, visualizar la lista de cotejo y
              generar retroalimentación personalizada con Gemini o con reglas locales.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/ingresar"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Ingresar como estudiante
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-slate-100 transition hover:border-cyan-300/50"
              >
                Ver panel de administradores
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-cyan-300/20 bg-slate-950/75 p-8">
            <p className="text-sm text-cyan-200">Instrumento activo</p>
            <h2 className="mt-3 text-3xl text-white">{mainInstrument.title}</h2>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p>
                <strong className="text-white">Sesión:</strong> {mainInstrument.sessionTitle}
              </p>
              <p>
                <strong className="text-white">Código de acceso:</strong> {sessions[0].code}
              </p>
              <p>
                <strong className="text-white">Competencia:</strong> {mainInstrument.competence}
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              {mainInstrument.criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {criterion.description}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <School className="size-5" />,
              title: "Panel docente",
              text: "Visualiza instrumentos, sesiones, lista de cotejo y respuestas de estudiantes.",
            },
            {
              icon: <Bot className="size-5" />,
              title: "IA con Gemini",
              text: "Redacta retroalimentación clara, breve y personalizada con fallback local.",
            },
            {
              icon: <CheckCircle2 className="size-5" />,
              title: "Alineada a la rúbrica",
              text: "Incluye fundamentación, diseño del instrumento, implementación técnica e impacto.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-4 inline-flex rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-cyan-200">
                {item.icon}
              </div>
              <h3 className="text-2xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
