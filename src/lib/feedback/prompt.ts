import type { AttemptRecord, Instrument } from "@/lib/types";

export function buildGeminiPrompt(instrument: Instrument, attempt: Omit<AttemptRecord, "feedback">) {
  const weakest = [...attempt.criteriaResults].sort((a, b) => a.percentage - b.percentage)[0];
  const strongest = [...attempt.criteriaResults].sort((a, b) => b.percentage - a.percentage)[0];
  const questionMap = new Map(instrument.questions.map((question) => [question.id, question]));
  const answeredQuestions = Object.entries(attempt.answers)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([id, value]) => {
      const question = questionMap.get(id);

      if (!question) {
        return `- ${id}: ${value}`;
      }

      if (question.type === "single") {
        const option = question.options?.find((item) => item.value === value);
        return `- ${question.id} | criterio: ${question.criterionId} | pregunta: ${question.prompt} | respuesta: ${option?.label ?? value}`;
      }

      return `- ${question.id} | criterio: ${question.criterionId} | pregunta: ${question.prompt} | respuesta: ${value}`;
    });

  return `
Actúa como un docente tutor que brinda retroalimentación académica a estudiantes adultos de EBA.

Debes responder en español claro, cálido, preciso y formativo.
No inventes datos ni hagas diagnósticos psicológicos o clínicos.
No uses tono sancionador.
No uses markdown, viñetas con asteriscos, ni bloques de código.
Entrega un JSON válido con estas claves exactas:
summary, strengths, improvements, explanation, studyRecommendation, nextStep, questionFeedback
No escribas texto antes ni después del JSON.

Contexto de la sesión:
- Instrumento: ${instrument.formalName}
- Sesión: ${instrument.sessionTitle}
- Competencia: ${instrument.competence}
- Propósito: ${instrument.purpose}
- Desempeño esperado: ${instrument.performance}

Criterios de evaluación:
${instrument.criteria
  .map((criterion) => `- ${criterion.title}: ${criterion.description}`)
  .join("\n")}

Resultado del estudiante:
- Puntaje total: ${attempt.totalScore}/${attempt.maxScore}
- Porcentaje: ${attempt.percentage}
- Nivel: ${attempt.level}
- Mejor criterio: ${strongest?.title ?? "No identificado"}
- Criterio más débil: ${weakest?.title ?? "No identificado"}

Resultados por criterio:
${attempt.criteriaResults
  .map(
    (criterion) =>
      `- ${criterion.title}: ${criterion.achieved}/${criterion.max} (${criterion.percentage}%)`,
  )
  .join("\n")}

Respuestas del estudiante:
${answeredQuestions.join("\n") || "- Sin respuestas registradas."}

Instrucciones de estilo:
- Basa cada mensaje en los criterios y respuestas del estudiante, no en frases genéricas.
- "summary": 2 frases máximas, indicando logro general y prioridad inmediata.
- "strengths": arreglo de 2 elementos máximos, cada uno con un avance concreto.
- "improvements": arreglo de 2 elementos máximos, cada uno con una mejora concreta y accionable.
- "explanation": 1 o 2 frases sobre la principal dificultad y por qué importa.
- "studyRecommendation": 1 recomendación concreta de estudio, relacionada con el criterio más débil.
- "nextStep": 1 acción inmediata para el siguiente intento.
- "questionFeedback": arreglo con una entrada por cada pregunta respondida.
- Cada objeto de "questionFeedback" debe tener exactamente estas claves:
  questionId, questionPrompt, criterionTitle, answerText, feedback
- En "questionFeedback", comenta la respuesta real del estudiante y da una sugerencia breve, concreta y formativa para esa pregunta.
- Evita repetir literalmente los nombres de las claves o del instrumento.
`.trim();
}
