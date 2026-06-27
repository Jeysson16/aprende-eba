import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";

export default async function ReportesPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Reportes
          </p>
          <h1 className="mt-4 text-5xl text-white">Impacto y resultados del aprendizaje</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Esta vista está orientada a la interpretación docente del progreso, la
            detección de criterios críticos y el seguimiento de la retroalimentación
            automatizada entregada a los estudiantes.
          </p>
        </section>
      </main>
    </div>
  );
}
