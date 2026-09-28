-- Marco 2: perfis dos usuários, criados automaticamente no primeiro login.

create table public.perfis (
  user_id uuid primary key references auth.users on delete cascade,
  nome text,
  tema text not null default 'auto' check (tema in ('auto','escuro','claro')),
  fuso text not null default 'America/Sao_Paulo',
  lembrete_ativo boolean not null default true,
  lembrete_hora time not null default '07:00',
  onboarding_ok boolean not null default false,
  criado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;

create policy "Lê o próprio perfil" on public.perfis
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Altera o próprio perfil" on public.perfis
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Sem policy de insert nem delete: a linha nasce pelo trigger abaixo
-- e some junto com o usuário (on delete cascade).

create function public.criar_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (user_id) values (new.id);
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();
