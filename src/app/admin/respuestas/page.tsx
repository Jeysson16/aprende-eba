import { AttemptsTable } from "@/components/admin/attempts-table";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { listAttempts } from "@/lib/data-store";

export default async function RespuestasPage() {
  await requireAdmin();
  const attempts = await listAttempts();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Evidencias
          </p>
          <h1 className="mt-4 text-5xl text-white">Respuestas de los estudiantes</h1>
        </section>
        <AttemptsTable attempts={attempts} />
      </main>
    </div>
  );
}
