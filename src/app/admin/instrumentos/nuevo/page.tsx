import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";

export default async function NuevoInstrumentoPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Vista de creación
          </p>
          <h1 className="mt-4 text-5xl text-white">Plantilla para nuevos instrumentos</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Esta primera versión deja visible la estructura que seguirá un CRUD real:
            datos informativos, propósito, competencia, criterios, preguntas y reglas de
            retroalimentación. El instrumento semilla ya se carga desde el repositorio.
          </p>
        </section>
      </main>
    </div>
  );
}
