"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AttemptRecord, Instrument } from "@/lib/types";

type AttemptFormProps = {
  instrument: Instrument;
  sessionCode: string;
};

export function AttemptForm({ instrument, sessionCode }: AttemptFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [section, setSection] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/public/attempts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionCode,
        student: {
          fullName,
          section,
          consentAccepted,
        },
        answers,
      }),
    });

    const data = (await response.json()) as {
      attemptId?: string;
      message?: string;
      attempt?: AttemptRecord;
    };

    if (!response.ok || !data.attemptId) {
      setError(data.message ?? "No se pudo registrar tu respuesta.");
      setLoading(false);
      return;
    }

    if (data.attempt) {
      window.sessionStorage.setItem(
        `attempt:${data.attemptId}`,
        JSON.stringify(data.attempt),
      );
    }

    router.push(`/sesion/${sessionCode}/resultado/${data.attemptId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-cyan-100">
            Nombres y apellidos
          </label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
            placeholder="Escribe tu nombre completo"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-cyan-100">
            Sección o grupo
          </label>
          <input
            value={section}
            onChange={(event) => setSection(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
            placeholder="Opcional"
          />
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input
            type="checkbox"
            checked={consentAccepted}
            onChange={(event) => setConsentAccepted(event.target.checked)}
            className="size-4 rounded border-white/20 bg-slate-900"
          />
          Acepto el uso académico de mis respuestas para evaluación formativa.
        </label>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Lista de cotejo digital
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{instrument.sessionTitle}</h2>
        </div>

        {instrument.questions.map((question, index) => (
          <div key={question.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-cyan-100">Pregunta {index + 1}</p>
            <p className="mt-2 text-base font-medium text-white">{question.prompt}</p>
            {question.helperText ? (
              <p className="mt-2 text-sm text-slate-400">{question.helperText}</p>
            ) : null}

            {question.type === "single" ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {question.options?.map((option) => {
                  const active = answers[question.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateAnswer(question.id, option.value)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-cyan-300 bg-cyan-300 text-slate-950"
                          : "border-white/10 bg-slate-900 text-slate-200 hover:border-cyan-300/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={answers[question.id] ?? ""}
                onChange={(event) => updateAnswer(question.id, event.target.value)}
                rows={4}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
              />
            )}
          </div>
        ))}

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
        >
          {loading ? "Procesando retroalimentación..." : "Enviar respuestas y recibir retroalimentación"}
        </button>
      </section>
    </form>
  );
}
