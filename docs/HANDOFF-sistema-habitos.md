# HANDOFF · Sistema de Hábitos (MVP) · para o Claude Code

> Leia este arquivo inteiro antes de escrever código. Ele é a especificação fechada do MVP: produto, telas, visual, dados, regras e critérios de aceite.
> **Atenção: onde este arquivo conflitar com `HANDOFF-marca-trilho.md`, vale o HANDOFF-marca-trilho.md** (nome do produto, cores, ícones e alguns textos mudaram depois).
> O conteúdo das lições está em `conteudo-modulo1-habitos.md` (mesma pasta). Coloque os arquivos na raiz do repositório, em `docs/`.
> Dono do produto: Diego Barboza. Idioma do app: português do Brasil. Não invente regra que não esteja aqui; se faltar algo, pergunte.

---

## 1. O produto em uma frase

App web instalável (PWA) para profissionais técnicos: os métodos de mudança de hábito viram **exercícios preenchidos na tela** e **indicadores de adesão**, com check-in diário de ~10 segundos. O primeiro módulo pago é "Hábitos" (8 semanas, 1 ferramenta por semana). A plataforma já nasce preparada para vender outros módulos depois.

## 2. Escopo do MVP

**Dentro:**
1. Login sem senha (link mágico por e-mail).
2. Liberação do módulo pela compra na Kiwify (webhook) e pela lista de testadores (liberação manual).
3. Onboarding de 3 passos.
4. Tela Hoje com check-in diário (feito / mínimo / não feito).
5. Trilha das 8 semanas com regra de liberação (no marca handoff a aba passa a se chamar "Semanas").
6. Lição com as etapas Entenda / Faça / Compromisso e 8 tipos de exercício.
7. Progresso com indicadores.
8. Perfil: aparência (Automático/Escuro/Claro), lembrete, módulos, exportar dados, sair.
9. Lembrete diário por notificação (Web Push).
10. PWA instalável (manifest + service worker).

**Fora do MVP (não construir agora):** loja/checkout dentro do app (a compra acontece na Kiwify), outros módulos além de "Hábitos" (só aparecem como "em breve"), app nativo, painel administrativo (a liberação manual é feita por SQL ou script), gamificação (medalhas, ranking), social, IA.

## 3. Stack

- **Front + back:** Next.js (App Router) + TypeScript, deploy na **Vercel**.
- **Banco, auth e storage:** **Supabase** (Postgres + Auth com magic link + RLS).
- **Estilo:** Tailwind CSS com os tokens da seção 5 como variáveis CSS. Sem biblioteca de componentes pesada; componentes próprios simples.
- **Gráficos:** SVG próprio (barras simples e mapa de 14 dias). Não precisa de biblioteca.
- **Push:** Web Push (VAPID) + cron da Vercel para o disparo do lembrete.
- **E-mail do magic link:** SMTP próprio configurado no Supabase (o SMTP padrão tem limite baixo de envios).
- Fuso horário padrão: `America/Sao_Paulo`. Guarde o fuso do usuário no perfil e calcule "dia" sempre no fuso dele.

## 4. Telas (referência visual)

Design aprovado no quadro "App – Sistema de Hábitos" (claude.ai/artifact/6QHrXCGFxjKwqkz6VswAXP). São 7 telas em 390 px de largura, cada uma nos dois temas. Siga a estrutura, a hierarquia e os textos. O código pode (e deve) ser responsivo: no desktop, a coluna fica centralizada com no máximo 480 px, e a barra de abas continua embaixo.

Barra de abas fixa embaixo, com 4 itens: **Hoje · Trilha · Progresso · Perfil** (ícones em traço, 22 px; item ativo na cor de acento). *(O marca handoff renomeia "Trilha" para "Semanas".)*

### 4.1 Entrar
- Marca (quadrado de 56 px com o ícone em cor de acento), rótulo "SISTEMA DE HÁBITOS" em mono, título "Hábito é processo. Processo se mede.", subtítulo.
- Campo de e-mail + botão "Receber link de acesso".
- Texto: "Sem senha. Comprou pela Kiwify? Use o mesmo e-mail da compra para liberar seu módulo."
- Depois de enviar: cartão "Confira seu e-mail" com o e-mail usado e o botão "Usar outro e-mail".
- E-mail sem compra e fora da lista de testadores: o login funciona, mas a tela seguinte mostra "Nenhum módulo liberado para este e-mail" + link para a página de venda + "Comprou com outro e-mail? Entre com ele."

### 4.2 Primeiro acesso (onboarding, só na primeira entrada)
1. "Como o sistema funciona": 4 cartões (01 Entenda, 02 Faça, 03 Execute, 04 Meça).
2. "Dois ajustes rápidos": nome ("Como quer ser chamado?") + horário do lembrete (chips 07:00 / 12:30 / 18:30 / 21:00; padrão 07:00). Texto: "Dá para mudar depois em Perfil."
3. "Tudo pronto, {nome}." + cartão da Semana 1 + botão "Começar a semana 1" (abre a lição 1).
- Indicador de passos no topo (3 traços) e "1 de 3". Botões "Voltar" e "Continuar".
- **Não perguntar o tema no onboarding** (decisão do produto).

### 4.3 Hoje
- Topo: data e semana em mono ("QUI · 24 SET · SEMANA 3/8"), "Bom dia/Boa tarde/Boa noite, {nome}", avatar com as iniciais (leva ao Perfil).
- 3 indicadores: HOJE (feitos/previstos), ADESÃO SEM. (%), SEM FALHA 2X (dias).
- Gráfico "ESTA SEMANA": 7 barras (S T Q Q S S D), altura = % do dia, linha tracejada na meta de 80%, dia atual destacado, dias futuros como traço cinza.
- "Check-in de hoje": um cartão por hábito ativo com nome, linha secundária (horário · lugar · âncora, quando existirem) e estado. Tocar no cartão alterna entre feito e pendente; um toque longo (ou um botão "⋯") abre as 3 opções: **Feito · Mínimo ({texto da versão mínima}) · Não feito**. Pendente tem borda tracejada na cor de alerta.
- Faixa "Hoje é dia de não falhar 2x" no cartão do hábito que falhou ontem (depois da semana 7, mostra o plano de recuperação).
- Lembrete de ajustes de ambiente pendentes (depois da semana 5).
- Cartão de acento "LIÇÃO DA SEMANA · X MIN" com o título da lição atual → abre a lição.
- Estado vazio (semana 1, antes de ter hábitos ativos): "Seu check-in começa na semana 2. Primeiro, conclua o inventário." + botão da lição.

### 4.4 Trilha
- "MÓDULO 1" / "Hábitos"; barra "X de 8 semanas concluídas" com a %.
- 8 linhas: concluída (ícone check na cor de acento + resumo, ex.: "Concluída · 5 hábitos mapeados"), atual (borda de acento + botão "Continuar"), bloqueada (cadeado, opacidade 70% + motivo, ex.: "Libera ao concluir a semana 3 + 5 check-ins (3/5)").
- Lições concluídas podem ser reabertas para consulta e edição.
- "Outros módulos": cartões tracejados "EM BREVE" (Negociação, Persuasão com ética), vindos da tabela `modulos` com `status = 'em_breve'`. *(Substituído no marca handoff: Procrastinação e Sono.)*

### 4.5 Lição
- Cabeçalho: voltar, "SEMANA N · X MIN", título; barra de 3 etapas (Entenda / Faça / Compromisso) que acende conforme o avanço.
- **Entenda:** título, 2 ou 3 parágrafos, caixa de destaque com a pergunta-teste.
- **Faça:** o componente do tipo de exercício (seção 8).
- **Compromisso:** a escolha ou o efeito descrito no conteúdo.
- Botão final: desabilitado ("Classifique os 5 e escolha 1 hábito" ou o equivalente de cada tipo) → "Concluir lição" → estado de sucesso "Lição concluída · voltar para Hoje".
- Rodapé "PARA IR ALÉM" com a leitura recomendada.
- **Salvamento automático** de cada campo (debounce de 600 ms). Sair e voltar mantém o que foi preenchido.

### 4.6 Progresso
- Seletor 7d / 30d / Tudo.
- 4 indicadores: ADESÃO (% + subtítulo comparando com a meta), SEM FALHA 2X (atual + recorde), CHECK-INS (quantidade + dias ativos), VERSÃO MÍNIMA (dias salvos pelo mínimo).
- "Adesão por semana": 8 barras (S1…S8) com o valor em cima, meta de 80% tracejada, semana atual na cor de acento e as passadas numa cor intermediária.
- "Por hábito · 14 dias": um cartão por hábito com a % e 14 quadradinhos (feito = acento, mínimo = cor intermediária, não feito/sem registro = vazio) + legenda. *(No marca handoff, "mínimo" passa a ser célula com metade da altura preenchida.)*
- Cartão "Revisão mensal guiada libera em X dias" (depois da semana 8: abre a revisão).

### 4.7 Perfil
- Avatar com iniciais, nome, e-mail.
- **APARÊNCIA:** controle segmentado Automático / Escuro / Claro; a troca é imediata. Texto de apoio: "Segue o tema do seu celular (agora: escuro)." ou "Fixo no tema claro, independente do celular."
- **LEMBRETE DIÁRIO:** interruptor + horário (seletor). Ligar pede permissão de notificação ao navegador.
- **MEUS MÓDULOS:** Hábitos "ATIVO · VITALÍCIO"; os outros "EM BREVE".
- **CONTA:** Exportar meus dados (baixa um JSON com tudo do usuário), Suporte e sugestões (mailto: configurável), Sair.

## 5. Visual (tokens)

> **Esta seção foi substituída.** Os tokens, as cores e o contraste válidos estão em `HANDOFF-marca-trilho.md` e em `brand-kit/app/brand-tokens.css`. A tabela antiga (ciano da Zênite) não deve ser usada.

Fontes (Google Fonts): **IBM Plex Sans** 400/500/600/700 para o texto; **IBM Plex Mono** 400/500/600 para números, rótulos em caixa-alta e datas.

- Raio: 12 px (cartões, botões), 10 px (campos pequenos), 16 px (cartões de destaque). Espaçamento em múltiplos de 4; padding lateral de 20 px no celular.
- Rótulos em mono: 10–12 px, `letter-spacing: .06–.08em`, caixa-alta.
- Alvos de toque ≥ 44 px. Contraste AA nos dois temas.
- Tema: aplicar `data-theme="dark|light"` no `<html>`. "Automático" usa `prefers-color-scheme` e reage à mudança do sistema. Guardar a escolha no perfil do usuário (e em `localStorage` para evitar flash na carga).
- Ícones: traço de 1,9–2 px, cantos arredondados (Lucide serve).

## 6. Modelo de dados (Supabase)

Todas as tabelas com RLS ligado. O usuário só lê e escreve as próprias linhas (`user_id = auth.uid()`). `modulos`, `licoes` e `conteudo` são de leitura pública para autenticados. A escrita em `acessos` é só do `service_role` (webhook/admin).

```sql
-- perfis
create table perfis (
  user_id uuid primary key references auth.users on delete cascade,
  nome text,
  tema text not null default 'auto' check (tema in ('auto','escuro','claro')),
  fuso text not null default 'America/Sao_Paulo',
  lembrete_ativo boolean not null default true,
  lembrete_hora time not null default '07:00',
  onboarding_ok boolean not null default false,
  criado_em timestamptz not null default now()
);

-- catálogo de módulos (plataforma)
create table modulos (
  id text primary key,                 -- 'habitos'
  titulo text not null,
  status text not null check (status in ('ativo','em_breve')),
  kiwify_product_id text,              -- id do produto na Kiwify
  ordem int not null default 0
);

-- quem tem acesso a qual módulo
create table acessos (
  id uuid primary key default gen_random_uuid(),
  email text not null,                 -- e-mail da compra (minúsculo)
  user_id uuid references auth.users,  -- preenchido quando o e-mail faz login
  modulo_id text not null references modulos,
  origem text not null check (origem in ('kiwify','manual')),
  status text not null default 'ativo' check (status in ('ativo','revogado')),
  kiwify_order_id text unique,
  criado_em timestamptz not null default now(),
  unique (email, modulo_id)
);

-- lições (conteúdo seedado a partir de conteudo-modulo1-habitos.md)
create table licoes (
  id text primary key,                 -- 'habitos-s1'
  modulo_id text not null references modulos,
  semana int not null,
  titulo text not null,
  duracao_min int not null,
  tipo_exercicio text not null,        -- inventario | identidade | plano_gatilho | encadeamento | ambiente | versao_minima | recuperacao | contrato_revisao
  conteudo jsonb not null              -- entenda {titulo, paragrafos[], pergunta}, faca {...}, compromisso {...}, para_ir_alem
);

-- progresso do usuário em cada lição
create table progresso_licao (
  user_id uuid references auth.users on delete cascade,
  licao_id text references licoes,
  respostas jsonb not null default '{}',   -- o que foi preenchido no exercício
  etapa text not null default 'entenda' check (etapa in ('entenda','faca','compromisso','concluida')),
  iniciada_em timestamptz default now(),
  concluida_em timestamptz,
  primary key (user_id, licao_id)
);

-- hábitos ativos do usuário
create table habitos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  modulo_id text not null references modulos,
  nome text not null,
  tipo text not null default 'construir' check (tipo in ('construir','largar')),
  foco boolean not null default false,     -- hábito-foco da semana 1
  horario time, lugar text, ancora text,   -- semanas 3 e 4
  versao_minima text,                      -- semana 6
  plano_recuperacao text,                  -- semana 7
  aviso_falha boolean not null default true,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  removido_em timestamptz
);

-- check-ins diários
create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  habito_id uuid not null references habitos on delete cascade,
  dia date not null,                        -- dia no fuso do usuário
  estado text not null check (estado in ('feito','minimo','nao_feito')),
  registrado_em timestamptz not null default now(),
  unique (habito_id, dia)
);

-- ajustes de ambiente (semana 5)
create table ajustes_ambiente (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  habito_id uuid references habitos on delete cascade,
  alavanca text not null check (alavanca in ('a_vista','tirar_passos','esconder_gatilho','colocar_passos')),
  texto text not null,
  aplicado boolean not null default false
);

-- contrato e revisões (semana 8)
create table revisoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  tipo text not null check (tipo in ('contrato','mensal')),
  dados jsonb not null,                     -- contrato: {compromisso, consequencia, testemunha, assinado_em}; mensal: [{habito_id, decisao, nota}]
  criado_em timestamptz not null default now(),
  proxima_em date
);

-- inscrições de push
create table push_inscricoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  endpoint text not null unique,
  chaves jsonb not null,
  criado_em timestamptz not null default now()
);
```

Vínculo de acesso: no primeiro login (e a cada login), um trigger ou rota de servidor preenche `acessos.user_id` onde `lower(email) = lower(auth.email())`. O app só mostra o módulo se existir um `acessos` com `status = 'ativo'` para o usuário.

Seeds: `modulos` = `habitos` (ativo), e como "em breve" **`procrastinacao` e `sono`** (o arquivo original previa `negociacao` e `persuasao`, que saíram do roadmap). `licoes` = as 8 do arquivo de conteúdo, convertidas em JSON (escreva um script `scripts/seed-licoes.ts` que lê o markdown ou um JSON derivado dele; o texto tem que ficar idêntico ao arquivo).

## 7. Regras de negócio

**Liberação das semanas**
- Semana 1: liberada ao ter acesso ao módulo.
- Semana 2: libera quando a semana 1 for concluída.
- Semana N (3 a 8): libera quando a semana N−1 for concluída **e** houver pelo menos **5 dias distintos com check-in** (estado feito ou mínimo) desde que a semana N−1 foi iniciada.
- A Trilha mostra o motivo e o contador ("5 check-ins (3/5)").
- "Semana atual" = a primeira semana liberada e não concluída.

**Check-in**
- Um registro por hábito por dia (`unique(habito_id, dia)`); mudar de estado atualiza o registro.
- Pode registrar hoje e ontem (esqueceu de marcar à noite). Dias mais antigos ficam travados.
- Hábitos ativos entram no check-in a partir da conclusão da semana 2.

**Indicadores** (sempre no fuso do usuário)
- **Previstos no período** = soma, dia a dia, dos hábitos ativos naquele dia (a partir de `criado_em`, até `removido_em`).
- **Adesão** = (check-ins feito + mínimo) ÷ previstos. Meta visual: 80%.
- **HOJE** = feitos (feito + mínimo) hoje ÷ hábitos ativos.
- **Sem falha 2x** (por usuário) = número de dias consecutivos, até ontem (hoje conta se já estiver completo), em que **nenhum** hábito ativo teve duas falhas seguidas. Falha = `nao_feito` ou ausência de registro num dia previsto. Guardar também o recorde.
- **% no horário** (depois da semana 3) = check-ins "feito" com `registrado_em` até 90 min depois de `horario` ÷ check-ins "feito" do hábito. Mostrar como estimativa.
- **Dias salvos pelo mínimo** = dias em que um hábito teve `minimo`.
- **Adesão do elo** (semana 4) = adesão do hábito encadeado nos 7 dias depois da corrente − adesão nos 7 dias antes, em pontos.

**Revisão mensal**
- Disponível 30 dias depois da conclusão da semana 8, e depois a cada 30 dias (`revisoes.proxima_em`).
- "Remover" marca `habitos.ativo = false` e grava `removido_em`.

**Lembrete (push)**
- Cron da Vercel a cada 15 min: para cada usuário com `lembrete_ativo`, se a hora local cair na janela do `lembrete_hora` e ainda houver hábitos pendentes hoje, enviar: "Check-in de hoje: X de Y feitos." Se algum hábito falhou ontem e tem `aviso_falha`: "Hoje é dia de não falhar 2x: {hábito}."
- No máximo 1 push por usuário por dia.
- iOS: Web Push só funciona com o app instalado na tela inicial (iOS 16.4 ou superior). Mostrar a dica "Instale na tela de início para receber lembretes" no Perfil quando o navegador for Safari no iOS e o app não estiver instalado.

## 8. Tipos de exercício (componentes)

Cada tipo é um componente que lê e grava `progresso_licao.respostas` e, na conclusão, aplica o efeito descrito no conteúdo.

| tipo | Campos | Validação para concluir | Efeito ao concluir |
|---|---|---|---|
| `inventario` | 5–12 itens `{texto, classificacao +/=/−}`; escolha de 1 foco | ≥ 5 completos + foco escolhido | grava o foco (usado nas semanas 2–6) |
| `identidade` | frase "Sou alguém que…" (com sugestões) + 3 evidências | frase + 3 evidências | cria 3 `habitos` ativos (check-in começa) |
| `plano_gatilho` | por hábito: horário, lugar, depois de; frase gerada ao vivo | todos completos | grava horário, lugar e âncora em `habitos` |
| `encadeamento` | âncoras (sugeridas do inventário + livre); correntes âncora → hábito | ≥ 1 corrente | grava a âncora no hábito; marca a data da corrente |
| `ambiente` | por hábito: 2 ações conforme o tipo (construir/largar) + "aplicado" | ≥ 2 ações | cria `ajustes_ambiente` |
| `versao_minima` | por hábito: texto de até 2 min | todos preenchidos | grava `versao_minima` |
| `recuperacao` | por hábito: plano "se eu falhar…" + aviso ligado/desligado | todos preenchidos | grava `plano_recuperacao`, `aviso_falha` |
| `contrato_revisao` | contrato (compromisso, consequência, testemunha, assinatura) + revisão por hábito | assinado + todos revisados | cria `revisoes` (contrato + mensal), agenda a próxima |

Textos, rótulos, placeholders e dicas: exatamente os do arquivo de conteúdo.

## 9. Integração Kiwify

- Rota `POST /api/webhooks/kiwify`.
- **Antes de implementar a lógica, confirme o formato real:** configure o webhook na Kiwify apontando para a rota, use o botão de teste da própria Kiwify, grave o payload bruto numa tabela `webhook_logs` e ajuste o parser ao que chegar. Não confie nos nomes de campo abaixo sem essa verificação.
- Formato esperado (a confirmar): status do pedido (`order_status`: pago, reembolsado, chargeback), e-mail do comprador (`Customer.email`), id do produto (`Product.product_id`) e id do pedido (`order_id`). A validação é feita por token/assinatura configurado no painel da Kiwify; confirme na documentação ou no painel qual mecanismo está em uso.
- Pago/aprovado → upsert em `acessos` (`origem='kiwify'`, `status='ativo'`, e-mail em minúsculo, `modulo_id` pelo `kiwify_product_id`).
- Reembolso ou chargeback → `status='revogado'`. Os dados do usuário não são apagados.
- Idempotência por `kiwify_order_id`. Rejeitar se a assinatura/token não bater (responder 401). Responder 200 rápido.
- Testadores: script `scripts/liberar-acesso.ts <email>` que insere `acessos` com `origem='manual'`.

## 10. PWA

- `manifest.webmanifest`: **usar o do kit de marca** (`brand-kit/app/manifest.webmanifest`: nome "Trilho", cores #1B2120, ícones 192/512/maskable). Os valores antigos ("Sistema de Hábitos", #1E2328) foram substituídos.
- Service worker: cache do shell do app, estratégia network-first para dados, e o handler de push. Offline: a tela Hoje abre com o último estado em cache e mostra "Sem conexão: o check-in será enviado quando voltar" (fila local de check-ins).

## 11. Privacidade e LGPD (mínimo)

- Página simples de Privacidade e de Termos (texto placeholder que o Diego vai revisar), com link no rodapé do login.
- Exportar meus dados (JSON) no Perfil. Pedido de exclusão de conta pelo contato de suporte (manual no MVP).
- Não coletar nada além do necessário. Sem analytics de terceiros no MVP.

## 12. Ordem de construção sugerida (marcos)

1. Projeto Next.js + Supabase + tokens/tema (Automático/Escuro/Claro) + layout com abas. **Aceite:** trocar o tema no Perfil muda tudo na hora, sem flash ao recarregar.
2. Auth por magic link + `perfis` + onboarding. **Aceite:** primeiro login leva ao onboarding; o segundo vai direto para Hoje.
3. `modulos`/`acessos` + script de liberação manual + tela "nenhum módulo liberado". **Aceite:** e-mail sem acesso não vê a trilha.
4. Seed das lições + Trilha + regra de liberação. **Aceite:** a semana 3 só libera com a 2 concluída e 5 dias de check-in.
5. Lição + os 8 exercícios com salvamento automático. **Aceite:** sair no meio e voltar mantém tudo; cada efeito da tabela da seção 8 acontece.
6. Check-in + tela Hoje + indicadores. **Aceite:** casos de teste da seção 13 passam.
7. Progresso.
8. Webhook Kiwify. **Aceite:** compra de teste libera; reembolso revoga; o mesmo pedido enviado 2x não duplica.
9. PWA + push. **Aceite:** instalado no Android e no iOS, o lembrete chega no horário configurado.
10. Exportar dados, páginas legais, polimento, deploy.

## 13. Casos de teste obrigatórios (indicadores)

Escreva testes unitários para as funções de indicador, com datas fixas no fuso `America/Sao_Paulo`:
1. 3 hábitos, 7 dias, todos feitos → adesão 100%, sem falha 2x = 7.
2. Um hábito com `nao_feito` na segunda e feito na terça → sem falha 2x não quebra.
3. Um hábito sem registro na segunda e na terça → sem falha 2x zera na terça.
4. `minimo` conta para a adesão e para os dias salvos pelo mínimo.
5. Hábito removido no dia 10 não entra nos previstos a partir do dia 10.
6. Check-in às 23h50 de Brasília conta no mesmo dia, mesmo que em UTC já seja o dia seguinte.
7. Liberação: semana 2 concluída + 4 dias de check-in → semana 3 bloqueada; com o 5º dia → liberada.

## 14. Variáveis de ambiente

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `KIWIFY_WEBHOOK_TOKEN`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (mailto), `CRON_SECRET`, `SUPORTE_EMAIL`, `URL_PAGINA_VENDA`.

## 15. Como trabalhar comigo (Diego)

- Trabalhe marco a marco (seção 12). No fim de cada marco: o que foi feito, como testar e o que ficou pendente.
- Mudança visual ou de regra que não esteja aqui: pergunte antes. O design e as regras foram decididos no projeto do claude.ai.
- Commits pequenos e descritivos, em português.
