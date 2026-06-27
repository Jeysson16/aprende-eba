import type { AttemptRecord } from "@/lib/types";

type FeedbackPreviewProps = {
  attempt: AttemptRecord;
};

export function FeedbackPreview({ attempt }: FeedbackPreviewProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-cyan-200">Vista previa de retroalimentación</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{attempt.student.fullName}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300">{attempt.feedback.summary}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-emerald-200">Fortalezas</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {attempt.feedback.strengths.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-amber-200">Aspectos por mejorar</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {attempt.feedback.improvements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
