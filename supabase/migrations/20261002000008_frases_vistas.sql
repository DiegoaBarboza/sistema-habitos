-- Frases do dia que a pessoa já viu (Perfil → Minhas frases).
-- O texto fica em licoes.conteudo.frases; aqui só a referência e o dia da jornada.

create table public.frases_vistas (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  licao_id text not null references public.licoes,
  indice int not null check (indice >= 0),
  vista_em date not null,
  dia_jornada int not null check (dia_jornada > 0),
  primary key (user_id, licao_id, indice)
);

alter table public.frases_vistas enable row level security;

create policy "Lê as próprias frases" on public.frases_vistas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Registra as próprias frases" on public.frases_vistas
  for insert to authenticated with check ((select auth.uid()) = user_id);
