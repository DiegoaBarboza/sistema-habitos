-- Novos módulos "em breve" pedidos pelo Diego: atividade física, meditação e alimentação
-- (Procrastinação e Sono continuam). Só catálogo: nada é vendido nem liberado por aqui.

insert into public.modulos (id, titulo, status, ordem) values
  ('procrastinacao', 'Procrastinação', 'em_breve', 2),
  ('sono', 'Sono', 'em_breve', 3),
  ('atividade-fisica', 'Atividade física', 'em_breve', 4),
  ('meditacao', 'Meditação', 'em_breve', 5),
  ('alimentacao', 'Alimentação', 'em_breve', 6)
on conflict (id) do update set titulo = excluded.titulo, status = excluded.status, ordem = excluded.ordem;
