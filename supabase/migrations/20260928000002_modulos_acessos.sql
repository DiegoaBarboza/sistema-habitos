-- Marco 3: catálogo de módulos e liberação de acesso por e-mail.

create table public.modulos (
  id text primary key,
  titulo text not null,
  status text not null check (status in ('ativo','em_breve')),
  kiwify_product_id text,
  ordem int not null default 0
);

alter table public.modulos enable row level security;

create policy "Autenticados leem o catálogo" on public.modulos
  for select to authenticated
  using (true);

insert into public.modulos (id, titulo, status, ordem) values
  ('habitos', 'Hábitos', 'ativo', 1),
  ('negociacao', 'Negociação', 'em_breve', 2),
  ('persuasao', 'Persuasão com ética', 'em_breve', 3);

create table public.acessos (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email)),
  user_id uuid references auth.users on delete set null,
  modulo_id text not null references public.modulos,
  origem text not null check (origem in ('kiwify','manual')),
  status text not null default 'ativo' check (status in ('ativo','revogado')),
  kiwify_order_id text unique,
  criado_em timestamptz not null default now(),
  unique (email, modulo_id)
);

create index acessos_user_id_idx on public.acessos (user_id);

alter table public.acessos enable row level security;

-- O usuário vê os acessos do próprio e-mail, mesmo antes do vínculo por user_id
-- (ex.: liberado depois de já ter feito login). Escrita só pelo service_role.
create policy "Lê os próprios acessos" on public.acessos
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or email = lower((select auth.jwt() ->> 'email'))
  );

-- Preenche acessos.user_id para o e-mail de quem acabou de entrar.
create function public.vincular_acessos()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.acessos
     set user_id = auth.uid()
   where user_id is null
     and email = lower(auth.jwt() ->> 'email');
$$;

revoke execute on function public.vincular_acessos() from public, anon;
grant execute on function public.vincular_acessos() to authenticated;
