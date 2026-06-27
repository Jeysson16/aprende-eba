import { notFound } from "next/navigation";

import { InstrumentBuilder } from "@/components/admin/instrument-builder";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { getInstrumentDetails } from "@/lib/data-store";

export default async function InstrumentDetailPage(props: PageProps<"/admin/instrumentos/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const instrument = getInstrumentDetails(id);

  if (!instrument) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <InstrumentBuilder instrument={instrument} />
      </main>
    </div>
  );
}
