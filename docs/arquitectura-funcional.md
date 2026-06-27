# Arquitectura funcional

## Resumen

La aplicación se compone de dos flujos:

- flujo público de estudiantes,
- flujo administrativo de docentes.

El estudiante accede con código de sesión, responde el instrumento y recibe retroalimentación inmediata. El docente administra instrumentos, observa la lista de cotejo, revisa respuestas y monitorea resultados.

## Capas

### Presentación

- `src/app/*`
- `src/components/*`

### Dominio pedagógico

- `src/lib/pedagogy/seed-instruments.ts`
- `src/lib/pedagogy/criteria-maps.ts`

### Evaluación y retroalimentación

- `src/lib/feedback/scoring.ts`
- `src/lib/feedback/rules.ts`
- `src/lib/feedback/prompt.ts`
- `src/lib/feedback/generate-feedback.ts`

### Datos

- `src/lib/data-store.ts`
- `src/lib/supabase/server.ts`
- `supabase/migrations/001_initial_schema.sql`

## Estrategia de IA

- proveedor principal: `Gemini`
- fallback: reglas locales pedagógicas
- objetivo: producir mensajes breves, útiles, personalizados y seguros

## Seguridad

- login docente por cookie firmada
- middleware para rutas `/admin`
- validación Zod en los endpoints públicos

## Persistencia

- con variables de Supabase: usa PostgreSQL remoto
- sin Supabase: utiliza memoria para demostración local
