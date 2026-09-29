-- Marca Trilho: Negociação e Persuasão saíram do roadmap; "em breve" passam a ser Procrastinação e Sono.

delete from public.modulos
 where id in ('negociacao', 'persuasao')
   and not exists (select 1 from public.acessos a where a.modulo_id = modulos.id);

insert into public.modulos (id, titulo, status, ordem) values
  ('procrastinacao', 'Procrastinação', 'em_breve', 2),
  ('sono', 'Sono', 'em_breve', 3)
on conflict (id) do update set titulo = excluded.titulo, status = excluded.status, ordem = excluded.ordem;
