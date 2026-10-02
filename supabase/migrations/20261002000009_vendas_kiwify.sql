-- Marco 8: vendas pela Kiwify, lotes de preço e registro bruto dos webhooks.

-- Lotes de venda. kiwify_product_id é o id que a Kiwify gera pro produto (preencher depois de criar).
create table public.ofertas (
  codigo text primary key,
  nome text not null,
  preco numeric(10,2) not null check (preco >= 0),
  plano text not null default 'vitalicio' check (plano in ('vitalicio','mensal','anual')),
  modulo_id text not null references public.modulos,
  vagas int check (vagas > 0),            -- null = sem limite
  kiwify_product_id text unique,
  ativa boolean not null default true,
  ordem int not null default 0
);

insert into public.ofertas (codigo, nome, preco, plano, modulo_id, vagas, ativa, ordem) values
  ('trilho_fundador_47', 'Lote 1 · Fundador', 47.00, 'vitalicio', 'habitos', 100, true, 1),
  ('trilho_oficial_97', 'Lote 2 · Oficial', 97.00, 'vitalicio', 'habitos', null, true, 2);

-- Uma linha por pedido da Kiwify. Valores em reais; o líquido já desconta a taxa da Kiwify.
create table public.vendas (
  id uuid primary key default gen_random_uuid(),
  kiwify_order_id text not null unique,
  email text not null check (email = lower(email)),
  oferta_codigo text references public.ofertas,
  status text not null check (status in ('aprovada','reembolsada','chargeback','cancelada')),
  valor_bruto numeric(10,2),
  valor_liquido numeric(10,2),
  plano text not null default 'vitalicio',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index vendas_oferta_status_idx on public.vendas (oferta_codigo, status);

-- Tudo o que chega no webhook fica guardado, inclusive o que for recusado, pra conferência.
create table public.webhook_logs (
  id bigint generated always as identity primary key,
  recebido_em timestamptz not null default now(),
  origem text not null default 'kiwify',
  evento text,
  autenticado boolean not null,
  resultado text,
  payload jsonb
);

-- Campo preparado pro futuro "Trilho Contínuo" (mensal/anual). Hoje todo acesso é vitalício.
alter table public.acessos add column plano text not null default 'vitalicio'
  check (plano in ('vitalicio','mensal','anual'));

-- Só o servidor (service_role) lê e escreve essas tabelas. Sem policy = nenhum acesso pelo app.
alter table public.ofertas enable row level security;
alter table public.vendas enable row level security;
alter table public.webhook_logs enable row level security;
