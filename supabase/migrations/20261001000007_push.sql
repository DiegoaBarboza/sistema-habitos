-- Marco 9: inscrições de Web Push e controle de "no máximo 1 lembrete por dia".

create table public.push_inscricoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  endpoint text not null unique,
  chaves jsonb not null,
  criado_em timestamptz not null default now()
);

create index push_inscricoes_user_id_idx on public.push_inscricoes (user_id);

alter table public.push_inscricoes enable row level security;

create policy "Lê as próprias inscrições" on public.push_inscricoes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cria as próprias inscrições" on public.push_inscricoes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Apaga as próprias inscrições" on public.push_inscricoes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Dia (no fuso do usuário) do último lembrete enviado. Só o envio (service_role) escreve.
alter table public.perfis add column lembrete_enviado_em date;
