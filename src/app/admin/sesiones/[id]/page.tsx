import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { listSessions } from "@/lib/data-store";

export default async function SessionDetailPage(props: PageProps<"/admin/sesiones/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const session = listSessions().find((item) => item.id === id);

  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Sesión activa
          </p>
          <h1 className="mt-4 text-5xl text-white">{session.label}</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Código de acceso: {session.code}. Instrumento vinculado: {session.instrument?.title}.
          </p>
        </section>
      </main>
    </div>
  );
}
