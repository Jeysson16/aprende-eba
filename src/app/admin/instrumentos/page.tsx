import Link from "next/link";

import { InstrumentBuilder } from "@/components/admin/instrument-builder";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { listAttempts, listInstruments } from "@/lib/data-store";

export default async function InstrumentosPage() {
  await requireAdmin();
  const instrument = listInstruments()[0];
  const attempts = (await listAttempts()).filter((attempt) => attempt.instrumentId === instrument.id);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex items-center justify-between gap-4 rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              Diseño del instrumento
            </p>
            <h1 className="mt-4 text-5xl text-white">Lista de cotejos administrable</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/instrumentos/${instrument.id}/exportar`}
              className="rounded-full border border-cyan-300/40 px-4 py-2 font-medium text-cyan-100"
            >
              Exportar formato
            </Link>
            <Link
              href="/admin/instrumentos/nuevo"
              className="rounded-full bg-cyan-300 px-4 py-2 font-medium text-slate-950"
            >
              Nuevo instrumento
            </Link>
          </div>
        </section>

        <InstrumentBuilder instrument={instrument} attempts={attempts.slice(0, 10)} showTemplateRows={false} />
      </main>
    </div>
  );
}
