import { buildCriterionResults, rubricLevelFromPercentage } from "@/lib/feedback/rules";
import type { Instrument, StudentProfile } from "@/lib/types";

export function evaluateAttempt(
  instrument: Instrument,
  student: StudentProfile,
  answers: Record<string, string>,
) {
  const criteriaResults = buildCriterionResults(instrument, answers);
  const maxScore = instrument.questions.reduce((total, question) => total + question.maxScore, 0);

  const totalScore = criteriaResults.reduce((total, criterion) => total + criterion.achieved, 0);
  const percentage = maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100);

  return {
    student,
    answers,
    totalScore,
    maxScore,
    percentage,
    level: rubricLevelFromPercentage(percentage),
    criteriaResults,
  };
}
