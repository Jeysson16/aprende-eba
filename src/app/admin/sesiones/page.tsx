import { SiteHeader } from "@/components/layout/site-header";
import { SessionPublisher } from "@/components/admin/session-publisher";
import { requireAdmin } from "@/lib/auth";
import { listSessions } from "@/lib/data-store";

export default async function SesionesPage() {
  await requireAdmin();
  const sessions = listSessions();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Publicación
          </p>
          <h1 className="mt-4 text-5xl text-white">Sesiones activas y códigos de acceso</h1>
        </section>
        <SessionPublisher sessions={sessions} />
      </main>
    </div>
  );
}
