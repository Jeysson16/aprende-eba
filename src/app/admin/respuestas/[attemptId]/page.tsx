import { notFound } from "next/navigation";

import { FeedbackPreview } from "@/components/admin/feedback-preview";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { getAttemptById } from "@/lib/data-store";

export default async function AttemptDetailPage(
  props: PageProps<"/admin/respuestas/[attemptId]">,
) {
  await requireAdmin();
  const { attemptId } = await props.params;
  const attempt = await getAttemptById(attemptId);

  if (!attempt) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <FeedbackPreview attempt={attempt} />
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-cyan-200">Respuestas registradas</p>
          <div className="mt-4 space-y-4">
            {Object.entries(attempt.answers).map(([id, value]) => (
              <div key={id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">{id}</p>
                <p className="mt-2 text-sm text-slate-200">{value || "Sin respuesta"}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
