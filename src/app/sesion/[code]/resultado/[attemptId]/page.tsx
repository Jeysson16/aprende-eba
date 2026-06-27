import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { FeedbackCard } from "@/components/student/feedback-card";
import { getAttemptById } from "@/lib/data-store";

export default async function ResultPage(
  props: PageProps<"/sesion/[code]/resultado/[attemptId]">,
) {
  const { attemptId } = await props.params;
  const attempt = await getAttemptById(attemptId);

  if (!attempt) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              Resultado del estudiante
            </p>
            <h1 className="mt-4 text-5xl text-white">{attempt.student.fullName}</h1>
            <p className="mt-3 text-base leading-8 text-slate-300">
              Esta respuesta se generó a partir de tu autoevaluación y del instrumento digital.
            </p>
          </div>
          <Link
            href={`/sesion/${attempt.sessionCode}`}
            className="rounded-full border border-white/10 px-5 py-3 text-slate-100 transition hover:border-cyan-300/50"
          >
            Intentar nuevamente
          </Link>
        </section>

        <FeedbackCard attempt={attempt} />
      </main>
    </div>
  );
}
