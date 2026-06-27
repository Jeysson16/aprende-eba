# Informe técnico

## 1. Fundamentación pedagógica del instrumento digital

El proyecto implementa un instrumento digital de evaluación formativa con retroalimentación automatizada mediante chatbot, orientado a estudiantes adultos de EBA/CEBA. Su valor pedagógico radica en que permite recoger evidencia de aprendizaje, promover metacognición y entregar retroalimentación inmediata para mejorar el desempeño en la misma sesión o en un siguiente intento.

El enfoque se sustenta en la evaluación formativa y auténtica, porque no se limita a asignar un puntaje, sino que comunica fortalezas, dificultades y acciones concretas de mejora. También responde al contexto descrito en los documentos de base: pertinencia sociocultural, necesidad de andamiaje, inclusión, limitaciones de conectividad y uso frecuente del celular como medio de acceso.

Desde la educación de personas adultas, el instrumento dialoga con referencias como Knowles, Freire, Vygotsky, Piaget y Ausubel. En conjunto, estos aportes justifican que la retroalimentación no sea sancionadora, sino orientadora, breve y vinculada a la experiencia real del estudiante.

## 2. Diseño del instrumento

El instrumento principal implementado corresponde a la sesión:

- `Planificamos y redactamos nuestra exposición argumentativa sobre el destino y nuestras vidas`

Incluye:

- datos informativos,
- propósito de aprendizaje,
- competencia,
- capacidades,
- desempeño precisado,
- criterios de evaluación,
- lista de cotejo digital,
- preguntas metacognitivas complementarias.

Los criterios base digitalizados son:

- traje información adecuada para apoyar la redacción del tema,
- identifiqué las ideas centrales de mi información,
- aporté con ideas en la redacción de la exposición,
- expliqué mis ideas con argumentos valederos,
- escuché con atención la participación de mis compañeros.

Además, el sistema incorpora preguntas abiertas para identificar dificultades, fortalezas y apoyos requeridos.

## 3. Implementación técnica

La solución fue construida con:

- `Next.js`,
- `TypeScript`,
- `Tailwind CSS`,
- `Gemini API`,
- `Supabase` como persistencia opcional.

El flujo técnico es el siguiente:

1. el estudiante ingresa con un código de sesión;
2. el sistema valida la sesión publicada;
3. el formulario registra respuestas cerradas y abiertas;
4. el motor de evaluación calcula puntajes por criterio y nivel de logro;
5. Gemini redacta la retroalimentación;
6. si Gemini no está disponible, se aplica un fallback local por reglas;
7. el administrador revisa respuestas y retroalimentaciones en el panel docente.

## 4. Calidad y pertinencia de la retroalimentación automatizada

La retroalimentación se compone de cinco elementos:

- reconocimiento de fortalezas,
- aspecto principal por mejorar,
- explicación breve,
- recomendación de estudio,
- acción siguiente.

Esta estructura favorece claridad, oportunidad y personalización. Además, evita mensajes punitivos y prioriza el acompañamiento, lo que resulta coherente con la población adulta de EBA y con el principio de evaluación para mejorar.

## 5. Impacto en el aprendizaje

La herramienta puede contribuir a:

- fortalecer la autorregulación del estudiante,
- visibilizar criterios de logro,
- reducir la demora entre respuesta y retroalimentación,
- facilitar decisiones pedagógicas del docente,
- registrar evidencia útil para seguimiento.

## 6. Presentación técnica

El producto se entrega como una aplicación desplegable en Vercel, con panel de administradores, formulario para estudiantes, integración con Gemini y documentación de arquitectura. Su diseño responde de manera directa a la rúbrica al articular fundamentación pedagógica, diseño del instrumento, implementación técnica, retroalimentación automatizada e impacto esperado.
