-- Marco 4: lições, progresso por lição, hábitos e check-ins.
-- Hábitos e check-ins entram aqui porque a regra de liberação das semanas 3 a 8 conta check-ins.

create table public.licoes (
  id text primary key,
  modulo_id text not null references public.modulos,
  semana int not null,
  titulo text not null,
  duracao_min int not null,
  tipo_exercicio text not null check (tipo_exercicio in (
    'inventario','identidade','plano_gatilho','encadeamento',
    'ambiente','versao_minima','recuperacao','contrato_revisao'
  )),
  conteudo jsonb not null,
  unique (modulo_id, semana)
);

alter table public.licoes enable row level security;

create policy "Autenticados leem as lições" on public.licoes
  for select to authenticated
  using (true);

create table public.progresso_licao (
  user_id uuid references auth.users on delete cascade,
  licao_id text references public.licoes,
  respostas jsonb not null default '{}',
  etapa text not null default 'entenda' check (etapa in ('entenda','faca','compromisso','concluida')),
  iniciada_em timestamptz default now(),
  concluida_em timestamptz,
  primary key (user_id, licao_id)
);

alter table public.progresso_licao enable row level security;

create policy "Lê o próprio progresso" on public.progresso_licao
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cria o próprio progresso" on public.progresso_licao
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Altera o próprio progresso" on public.progresso_licao
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table public.habitos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  modulo_id text not null references public.modulos,
  nome text not null,
  tipo text not null default 'construir' check (tipo in ('construir','largar')),
  foco boolean not null default false,
  horario time,
  lugar text,
  ancora text,
  versao_minima text,
  plano_recuperacao text,
  aviso_falha boolean not null default true,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  removido_em timestamptz
);

create index habitos_user_id_idx on public.habitos (user_id);

alter table public.habitos enable row level security;

create policy "Lê os próprios hábitos" on public.habitos
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cria os próprios hábitos" on public.habitos
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Altera os próprios hábitos" on public.habitos
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  habito_id uuid not null references public.habitos on delete cascade,
  dia date not null,
  estado text not null check (estado in ('feito','minimo','nao_feito')),
  registrado_em timestamptz not null default now(),
  unique (habito_id, dia)
);

create index checkins_user_dia_idx on public.checkins (user_id, dia);

alter table public.checkins enable row level security;

-- O hábito também precisa ser do usuário: sem isso, daria para marcar check-in no hábito de outro.
create policy "Lê os próprios check-ins" on public.checkins
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cria os próprios check-ins" on public.checkins
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.habitos h where h.id = habito_id and h.user_id = (select auth.uid()))
  );
create policy "Altera os próprios check-ins" on public.checkins
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.habitos h where h.id = habito_id and h.user_id = (select auth.uid()))
  );
