import { InstrumentBuilder } from "@/components/admin/instrument-builder";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { listInstruments } from "@/lib/data-store";

export default async function NuevoInstrumentoPage() {
  await requireAdmin();
  const instrument = listInstruments()[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Vista de creación
          </p>
          <h1 className="mt-4 text-5xl text-white">Nuevo instrumento</h1>
        </section>

        <InstrumentBuilder instrument={instrument} />
      </main>
    </div>
  );
}
