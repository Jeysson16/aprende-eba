import type { AttemptRecord, Instrument, QuestionFeedback } from "@/lib/types";
import { getInstrumentById } from "@/lib/pedagogy/seed-instruments";

const GEMINI_TIMEOUT_MS = 9000;
const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.5-flash",
] as const;

type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

function sanitizeJsonBlock(text: string) {
  const cleaned = text.trim().replace(/^```json/, "").replace(/```$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  return firstBrace >= 0 && lastBrace >= 0
    ? cleaned.slice(firstBrace, lastBrace + 1)
    : cleaned;
}

function getWeakestCriterion(attempt: AttemptRecord) {
  return [...attempt.criteriaResults].sort((a, b) => a.percentage - b.percentage)[0];
}

function getStrongestCriterion(attempt: AttemptRecord) {
  return [...attempt.criteriaResults].sort((a, b) => b.percentage - a.percentage)[0];
}

function getQuestionFeedbackFromMessage(
  questionFeedback: QuestionFeedback[],
  message: string,
) {
  const match = message.match(/\b(\d{1,2})\b/);
  if (match) {
    const index = Number(match[1]) - 1;
    if (index >= 0 && index < questionFeedback.length) {
      return questionFeedback[index];
    }
  }

  const lowered = message.toLowerCase();
  return questionFeedback.find(
    (item) =>
      lowered.includes(item.criterionTitle.toLowerCase()) ||
      lowered.includes(item.questionPrompt.toLowerCase()),
  );
}

function buildLocalChatReply(
  attempt: AttemptRecord,
  instrument: Instrument,
  message: string,
) {
  const lowered = message.toLowerCase();
  const weakest = getWeakestCriterion(attempt);
  const strongest = getStrongestCriterion(attempt);
  const questionFeedback = attempt.feedback.questionFeedback ?? [];
  const matchedQuestion = getQuestionFeedbackFromMessage(questionFeedback, lowered);

  if (matchedQuestion) {
    return `Sobre "${matchedQuestion.questionPrompt}", tu respuesta fue "${matchedQuestion.answerText}". ${matchedQuestion.feedback} Si quieres, también puedo ayudarte a reformular esa respuesta para un siguiente intento.`;
  }

  if (
    lowered.includes("sesion") ||
    lowered.includes("qué pasó") ||
    lowered.includes("que paso") ||
    lowered.includes("pasó")
  ) {
    return `En esta sesión trabajaste "${instrument.sessionTitle}" con el propósito de ${instrument.purpose.toLowerCase()} Tu mejor avance estuvo en ${strongest?.title.toLowerCase() ?? "uno de los criterios evaluados"} y tu principal punto a reforzar está en ${weakest?.title.toLowerCase() ?? "los criterios con menor puntaje"}.`;
  }

  if (
    lowered.includes("no entend") ||
    lowered.includes("explica") ||
    lowered.includes("retroaliment") ||
    lowered.includes("feedback")
  ) {
    return `${attempt.feedback.explanation} Para que avances mejor, te sugiero esto: ${attempt.feedback.studyRecommendation} Tu siguiente paso concreto es: ${attempt.feedback.nextStep}`;
  }

  if (
    lowered.includes("mal") ||
    lowered.includes("dificil") ||
    lowered.includes("difícil") ||
    lowered.includes("costó") ||
    lowered.includes("costo")
  ) {
    return `Es normal que algunas partes te hayan costado. En tu caso conviene reforzar ${weakest?.title.toLowerCase() ?? "el criterio con menor avance"} porque allí está la mayor oportunidad de mejora. Puedes empezar con esta acción: ${attempt.feedback.nextStep}`;
  }

  if (
    lowered.includes("mejorar") ||
    lowered.includes("siguiente") ||
    lowered.includes("practicar") ||
    lowered.includes("estudiar")
  ) {
    return `Para mejorar en el siguiente intento, enfócate primero en ${weakest?.title.toLowerCase() ?? "tu criterio más bajo"}. ${attempt.feedback.studyRecommendation} Si quieres, también te puedo dar una guía más corta por pregunta.`;
  }

  return `Gracias por contarme eso. Según tu resultado, vas mejor en ${strongest?.title.toLowerCase() ?? "algunos criterios"} y todavía necesitas fortalecer ${weakest?.title.toLowerCase() ?? "otros aspectos del instrumento"}. ${attempt.feedback.summary} Si deseas, dime qué parte de la sesión te confundió o mencióname una pregunta específica.`;
}

function buildChatPrompt(
  attempt: AttemptRecord,
  instrument: Instrument,
  history: ChatHistoryMessage[],
  message: string,
) {
  const weakest = getWeakestCriterion(attempt);
  const strongest = getStrongestCriterion(attempt);
  const questionFeedback = (attempt.feedback.questionFeedback ?? [])
    .map(
      (item, index) =>
        `- Pregunta ${index + 1}: ${item.questionPrompt}\n  Respuesta del estudiante: ${item.answerText}\n  Comentario previo: ${item.feedback}`,
    )
    .join("\n");
  const serializedHistory = history
    .slice(-6)
    .map((item) => `${item.role === "user" ? "Estudiante" : "Tutor"}: ${item.content}`)
    .join("\n");

  return `
Actúa como un tutor virtual conversacional para estudiantes adultos de EBA.
Responde en español claro, cálido, breve y útil.
No inventes información que no aparezca en el contexto.
No uses markdown ni listas extensas.
Responde con JSON válido usando solo esta clave: reply

Contexto del instrumento:
- Sesión: ${instrument.sessionTitle}
- Propósito: ${instrument.purpose}
- Competencia: ${instrument.competence}
- Puntaje: ${attempt.totalScore}/${attempt.maxScore}
- Porcentaje: ${attempt.percentage}%
- Mejor criterio: ${strongest?.title ?? "No identificado"}
- Criterio por reforzar: ${weakest?.title ?? "No identificado"}

Retroalimentación general:
- Resumen: ${attempt.feedback.summary}
- Explicación: ${attempt.feedback.explanation}
- Recomendación: ${attempt.feedback.studyRecommendation}
- Siguiente paso: ${attempt.feedback.nextStep}

Retroalimentación por pregunta:
${questionFeedback || "- No hay comentarios por pregunta."}

Historial reciente:
${serializedHistory || "- Sin historial adicional."}

Mensaje actual del estudiante:
${message}

Instrucciones:
- Reconoce brevemente lo que el estudiante comentó.
- Responde usando el contexto de la sesión y su retroalimentación real.
- Si pregunta por una pregunta específica, explica esa pregunta y su mejora.
- Si comenta lo que pasó en la sesión, ayúdale a interpretar su desempeño.
- Ofrece 1 o 2 acciones concretas, no genéricas.
- Mantén la respuesta entre 3 y 6 frases.
`.trim();
}

export async function generateFeedbackChatReply(input: {
  attempt: AttemptRecord;
  history: ChatHistoryMessage[];
  message: string;
}) {
  const instrument = getInstrumentById(input.attempt.instrumentId);
  if (!instrument) {
    return {
      reply:
        "Puedo comentarte tu retroalimentación general, pero ahora mismo no encontré el instrumento asociado a este intento.",
      provider: "reglas" as const,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reply: buildLocalChatReply(input.attempt, instrument, input.message),
      provider: "reglas" as const,
    };
  }

  for (const model of GEMINI_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: buildChatPrompt(
                      input.attempt,
                      instrument,
                      input.history,
                      input.message,
                    ),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.45,
              maxOutputTokens: 500,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
          finishReason?: string;
        }>;
      };

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();

      if (!text || data.candidates?.[0]?.finishReason === "MAX_TOKENS") {
        continue;
      }

      const parsed = JSON.parse(sanitizeJsonBlock(text)) as { reply?: string };
      if (parsed.reply?.trim()) {
        return {
          reply: parsed.reply.trim(),
          provider: "gemini" as const,
        };
      }
    } catch {
      continue;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    reply: buildLocalChatReply(input.attempt, instrument, input.message),
    provider: "reglas" as const,
  };
}
