import type { EvaluationSession, Instrument } from "@/lib/types";

const scale = [
  { value: "si", label: "Si", score: 4 },
  { value: "parcial", label: "Parcialmente", score: 2 },
  { value: "no", label: "No", score: 0 },
] as const;

export const instruments: Instrument[] = [
  {
    id: "instrumento-exposicion-argumentativa",
    title: "Lista de cotejo para exposición argumentativa",
    formalName:
      "Instrumento digital de evaluación formativa con retroalimentación automatizada mediante chatbot",
    teacher: "Vicky Sánchez Otiniano",
    date: "2026-06-05",
    level: "Intermedio",
    unit: "II",
    modality: "Presencial",
    sessionTitle:
      "Planificamos y redactamos nuestra exposición argumentativa sobre el destino y nuestras vidas",
    purpose:
      "En esta sesión nuestro propósito es planificar y redactar una exposición argumentativa sobre el destino y nuestras vidas.",
    competence: "Escribe diversos tipos de textos en su lengua materna.",
    capacities: [
      "Adecúa el texto a la situación comunicativa.",
      "Organiza y desarrolla las ideas de forma coherente y cohesionada.",
      "Utiliza convenciones del lenguaje escrito de forma pertinente.",
      "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito.",
    ],
    performance:
      "Adapta el formato de su texto argumentativo al propósito comunicativo, organizando sus ideas en torno a una tesis clara y argumentos sólidos, con conectores de causa y consecuencia y vocabulario formal.",
    rationale: [
      "Parte del enfoque de evaluación formativa y auténtica para estudiantes de EBA.",
      "Integra metacognición, andamiaje y recomendaciones concretas de mejora.",
      "Considera el contexto de CEBA Santa Rosa de Lima, uso frecuente de celulares y necesidad de accesibilidad.",
    ],
    criteria: [
      {
        id: "criterio-informacion",
        title: "Traje información adecuada",
        description: "Traje información adecuada para apoyar la redacción del tema.",
        weight: 1,
      },
      {
        id: "criterio-ideas",
        title: "Identifiqué ideas centrales",
        description:
          "Identifiqué las ideas centrales de mi información para incorporarla como parte de los argumentos.",
        weight: 1,
      },
      {
        id: "criterio-redaccion",
        title: "Aporté en la redacción",
        description: "Aporté con ideas en la redacción de la exposición.",
        weight: 1,
      },
      {
        id: "criterio-argumentacion",
        title: "Argumenté con validez",
        description: "Expliqué mis ideas con argumentos valederos.",
        weight: 1,
      },
      {
        id: "criterio-escucha",
        title: "Escuché con atención",
        description: "Escuché con atención la participación de mis compañeros de grupo.",
        weight: 1,
      },
    ],
    questions: [
      {
        id: "q1",
        criterionId: "criterio-informacion",
        prompt: "Traje información adecuada para apoyar la redacción del tema.",
        type: "single",
        maxScore: 4,
        options: [...scale],
      },
      {
        id: "q2",
        criterionId: "criterio-ideas",
        prompt: "Identifiqué las ideas centrales de mi información para incorporarlas como argumentos.",
        type: "single",
        maxScore: 4,
        options: [...scale],
      },
      {
        id: "q3",
        criterionId: "criterio-redaccion",
        prompt: "Aporté con ideas en la redacción de la exposición argumentativa.",
        type: "single",
        maxScore: 4,
        options: [...scale],
      },
      {
        id: "q4",
        criterionId: "criterio-argumentacion",
        prompt: "Expliqué mis ideas con argumentos valederos y conectores adecuados.",
        type: "single",
        maxScore: 4,
        options: [...scale],
      },
      {
        id: "q5",
        criterionId: "criterio-escucha",
        prompt: "Escuché con atención la participación de mis compañeros de grupo.",
        type: "single",
        maxScore: 4,
        options: [...scale],
      },
      {
        id: "q6",
        criterionId: "criterio-redaccion",
        prompt: "¿Qué parte de tu texto consideras más sólida?",
        type: "textarea",
        helperText: "Por ejemplo: inicio, argumentos, cierre o vocabulario.",
        maxScore: 2,
      },
      {
        id: "q7",
        criterionId: "criterio-argumentacion",
        prompt: "¿Qué aspecto te resultó más difícil al argumentar tus ideas?",
        type: "textarea",
        helperText: "Explica brevemente tu dificultad.",
        maxScore: 2,
      },
      {
        id: "q8",
        criterionId: "criterio-escucha",
        prompt: "¿Qué apoyo o recomendación te ayudaría a mejorar para el siguiente intento?",
        type: "textarea",
        helperText: "Puedes mencionar guía, ejemplos, práctica o retroalimentación.",
        maxScore: 2,
      },
    ],
    studyRecommendations: {
      "criterio-informacion":
        "Revisa fuentes y ejemplos antes de redactar para enriquecer tus ideas principales.",
      "criterio-ideas":
        "Practica la identificación de tesis, ideas principales y secundarias usando organizadores visuales.",
      "criterio-redaccion":
        "Trabaja la estructura inicio-desarrollo-cierre con una guía breve antes de escribir.",
      "criterio-argumentacion":
        "Refuerza el uso de tesis, ejemplos y conectores de causa y consecuencia.",
      "criterio-escucha":
        "Toma notas breves durante el trabajo colaborativo para mejorar tu escucha y participación.",
    },
  },
  {
    id: "instrumento-comprension-lectora",
    title: "Evaluación de comprensión lectora",
    formalName:
      "Instrumento digital de evaluación formativa con retroalimentación automatizada mediante chatbot",
    teacher: "Equipo docente EBA",
    date: "2026-06-05",
    level: "Intermedio",
    unit: "II",
    modality: "Presencial",
    sessionTitle: "Comprensión lectora",
    purpose: "Reconocer ideas principales, inferencias y vocabulario en un texto breve.",
    competence: "Lee diversos tipos de textos escritos en su lengua materna.",
    capacities: [
      "Obtiene información del texto escrito.",
      "Infiere e interpreta información del texto.",
      "Reflexiona y evalúa la forma y contenido del texto.",
    ],
    performance:
      "Identifica ideas principales, realiza inferencias y justifica sus respuestas con evidencia textual.",
    rationale: [
      "Sirve como instrumento demostrativo configurable para otras sesiones de aprendizaje.",
    ],
    criteria: [
      {
        id: "c1",
        title: "Ideas principales",
        description: "Reconoce el tema y la idea principal del texto.",
        weight: 1,
      },
      {
        id: "c2",
        title: "Inferencias",
        description: "Deduce información implícita a partir del texto.",
        weight: 1,
      },
      {
        id: "c3",
        title: "Vocabulario",
        description: "Interpreta vocabulario según el contexto.",
        weight: 1,
      },
    ],
    questions: Array.from({ length: 10 }, (_, index) => ({
      id: `cl-${index + 1}`,
      criterionId: index < 4 ? "c1" : index < 7 ? "c2" : "c3",
      prompt: `Pregunta ${index + 1} de comprensión lectora`,
      type: "single" as const,
      maxScore: 4,
      options: [...scale],
    })),
    studyRecommendations: {
      c1: "Subraya ideas clave y resume cada párrafo en una frase.",
      c2: "Busca pistas del texto para justificar tus inferencias.",
      c3: "Relaciona el vocabulario nuevo con el contexto y con ejemplos.",
    },
  },
];

export const sessions: EvaluationSession[] = [
  {
    id: "sesion-argumentativa-1",
    instrumentId: "instrumento-exposicion-argumentativa",
    code: "EBA-URUBAMBA-2026",
    label: "Sesión activa de exposición argumentativa",
    active: true,
    startedAt: "2026-06-27T08:00:00.000Z",
  }
];

export function getInstrumentById(id: string) {
  return instruments.find((instrument) => instrument.id === id);
}

export function getSessionByCode(code: string) {
  return sessions.find((session) => session.code.toUpperCase() === code.toUpperCase());
}
