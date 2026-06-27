import { getInstrumentById } from "@/lib/pedagogy/seed-instruments";
import type {
  AttemptRecord,
  CriterionResult,
  FeedbackReport,
  Instrument,
  RubricLevel,
} from "@/lib/types";

export function rubricLevelFromPercentage(percentage: number): RubricLevel {
  if (percentage >= 85) return "destacado";
  if (percentage >= 70) return "logrado";
  if (percentage >= 50) return "en_proceso";
  return "en_inicio";
}

function levelLabel(level: RubricLevel) {
  switch (level) {
    case "destacado":
      return "Destacado";
    case "logrado":
      return "Logrado";
    case "en_proceso":
      return "En proceso";
    default:
      return "En inicio";
  }
}

function normalizeTextareaScore(value: string) {
  if (!value.trim()) return 0;
  return value.trim().length > 70 ? 2 : 1;
}

export function buildCriterionResults(
  instrument: Instrument,
  answers: Record<string, string>,
) {
  return instrument.criteria.map<CriterionResult>((criterion) => {
    const questions = instrument.questions.filter(
      (question) => question.criterionId === criterion.id,
    );

    const achieved = questions.reduce((total, question) => {
      const answer = answers[question.id] ?? "";
      if (question.type === "textarea") {
        return total + normalizeTextareaScore(answer);
      }

      const option = question.options?.find((item) => item.value === answer);
      return total + (option?.score ?? 0);
    }, 0);

    const max = questions.reduce((total, question) => total + question.maxScore, 0);
    const percentage = max === 0 ? 0 : Math.round((achieved / max) * 100);
    const level = rubricLevelFromPercentage(percentage);

    return {
      criterionId: criterion.id,
      title: criterion.title,
      achieved,
      max,
      percentage,
      level,
      strengths:
        percentage >= 70
          ? [
              `Muestras un nivel ${levelLabel(level).toLowerCase()} en ${criterion.title.toLowerCase()}.`,
            ]
          : [],
      improvements:
        percentage < 70
          ? [
              `Necesitas reforzar ${criterion.title.toLowerCase()} con más práctica guiada.`,
            ]
          : [],
    };
  });
}

export function buildFallbackFeedback(attempt: Omit<AttemptRecord, "feedback">): FeedbackReport {
  const instrument = getInstrumentById(attempt.instrumentId);
  const sorted = [...attempt.criteriaResults].sort((a, b) => a.percentage - b.percentage);
  const weakest = sorted[0];
  const strongest = [...attempt.criteriaResults].sort((a, b) => b.percentage - a.percentage)[0];
  const studyRecommendation =
    instrument?.studyRecommendations[weakest.criterionId] ??
    "Revisa nuevamente la sesión, identifica tus errores y realiza un nuevo intento.";

  return {
    summary:
      attempt.percentage >= 70
        ? `Tu desempeño global es ${levelLabel(attempt.level).toLowerCase()}. Has avanzado bien y puedes seguir profundizando.`
        : `Tu desempeño global está ${levelLabel(attempt.level).toLowerCase()}. Necesitas refuerzo guiado para consolidar el aprendizaje.`,
    strengths: strongest ? strongest.strengths : ["Participaste en el instrumento y generaste evidencia para mejorar."],
    improvements: weakest ? weakest.improvements : ["Necesitas revisar algunos criterios del instrumento."],
    explanation: weakest
      ? `La mayor dificultad aparece en ${weakest.title.toLowerCase()}, por eso conviene reforzar ese criterio antes del siguiente intento.`
      : "Tus respuestas muestran aspectos a reforzar en el siguiente intento.",
    studyRecommendation,
    nextStep: weakest
      ? `Vuelve a practicar enfocándote primero en ${weakest.title.toLowerCase()} y luego repite el formulario.`
      : "Repite la actividad aplicando la retroalimentación recibida.",
    provider: "reglas",
  };
}
