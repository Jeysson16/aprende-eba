import {
  BookOpenCheck,
  Bot,
  CircleAlert,
  MessageSquareMore,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

import { titleCaseLevel } from "@/lib/utils";
import type { AttemptRecord } from "@/lib/types";

type FeedbackCardProps = {
  attempt: AttemptRecord;
};

type BubbleProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  align?: "left" | "right";
};

function Bubble({ icon, title, children, align = "left" }: BubbleProps) {
  const isRight = align === "right";

  return (
    <article className={`flex gap-3 ${isRight ? "justify-end" : "justify-start"}`}>
      {!isRight ? (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-200">
          {icon}
        </div>
      ) : null}

      <div
        className={`max-w-[85%] rounded-[1.5rem] border px-4 py-4 shadow-sm ${
          isRight
            ? "border-cyan-300/40 bg-cyan-300 text-slate-950"
            : "border-white/10 bg-white/5 text-slate-100"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${
            isRight ? "text-slate-900/70" : "text-cyan-200/80"
          }`}
        >
          {title}
        </p>
        <div
          className={`mt-3 text-sm leading-7 ${
            isRight ? "text-slate-950" : "text-slate-200"
          }`}
        >
          {children}
        </div>
      </div>

      {isRight ? (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-slate-950">
          {icon}
        </div>
      ) : null}
    </article>
  );
}

export function FeedbackCard({ attempt }: FeedbackCardProps) {
  const questionFeedback = attempt.feedback.questionFeedback ?? [];

  return (
    <section className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
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
          Chat de retroalimentación
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-300">
          Recibes una devolución conversacional con observaciones generales y comentarios
          adicionales por cada pregunta respondida.
        </p>

        <div className="mt-6 space-y-4">
          <Bubble icon={<Bot className="size-5" />} title="Tutor virtual">
            <p>{attempt.feedback.summary}</p>
          </Bubble>

          <Bubble icon={<User className="size-5" />} title="Tu resultado" align="right">
            <p>
              Obtuve {attempt.totalScore} de {attempt.maxScore} puntos, con un avance del{" "}
              {attempt.percentage}% en este instrumento.
            </p>
          </Bubble>

          <Bubble icon={<Sparkles className="size-5" />} title="Lo que hiciste bien">
            <ul className="space-y-2">
              {attempt.feedback.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Bubble>

          <Bubble icon={<CircleAlert className="size-5" />} title="Lo que debes mejorar">
            <ul className="space-y-2">
              {attempt.feedback.improvements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Bubble>

          <Bubble icon={<TrendingUp className="size-5" />} title="Por qué importa">
            <p>{attempt.feedback.explanation}</p>
          </Bubble>

          <Bubble icon={<BookOpenCheck className="size-5" />} title="Sugerencia de estudio">
            <p>{attempt.feedback.studyRecommendation}</p>
          </Bubble>

          <Bubble icon={<MessageSquareMore className="size-5" />} title="Siguiente paso">
            <p>{attempt.feedback.nextStep}</p>
          </Bubble>
        </div>
      </div>

      <div className="space-y-4">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-cyan-200">Resumen del chat</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mensajes</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {questionFeedback.length + 7}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preguntas con feedback</p>
              <p className="mt-2 text-2xl font-semibold text-white">{questionFeedback.length}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            El tutor virtual toma tus respuestas reales para darte una devolución más clara y
            accionable.
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

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-cyan-200">
            <MessageSquareMore className="size-4" />
            Retroalimentación por pregunta
          </p>
          <div className="mt-4 space-y-4">
            {questionFeedback.length > 0 ? (
              questionFeedback.map((item, index) => (
                <div
                  key={item.questionId}
                  className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Pregunta {index + 1} · {item.criterionTitle}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">{item.questionPrompt}</p>

                  <div className="mt-4 flex justify-end gap-3">
                    <div className="max-w-[88%] rounded-[1.25rem] bg-cyan-300 px-4 py-3 text-sm text-slate-950">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900/70">
                        Tu respuesta
                      </p>
                      <p className="mt-2 leading-7">{item.answerText}</p>
                    </div>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-slate-950">
                      <User className="size-4" />
                    </div>
                  </div>

                  <div className="mt-3 flex gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-200">
                      <Bot className="size-4" />
                    </div>
                    <div className="max-w-[88%] rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                        Tutor virtual
                      </p>
                      <p className="mt-2 leading-7">{item.feedback}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        Puntaje de esta pregunta: {item.score}/{item.maxScore}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-slate-300">
                Aun no hay comentarios detallados por pregunta para este intento.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
