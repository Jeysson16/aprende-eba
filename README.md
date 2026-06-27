# Instrumento digital de evaluación formativa

Aplicación web orientada a estudiantes de EBA/CEBA y docentes administradores. Permite aplicar una lista de cotejo digital, registrar respuestas, visualizar resultados y generar retroalimentación automatizada con Gemini o mediante reglas locales de respaldo.

## Stack recomendado

- `Next.js` con App Router
- `TypeScript`
- `Tailwind CSS`
- `Gemini API` para retroalimentación automática
- `Supabase` para persistencia opcional en despliegue real
- fallback local sin IA ni base externa para demostración y desarrollo

## Variables de entorno

Copia `.env.example` a `.env.local` y completa lo necesario:

```bash
cp .env.example .env.local
```

Variables principales:

- `GEMINI_API_KEY`: habilita la retroalimentación con Gemini.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: habilitan persistencia en Supabase.
- Si completas `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, el login docente también puede autenticarse contra `Supabase Auth`.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`: acceso del panel docente.

Si no configuras Gemini o Supabase, la app sigue funcionando con retroalimentación local y almacenamiento en memoria para fines de demostración.

## Desarrollo local

Instala dependencias y ejecuta:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Credenciales demo del panel docente:

- correo: `docente@ceba.edu.pe`
- contraseña: `Docente123`

Si configuras `Supabase Auth`, puedes iniciar sesión con un usuario administrador real creado en tu proyecto de Supabase.

## Rutas principales

- `/`: portada institucional
- `/ingresar`: acceso del estudiante por código
- `/sesion/EBA-URUBAMBA-2026`: instrumento de evaluación
- `/admin/login`: ingreso docente
- `/admin`: dashboard administrativo

## Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. Importa el repositorio en [Vercel](https://vercel.com).
3. Configura variables de entorno desde el panel.
4. Si usarás persistencia real, crea el proyecto en Supabase y ejecuta el esquema de `supabase/migrations/001_initial_schema.sql`.

## Documentación

- `docs/informe-tecnico.md`
- `docs/arquitectura-funcional.md`
- `.trae/documents/plan-instrumento-evaluacion-chatbot-vercel.md`

## Nota sobre IA

La mejor opción para este proyecto es `Gemini API + reglas locales`. La IA mejora la personalización de la retroalimentación, mientras que las reglas garantizan continuidad cuando falte conexión, cuota o clave API.
