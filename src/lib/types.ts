export type RubricLevel = "destacado" | "logrado" | "en_proceso" | "en_inicio";

export type Criterion = {
  id: string;
  title: string;
  description: string;
  weight: number;
};

export type QuestionOption = {
  value: string;
  label: string;
  score: number;
};

export type Question = {
  id: string;
  criterionId: string;
  prompt: string;
  type: "single" | "textarea";
  helperText?: string;
  maxScore: number;
  options?: QuestionOption[];
};

export type Instrument = {
  id: string;
  title: string;
  formalName: string;
  teacher: string;
  date: string;
  level: string;
  unit: string;
  modality: string;
  sessionTitle: string;
  purpose: string;
  competence: string;
  capacities: string[];
  performance: string;
  rationale: string[];
  criteria: Criterion[];
  questions: Question[];
  studyRecommendations: Record<string, string>;
};

export type EvaluationSession = {
  id: string;
  instrumentId: string;
  code: string;
  label: string;
  active: boolean;
  startedAt: string;
  expiresAt?: string;
};

export type StudentProfile = {
  fullName: string;
  section?: string;
  consentAccepted: boolean;
};

export type AnswerValue = string;

export type CriterionResult = {
  criterionId: string;
  title: string;
  achieved: number;
  max: number;
  percentage: number;
  level: RubricLevel;
  strengths: string[];
  improvements: string[];
};

export type FeedbackReport = {
  summary: string;
  strengths: string[];
  improvements: string[];
  explanation: string;
  studyRecommendation: string;
  nextStep: string;
  provider: "gemini" | "reglas";
};

export type AttemptRecord = {
  id: string;
  sessionCode: string;
  instrumentId: string;
  student: StudentProfile;
  answers: Record<string, AnswerValue>;
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: RubricLevel;
  createdAt: string;
  criteriaResults: CriterionResult[];
  feedback: FeedbackReport;
};
