insert into public.student_attempts (
  id,
  session_code,
  instrument_id,
  student_name,
  student_section,
  consent_accepted,
  answers,
  total_score,
  max_score,
  percentage,
  level,
  criteria_results,
  feedback
)
values (
  gen_random_uuid(),
  'EBA-URUBAMBA-2026',
  'instrumento-exposicion-argumentativa',
  'Estudiante de ejemplo',
  'Grupo A',
  true,
  '{"q1":"si","q2":"parcial","q3":"si","q4":"parcial","q5":"si"}'::jsonb,
  14,
  20,
  70,
  'logrado',
  '[]'::jsonb,
  '{"summary":"Retroalimentación de ejemplo."}'::jsonb
);
