import Link from "next/link";
import { notFound } from "next/navigation";

import { InstrumentBuilder } from "@/components/admin/instrument-builder";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { getInstrumentDetails, listAttempts } from "@/lib/data-store";

export default async function InstrumentDetailPage(props: PageProps<"/admin/instrumentos/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const instrument = getInstrumentDetails(id);

  if (!instrument) {
    notFound();
  }

  const attempts = (await listAttempts()).filter((attempt) => attempt.instrumentId === instrument.id);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Instrumento</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{instrument.title}</h1>
          </div>
          <Link
            href={`/admin/instrumentos/${instrument.id}/exportar`}
            className="rounded-full bg-cyan-300 px-4 py-2 font-medium text-slate-950"
          >
            Abrir formato para exportar
          </Link>
        </section>

        <InstrumentBuilder instrument={instrument} attempts={attempts.slice(0, 10)} showTemplateRows={false} />
      </main>
    </div>
  );
}
