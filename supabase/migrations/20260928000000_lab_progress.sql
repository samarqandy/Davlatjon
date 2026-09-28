-- Прогресс «Лаборатории Давлатжона» для вошедших в аккаунт (Google или Telegram).
-- Доступ только с сервера сайта по service_role-ключу: RLS включён, политик для anon/authenticated нет.
create table if not exists public.lab_progress (
  user_id text primary key,            -- «google:<sub>» или «tg:<id>»
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.lab_progress enable row level security;

comment on table public.lab_progress is 'Davlatjon lab: progress of signed-in users (server-only access).';
