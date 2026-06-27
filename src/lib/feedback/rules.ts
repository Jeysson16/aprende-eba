import { getInstrumentById } from "@/lib/pedagogy/seed-instruments";
import type {
  AttemptRecord,
  CriterionResult,
  FeedbackReport,
  Instrument,
  QuestionFeedback,
  Question,
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

function excerpt(value: string, maxLength = 110) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength - 1).trimEnd()}...`;
}

function performanceVerb(percentage: number) {
  if (percentage >= 85) return "demuestras un dominio consistente";
  if (percentage >= 70) return "muestras un avance adecuado";
  if (percentage >= 50) return "todavía necesitas consolidar";
  return "requiere una atención prioritaria";
}

function getCriterionTitle(instrument: Instrument | undefined, criterionId: string) {
  return (
    instrument?.criteria.find((criterion) => criterion.id === criterionId)?.title ??
    "este criterio"
  );
}

function getQuestionScore(question: Question, answer: string) {
  if (question.type === "textarea") {
    return normalizeTextareaScore(answer);
  }

  const option = question.options?.find((item) => item.value === answer);
  return option?.score ?? 0;
}

function getAnswerText(question: Question, answer: string) {
  if (!answer.trim()) {
    return "Sin respuesta";
  }

  if (question.type === "single") {
    const option = question.options?.find((item) => item.value === answer);
    return option?.label ?? answer;
  }

  return excerpt(answer, 180);
}

function buildSingleQuestionFeedback(
  question: Question,
  criterionTitle: string,
  answerText: string,
  score: number,
) {
  const normalizedAnswer = answerText.toLowerCase();
  const criterion = criterionTitle.toLowerCase();

  if (score >= question.maxScore) {
    return `Marcaste "${normalizedAnswer}" en esta pregunta y eso evidencia un buen dominio en ${criterion}. Mantén ese nivel explicando con seguridad por qué lograste este desempeño.`;
  }

  if (score > 0) {
    return `Marcaste "${normalizedAnswer}", lo que muestra un avance parcial en ${criterion}. Para mejorar, revisa qué parte del criterio aún no cumples por completo y busca un ejemplo concreto antes del siguiente intento.`;
  }

  return `Marcaste "${normalizedAnswer}" y eso indica que ${criterion} todavía necesita refuerzo. Antes del siguiente intento, revisa un modelo breve y practica cómo aplicar este criterio en una situación similar.`;
}

function buildTextareaQuestionFeedback(
  criterionTitle: string,
  answer: string,
  score: number,
) {
  const criterion = criterionTitle.toLowerCase();

  if (!answer.trim()) {
    return `No agregaste una respuesta desarrollada en esta pregunta. Es importante escribir una idea breve y concreta para mostrar mejor tu avance en ${criterion}.`;
  }

  if (score >= 2) {
    return `Tu respuesta escrita aporta una evidencia clara de reflexión sobre ${criterion}. Sigue desarrollando ejemplos o explicaciones concretas, porque eso fortalece mucho más tu autoevaluación.`;
  }

  return `Tu respuesta escrita muestra una idea inicial sobre ${criterion}, pero todavía puede ser más precisa. En el siguiente intento, agrega un ejemplo, una dificultad específica o una acción de mejora para sustentar mejor tu respuesta.`;
}

function getRelatedQuestions(instrument: Instrument | undefined, criterionId: string) {
  return instrument?.questions.filter((question) => question.criterionId === criterionId) ?? [];
}

function getEvidenceText(
  attempt: Omit<AttemptRecord, "feedback">,
  relatedQuestions: Question[],
) {
  const openQuestion = relatedQuestions.find((question) => question.type === "textarea");
  const openAnswer = openQuestion ? attempt.answers[openQuestion.id]?.trim() : "";
  if (openAnswer) {
    return ` En tu respuesta también señalas: "${excerpt(openAnswer)}".`;
  }

  const singleQuestion = relatedQuestions.find((question) => question.type === "single");
  const selectedValue = singleQuestion ? attempt.answers[singleQuestion.id] : undefined;
  const option = singleQuestion?.options?.find((item) => item.value === selectedValue);
  if (singleQuestion && option) {
    return ` En la autoevaluación marcaste "${option.label.toLowerCase()}" en "${singleQuestion.prompt}".`;
  }

  return "";
}

function buildStrengthMessage(
  attempt: Omit<AttemptRecord, "feedback">,
  instrument: Instrument | undefined,
  criterion: CriterionResult,
) {
  const relatedQuestions = getRelatedQuestions(instrument, criterion.criterionId);
  const evidence = getEvidenceText(attempt, relatedQuestions);
  return `En ${criterion.title.toLowerCase()} ${performanceVerb(criterion.percentage)}: alcanzaste ${criterion.percentage}% y eso favorece tu desempeño en la sesión.${evidence}`.trim();
}

function buildImprovementMessage(
  attempt: Omit<AttemptRecord, "feedback">,
  instrument: Instrument | undefined,
  criterion: CriterionResult,
) {
  const relatedQuestions = getRelatedQuestions(instrument, criterion.criterionId);
  const evidence = getEvidenceText(attempt, relatedQuestions);
  return `Debes reforzar ${criterion.title.toLowerCase()}: obtuviste ${criterion.percentage}% y este criterio todavía necesita mayor precisión, desarrollo y práctica guiada.${evidence}`.trim();
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

export function buildQuestionFeedback(
  attempt: Omit<AttemptRecord, "feedback">,
  instrument: Instrument,
): QuestionFeedback[] {
  return instrument.questions.map((question) => {
    const answer = attempt.answers[question.id] ?? "";
    const criterionTitle = getCriterionTitle(instrument, question.criterionId);
    const score = getQuestionScore(question, answer);
    const answerText = getAnswerText(question, answer);
    const feedback =
      question.type === "single"
        ? buildSingleQuestionFeedback(question, criterionTitle, answerText, score)
        : buildTextareaQuestionFeedback(criterionTitle, answer, score);

    return {
      questionId: question.id,
      questionPrompt: question.prompt,
      criterionTitle,
      answerText,
      feedback,
      score,
      maxScore: question.maxScore,
    };
  });
}

export function buildFallbackFeedback(
  attempt: Omit<AttemptRecord, "feedback">,
  providedInstrument?: Instrument,
): FeedbackReport {
  const instrument = providedInstrument ?? getInstrumentById(attempt.instrumentId);
  const sorted = [...attempt.criteriaResults].sort((a, b) => a.percentage - b.percentage);
  const weakest = sorted[0];
  const strongest = [...attempt.criteriaResults].sort((a, b) => b.percentage - a.percentage)[0];
  const strengths = [...attempt.criteriaResults]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 2)
    .map((criterion) => buildStrengthMessage(attempt, instrument, criterion));
  const improvements = [...attempt.criteriaResults]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2)
    .map((criterion) => buildImprovementMessage(attempt, instrument, criterion));
  const studyRecommendation =
    instrument?.studyRecommendations[weakest.criterionId] ??
    "Revisa nuevamente la sesión, identifica tus errores y realiza un nuevo intento.";
  const priorityFocus = weakest ? weakest.title.toLowerCase() : "los criterios pendientes";
  const strongestFocus = strongest ? strongest.title.toLowerCase() : "tu participación general";

  return {
    summary:
      attempt.percentage >= 70
        ? `Tu desempeño global se ubica en ${levelLabel(attempt.level).toLowerCase()}. Tu avance más sólido aparece en ${strongestFocus} y tu prioridad inmediata es fortalecer ${priorityFocus}.`
        : `Tu desempeño global se ubica en ${levelLabel(attempt.level).toLowerCase()}. Ya cuentas con evidencia para mejorar, pero necesitas reforzar especialmente ${priorityFocus} antes del siguiente intento.`,
    strengths:
      strengths.length > 0
        ? strengths
        : ["Participaste en el instrumento y generaste evidencia suficiente para orientar tu mejora."],
    improvements:
      improvements.length > 0
        ? improvements
        : ["Necesitas revisar los criterios con menor avance y volver a intentarlo con apoyo guiado."],
    explanation: weakest
      ? `La principal dificultad aparece en ${weakest.title.toLowerCase()}, porque este criterio exige demostrar la competencia con mayor claridad, sustento y organización.`
      : "Tus respuestas muestran aspectos a reforzar en el siguiente intento.",
    studyRecommendation,
    questionFeedback: instrument ? buildQuestionFeedback(attempt, instrument) : [],
    nextStep: weakest
      ? `Antes de repetir el formulario, revisa un ejemplo breve del criterio ${weakest.title.toLowerCase()}, toma notas de lo que te faltó y vuelve a intentarlo aplicando esa mejora.`
      : "Repite la actividad aplicando la retroalimentación recibida.",
    provider: "reglas",
  };
}
