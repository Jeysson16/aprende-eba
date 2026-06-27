import { notFound } from "next/navigation";

import { FeedbackPreview } from "@/components/admin/feedback-preview";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth";
import { getAttemptById } from "@/lib/data-store";
import { getInstrumentById } from "@/lib/pedagogy/seed-instruments";

export default async function AttemptDetailPage(
  props: PageProps<"/admin/respuestas/[attemptId]">,
) {
  await requireAdmin();
  const { attemptId } = await props.params;
  const attempt = await getAttemptById(attemptId);
  const instrument = attempt ? getInstrumentById(attempt.instrumentId) : undefined;

  if (!attempt) {
    notFound();
  }

  const orderedAnswers = instrument
    ? instrument.questions.map((question) => {
        const rawValue = attempt.answers[question.id];
        const optionLabel =
          question.type === "single"
            ? question.options?.find((option) => option.value === rawValue)?.label ?? rawValue
            : rawValue;

        return {
          id: question.id,
          criterionTitle:
            instrument.criteria.find((criterion) => criterion.id === question.criterionId)?.title ??
            "Sin criterio",
          prompt: question.prompt,
          value: optionLabel?.trim() || "Sin respuesta",
        };
      })
    : Object.entries(attempt.answers).map(([id, value]) => ({
        id,
        criterionTitle: "Pregunta registrada",
        prompt: id,
        value: value || "Sin respuesta",
      }));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <FeedbackPreview attempt={attempt} />
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-cyan-200">Respuestas registradas</p>
          <div className="mt-4 space-y-4">
            {orderedAnswers.map((answer) => (
              <div
                key={answer.id}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
                  {answer.criterionTitle}
                </p>
                <p className="mt-2 text-sm font-medium text-white">{answer.prompt}</p>
                <p className="mt-2 text-sm text-slate-200">{answer.value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
