import { notFound } from "next/navigation";

import { InstrumentBuilder } from "@/components/admin/instrument-builder";
import { PrintInstrumentActions } from "@/components/admin/print-instrument-actions";
import { requireAdmin } from "@/lib/auth";
import { getInstrumentDetails, listAttempts } from "@/lib/data-store";

export default async function ExportInstrumentPage(
  props: PageProps<"/admin/instrumentos/[id]/exportar">,
) {
  await requireAdmin();
  const { id } = await props.params;
  const instrument = getInstrumentDetails(id);

  if (!instrument) {
    notFound();
  }

  const attempts = (await listAttempts()).filter((attempt) => attempt.instrumentId === instrument.id);

  return (
    <div className="min-h-screen bg-[#f5eee7] px-4 py-6 text-black print:bg-white print:p-0">
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 print:max-w-none print:gap-0">
        <PrintInstrumentActions backHref={`/admin/instrumentos/${instrument.id}`} />
        <InstrumentBuilder
          instrument={instrument}
          attempts={attempts.slice(0, 10)}
          minimumRows={8}
          variant="export"
        />
      </main>
    </div>
  );
}
