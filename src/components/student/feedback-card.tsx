import { BookOpenCheck, CircleAlert, Sparkles, TrendingUp } from "lucide-react";

import { titleCaseLevel } from "@/lib/utils";
import type { AttemptRecord } from "@/lib/types";

type FeedbackCardProps = {
  attempt: AttemptRecord;
};

export function FeedbackCard({ attempt }: FeedbackCardProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/90 p-6 text-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-semibold text-slate-950">
            {titleCaseLevel(attempt.level)}
          </span>
          <span className="text-sm text-slate-400">
            Puntaje {attempt.totalScore}/{attempt.maxScore} · {attempt.percentage}%
          </span>
          <span className="text-sm text-slate-500">
            Motor: {attempt.feedback.provider === "gemini" ? "Gemini" : "Reglas locales"}
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-semibold text-white">
          Retroalimentación automatizada
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-300">
          {attempt.feedback.summary}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-300/5 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-200">
              <Sparkles className="size-4" />
              Lo que respondiste bien
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {attempt.feedback.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.5rem] border border-amber-300/15 bg-amber-300/5 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-amber-200">
              <CircleAlert className="size-4" />
              Lo que debes mejorar
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {attempt.feedback.improvements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-cyan-200">
            <TrendingUp className="size-4" />
            Explicación breve
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {attempt.feedback.explanation}
          </p>
        </article>
      </div>

      <div className="space-y-4">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-cyan-200">
            <BookOpenCheck className="size-4" />
            Recomendación de estudio
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {attempt.feedback.studyRecommendation}
          </p>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-cyan-200">Próximo paso</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {attempt.feedback.nextStep}
          </p>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-cyan-200">Resultados por criterio</p>
          <div className="mt-4 space-y-3">
            {attempt.criteriaResults.map((criterion) => (
              <div key={criterion.criterionId}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>{criterion.title}</span>
                  <span>{criterion.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-cyan-300"
                    style={{ width: `${criterion.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
