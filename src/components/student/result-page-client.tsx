"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FeedbackCard } from "@/components/student/feedback-card";
import type { AttemptRecord } from "@/lib/types";

type ResultPageClientProps = {
  attemptId: string;
  sessionCode: string;
};

export function ResultPageClient({
  attemptId,
  sessionCode,
}: ResultPageClientProps) {
  const [attempt, setAttempt] = useState<AttemptRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    async function loadAttempt() {
      const cached = window.sessionStorage.getItem(`attempt:${attemptId}`);
      if (cached) {
        setAttempt(JSON.parse(cached) as AttemptRecord);
        setStatus("ready");
        return;
      }

      try {
        const response = await fetch(`/api/public/feedback/${attemptId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          setStatus("missing");
          return;
        }

        const data = (await response.json()) as AttemptRecord;
        window.sessionStorage.setItem(`attempt:${attemptId}`, JSON.stringify(data));
        setAttempt(data);
        setStatus("ready");
      } catch {
        setStatus("missing");
      }
    }

    void loadAttempt();
  }, [attemptId]);

  if (status === "loading") {
    return (
      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-cyan-200">Procesando resultado</p>
        <h1 className="mt-4 text-4xl text-white">
          Cargando tu retroalimentación...
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Si Gemini demora, el sistema mostrará automáticamente la versión local de
          respaldo.
        </p>
      </section>
    );
  }

  if (status === "missing" || !attempt) {
    return (
      <section className="rounded-[2.5rem] border border-amber-300/20 bg-white/5 p-8">
        <p className="text-sm text-amber-200">Resultado no disponible</p>
        <h1 className="mt-4 text-4xl text-white">
          No se pudo recuperar esta retroalimentación
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Esto suele ocurrir cuando el intento no quedó persistido todavía. Puedes
          regresar al instrumento y reenviar tus respuestas.
        </p>
        <Link
          href={`/sesion/${sessionCode}`}
          className="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
        >
          Volver al instrumento
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Resultado del estudiante
          </p>
          <h1 className="mt-4 text-5xl text-white">{attempt.student.fullName}</h1>
          <p className="mt-3 text-base leading-8 text-slate-300">
            Esta retroalimentación se presenta como un chat guiado y toma en cuenta tu
            autoevaluación, tus respuestas y observaciones adicionales por pregunta.
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
    </>
  );
}
