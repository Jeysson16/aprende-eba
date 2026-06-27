"use client";

import {
  BookOpenCheck,
  Bot,
  CircleAlert,
  SendHorizonal,
  MessageSquareMore,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { titleCaseLevel } from "@/lib/utils";
import type { AttemptRecord } from "@/lib/types";

type FeedbackCardProps = {
  attempt: AttemptRecord;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
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

function createInitialAssistantMessage(attempt: AttemptRecord): ChatMessage {
  return {
    id: `assistant-welcome-${attempt.id}`,
    role: "assistant",
    content: `Puedes contarme qué pasó en la sesión, decirme si no entendiste alguna parte de tu retroalimentación o preguntarme por una pregunta específica. Ya revisé tu resultado general y puedo orientarte mejor a partir de eso.`,
  };
}

export function FeedbackCard({ attempt }: FeedbackCardProps) {
  const questionFeedback = attempt.feedback.questionFeedback ?? [];
  const messageIdRef = useRef(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    createInitialAssistantMessage(attempt),
  ]);
  const [draft, setDraft] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [chatError, setChatError] = useState("");

  function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
    const id = `${role}-${messageIdRef.current}`;
    messageIdRef.current += 1;
    return { id, role, content };
  }

  const suggestedPrompts = [
    "Te cuento lo que pasó en la sesión.",
    "No entendí bien esta retroalimentación, explícamela.",
    questionFeedback.length > 0
      ? `Explícame la pregunta 1 y cómo puedo mejorarla.`
      : "¿Qué debo mejorar primero para el siguiente intento?",
  ];

  async function sendMessage(content: string) {
    const message = content.trim();
    if (!message || loadingReply) {
      return;
    }

    const userMessage = createMessage("user", message);
    const nextHistory = [...chatMessages, userMessage].map((item) => ({
      role: item.role,
      content: item.content,
    }));

    setDraft("");
    setChatError("");
    setChatMessages((current) => [...current, userMessage]);
    setLoadingReply(true);

    try {
      const response = await fetch(`/api/public/feedback/${attempt.id}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: nextHistory,
        }),
      });

      const data = (await response.json()) as { reply?: string; message?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.message ?? "No se pudo generar la respuesta del tutor virtual.");
      }

      const assistantReply = data.reply;
      setChatMessages((current) => [
        ...current,
        createMessage("assistant", assistantReply),
      ]);
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "Hubo un problema al responder tu mensaje. Inténtalo nuevamente.";

      setChatError(fallbackMessage);
      setChatMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "No pude procesar bien tu mensaje en este momento. Vuelve a intentarlo o reformula lo que pasó en la sesión para ayudarte mejor.",
        ),
      ]);
    } finally {
      setLoadingReply(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

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

        <article className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-cyan-200">
            <MessageSquareMore className="size-4" />
            Conversa con el tutor virtual
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Escribe qué pasó en la sesión, qué parte no entendiste o qué pregunta quieres
            revisar.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={loadingReply}
                className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-300/40 disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
            {chatMessages.map((message) => (
              <Bubble
                key={message.id}
                icon={
                  message.role === "assistant" ? (
                    <Bot className="size-5" />
                  ) : (
                    <User className="size-5" />
                  )
                }
                title={message.role === "assistant" ? "Tutor virtual" : "Tú"}
                align={message.role === "assistant" ? "left" : "right"}
              >
                <p>{message.content}</p>
              </Bubble>
            ))}

            {loadingReply ? (
              <Bubble icon={<Bot className="size-5" />} title="Tutor virtual">
                <p>Estoy leyendo lo que me contaste para responderte con base en tu sesión...</p>
              </Bubble>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              placeholder="Ejemplo: En la sesión me puse nervioso al argumentar y no entendí por qué me faltó sustento."
              className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
            />
            {chatError ? <p className="text-sm text-amber-300">{chatError}</p> : null}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loadingReply || !draft.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
              >
                <SendHorizonal className="size-4" />
                Enviar al tutor
              </button>
            </div>
          </form>
        </article>
      </div>

      <div className="space-y-4">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-cyan-200">Resumen del chat</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mensajes</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {questionFeedback.length + 7 + chatMessages.length}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Comentarios del estudiante
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {chatMessages.filter((message) => message.role === "user").length}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Preguntas con feedback
              </p>
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
