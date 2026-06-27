import type { AttemptRecord, Instrument } from "@/lib/types";

export function buildGeminiPrompt(instrument: Instrument, attempt: Omit<AttemptRecord, "feedback">) {
  const weakest = [...attempt.criteriaResults].sort((a, b) => a.percentage - b.percentage)[0];
  const strongest = [...attempt.criteriaResults].sort((a, b) => b.percentage - a.percentage)[0];

  return `
Actúa como un chatbot de retroalimentación académica para estudiantes adultos de EBA.

Debes responder en español claro, breve, respetuoso y formativo.
No inventes datos ni hagas diagnósticos psicológicos o clínicos.
No uses tono sancionador.
Entrega un JSON válido con estas claves exactas:
summary, strengths, improvements, explanation, studyRecommendation, nextStep

Contexto de la sesión:
- Instrumento: ${instrument.formalName}
- Sesión: ${instrument.sessionTitle}
- Competencia: ${instrument.competence}
- Propósito: ${instrument.purpose}

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

Respuestas abiertas del estudiante:
${Object.entries(attempt.answers)
  .filter(([, value]) => value && value.length > 0)
  .map(([id, value]) => `- ${id}: ${value}`)
  .join("\n")}

Instrucciones de estilo:
- "summary": 1 o 2 frases.
- "strengths": arreglo de 2 elementos máximos.
- "improvements": arreglo de 2 elementos máximos.
- "explanation": 1 frase clara sobre la principal dificultad.
- "studyRecommendation": 1 recomendación concreta de estudio.
- "nextStep": 1 acción inmediata para reintento.
`.trim();
}
