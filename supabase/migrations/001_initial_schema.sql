create table if not exists public.student_attempts (
  id uuid primary key,
  session_code text not null,
  instrument_id text not null,
  student_name text not null,
  student_section text,
  consent_accepted boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  total_score integer not null default 0,
  max_score integer not null default 0,
  percentage integer not null default 0,
  level text not null,
  criteria_results jsonb not null default '[]'::jsonb,
  feedback jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists student_attempts_session_code_idx
  on public.student_attempts (session_code);

create index if not exists student_attempts_created_at_idx
  on public.student_attempts (created_at desc);
