import Link from "next/link";

import { AttemptsTable } from "@/components/admin/attempts-table";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { SessionPublisher } from "@/components/admin/session-publisher";
import { CriteriaPerformanceChart } from "@/components/admin/charts/criteria-performance-chart";
import { InstrumentBuilder } from "@/components/admin/instrument-builder";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin, signOutAdmin } from "@/lib/auth";
import { getDashboardStats, listAttempts, listInstruments, listSessions } from "@/lib/data-store";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [stats, attempts] = await Promise.all([getDashboardStats(), listAttempts()]);
  const sessions = listSessions();
  const firstInstrument = listInstruments()[0];
  const instrumentAttempts = attempts
    .filter((attempt) => attempt.instrumentId === firstInstrument.id)
    .slice(0, 10);

  const criteriaChart = firstInstrument.criteria.map((criterion) => {
    const source = attempts.flatMap((attempt) => attempt.criteriaResults);
    const matches = source.filter((item) => item.criterionId === criterion.id);
    const percentage = matches.length
      ? Math.round(matches.reduce((sum, item) => sum + item.percentage, 0) / matches.length)
      : 0;

    return { title: criterion.title, percentage };
  });

  async function logoutAction() {
    "use server";
    await signOutAdmin();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              Vista de administradores
            </p>
            <h1 className="mt-4 text-5xl text-white">Monitoreo del instrumento</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/instrumentos" className="rounded-full border border-white/10 px-4 py-2 text-slate-100">
              Ver instrumento
            </Link>
            <Link href="/admin/respuestas" className="rounded-full border border-white/10 px-4 py-2 text-slate-100">
              Respuestas
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="rounded-full bg-cyan-300 px-4 py-2 font-medium text-slate-950">
                Cerrar sesión
              </button>
            </form>
          </div>
        </section>

        <DashboardStats stats={stats} />

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <CriteriaPerformanceChart items={criteriaChart} />
          <SessionPublisher sessions={sessions} />
        </section>

        <InstrumentBuilder
          instrument={firstInstrument}
          attempts={instrumentAttempts}
          showTemplateRows={false}
        />

        <AttemptsTable attempts={attempts} />
      </main>
    </div>
  );
}
