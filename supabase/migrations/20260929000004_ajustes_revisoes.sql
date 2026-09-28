-- Marco 5: ajustes de ambiente (semana 5) e contrato/revisões (semana 8).

create table public.ajustes_ambiente (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  habito_id uuid references public.habitos on delete cascade,
  alavanca text not null check (alavanca in ('a_vista','tirar_passos','esconder_gatilho','colocar_passos')),
  texto text not null,
  aplicado boolean not null default false
);

create index ajustes_ambiente_user_id_idx on public.ajustes_ambiente (user_id);

alter table public.ajustes_ambiente enable row level security;

create policy "Lê os próprios ajustes" on public.ajustes_ambiente
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cria os próprios ajustes" on public.ajustes_ambiente
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Altera os próprios ajustes" on public.ajustes_ambiente
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Apaga os próprios ajustes" on public.ajustes_ambiente
  for delete to authenticated using ((select auth.uid()) = user_id);

create table public.revisoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  tipo text not null check (tipo in ('contrato','mensal')),
  dados jsonb not null,
  criado_em timestamptz not null default now(),
  proxima_em date
);

create index revisoes_user_id_idx on public.revisoes (user_id);

alter table public.revisoes enable row level security;

create policy "Lê as próprias revisões" on public.revisoes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cria as próprias revisões" on public.revisoes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Altera as próprias revisões" on public.revisoes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
