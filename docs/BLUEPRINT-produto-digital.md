# Blueprint · App de transformação em semanas (modelo Trilho)

> Para que serve: guardar tudo o que construímos no Trilho de um jeito que dê para **repetir em outro produto trocando o tema** (sono, finanças pessoais, procrastinação, estudo, corrida…).
> Como usar: copie a seção 1 ("Prompt mestre") para a ferramenta de IA, troque as variáveis entre `{chaves}` e anexe este arquivo inteiro como referência. As seções 2 a 12 são o detalhe de como o Trilho foi feito e o que aprendemos no caminho.
> Implementação de referência: repositório `DiegoaBarboza/sistema-habitos`, site `www.trilhoapp.com.br`.

---

## 1. Prompt mestre (copiar, trocar as variáveis e colar)

```text
Você é meu conselheiro técnico e de produto. Vamos construir um app web instalável (PWA) de transformação
pessoal chamado {NOME_DO_PRODUTO}, sobre {TEMA}, para {PUBLICO}.

Formato do programa: {N_SEMANAS} semanas, uma ferramenta prática por semana. Cada semana tem uma lição curta
em 3 etapas (Entenda → Faça → Compromisso), um exercício preenchido na tela e um reflexo no check-in diário.
O usuário marca o check-in em ~10 segundos (feito / mínimo / não feito) e vê indicadores de progresso.

Base do conteúdo: {FONTES_DE_REFERENCIA} (pesquisa científica) + {LENTE_FILOSOFICA} (ex.: estoicismo),
sempre reescrito com palavras próprias, tom informal e fluido, frases que correm sem picotar em ponto e vírgula,
exemplos do dia a dia do público. Nunca copiar trechos. Cada semana termina com uma "Pergunta-chave".

Siga o blueprint anexo (BLUEPRINT-produto-digital.md) para stack, telas, dados, venda e lançamento:
Next.js (App Router) + Supabase + Tailwind, deploy na Vercel, venda pela Kiwify com webhook,
e-mail pelo Resend, domínio no Registro.br, lembrete por Web Push com pg_cron.

Marca: cores {COR_ACENTO_ESCURO}/{COR_ACENTO_CLARO}, fundo grafite no escuro e {COR_FUNDO_CLARO} no claro,
fontes IBM Plex Sans + IBM Plex Mono (ou {FONTES}). App com tema Automático/Escuro/Claro sincronizado com o perfil.

Preço: lote fundador {PRECO_LOTE_1} com {VAGAS} vagas reais, depois {PRECO_LOTE_2}. Pagamento único,
acesso vitalício ao módulo comprado. Sem escassez falsa, sem cronômetro, contador de vagas real.

Trabalhe em marcos pequenos, cada um com PR, testes e critério de aceite. Me pergunte antes de qualquer
decisão que seja minha (preço, nome, texto final). Responda em português do Brasil.
```

Variáveis usadas no Trilho, como exemplo:

| Variável | Trilho |
|---|---|
| `{NOME_DO_PRODUTO}` | Trilho (módulo 1: Hábitos) |
| `{TEMA}` | construção e abandono de hábitos |
| `{PUBLICO}` | adultos que trabalham e já tentaram mudar a rotina e pararam na 2ª semana |
| `{N_SEMANAS}` | 8 |
| `{FONTES_DE_REFERENCIA}` | pesquisas de hábito (automaticidade, intenções de implementação, ambiente, automonitoramento) |
| `{LENTE_FILOSOFICA}` | estoicismo (Sêneca, Epicteto, Marco Aurélio), em tradução própria |
| Cores | acento #3AD48C (escuro) / #0E7444 (claro); grafite #1B2120; gelo #EEF2EC (site) |
| Preço | Lote 1 Fundador R$ 47 (100 vagas) → Lote 2 R$ 97 |

---

## 2. O produto em uma frase

App web instalável que transforma métodos de mudança de comportamento em **exercícios na tela** e **indicadores de adesão**, com check-in diário de ~10 segundos. Um módulo pago por tema; a plataforma já nasce pronta para vender outros módulos.

Assinatura do Trilho: **"Hábito é processo. Processo se mede."**

## 3. Stack e serviços

| Peça | Escolha | Observação |
|---|---|---|
| Front + back | Next.js 16 (App Router, server actions) + TypeScript | `src/app`, rotas em português |
| Banco, login, RLS | Supabase (Postgres + Auth) | RLS em todas as tabelas; escrita sensível só com service role |
| Estilo | Tailwind 4 com tokens CSS (`--bg`, `--surface`, `--text`, `--accent`…) | tema por `data-theme` no `<html>` |
| Hospedagem | Vercel | plano Pro antes de vender (uso comercial) |
| Domínio | Registro.br | apex → www; DNS em "zona avançada" |
| E-mail de login | Resend como SMTP do Supabase | domínio verificado (DKIM, SPF, MX de retorno) |
| E-mail de suporte | ImprovMX (encaminha `suporte@` para o Gmail) | grátis |
| Lembrete | Web Push (VAPID) + pg_cron + pg_net chamando `/api/cron/lembretes` | protegido por `CRON_SECRET` |
| Venda | Kiwify (checkout + webhook) | `POST /api/webhooks/kiwify` |
| Imagens dinâmicas | `next/og` (ImageResponse) | frase do dia para status/feed |
| Testes | Vitest (lógica) + Playwright com Supabase local (telas) | Supabase local via Docker |

## 4. Telas e rotas

| Rota | O que faz | Acesso |
|---|---|---|
| `/` | Site de vendas (paleta gelo, sempre claro). Logado → `/hoje` | público |
| `/entrar` | E-mail + senha, ou link mágico | público |
| `/auth/confirmar` | Troca o código do link por sessão → `/criar-senha` | público |
| `/criar-senha` | Primeiro acesso (obrigatório) ou "esqueci a senha" | logado |
| `/boas-vindas` | Onboarding: Como o sistema funciona → Como usar o app (prints) → nome e horário → pronto | logado + módulo |
| `/hoje` | Frase do dia, indicadores, gráfico da semana, check-in, lição da semana | logado + módulo |
| `/semanas` | As 8 semanas com regra de liberação + módulos "em breve" | idem |
| `/licao/[id]` | Entenda → Faça → Compromisso, salvamento automático | idem |
| `/progresso` | Adesão, sem falha 2x, check-ins, versão mínima, 14 dias por hábito | idem |
| `/perfil` | Aparência, lembrete, senha, meus módulos, frases, exportar, suporte, sair; admin vê "Painel de vendas" | idem |
| `/frases` | Frases do dia já vistas, para rever e compartilhar | idem |
| `/como-funciona` | O método e o guia das telas, a qualquer momento | idem |
| `/sem-acesso` | Logado sem compra: link para comprar ou trocar de e-mail | logado |
| `/obrigado` | Pós-compra: 4 passos para entrar | público |
| `/admin` | Vendas, vagas, líquido, últimos avisos do webhook | só `ADMIN_EMAILS` |
| `/privacidade`, `/termos` | Documentos legais (LGPD, CDC) | público |
| `/api/exportar` | JSON com todos os dados do usuário | logado |
| `/api/frase/imagem` | PNG da frase do dia (status 1080×1920 ou feed 1080×1350) | logado |

Barra de abas: **Hoje · Semanas · Progresso · Perfil**.

## 5. Fluxos que importam

1. **Compra → acesso:** Kiwify aprova → webhook grava `vendas` e cria `acessos` (por e-mail, `status=ativo`, `plano=vitalicio`) → comprador vai para `/obrigado` → entra com o **mesmo e-mail da compra** → `vincular_acessos()` liga o acesso ao `user_id`.
2. **Primeiro acesso:** link mágico → criar senha → onboarding (com prints do app nos dois temas) → lição 1. Depois disso, login com e-mail e senha; "Esqueci a senha" reenvia o link.
3. **Reembolso/chargeback:** webhook marca a venda e revoga só o acesso daquele pedido (`kiwify_order_id`).
4. **Dia a dia:** lembrete push no horário escolhido (só se falta check-in) → Hoje → toque marca feito, toque longo abre mínimo/não feito.
5. **Admin:** e-mails em `ADMIN_EMAILS` (padrão `diegono@gmail.com`) veem `/admin` e têm todos os módulos ativos liberados sem compra.

## 6. Modelo de dados (Supabase)

| Tabela | Para quê |
|---|---|
| `perfis` | nome, tema (auto/escuro/claro), fuso, lembrete, onboarding_ok |
| `modulos` | catálogo (ativo / em_breve) |
| `acessos` | quem pode usar qual módulo (por e-mail e user_id), origem, status, plano, `kiwify_order_id` |
| `licoes` | conteúdo das semanas (gerado do `.md` por `npm run seed-licoes`) |
| `progresso_licao` | respostas dos exercícios e etapa |
| `habitos`, `checkins` | hábitos ativos e o registro diário |
| `ajustes_ambiente`, `revisoes` | ajustes de ambiente e revisão mensal |
| `push_inscricoes` | inscrições de notificação |
| `frases_vistas` | frase do dia já mostrada a cada usuário |
| `ofertas` | lotes (código, preço, vagas, `kiwify_product_id`, plano) |
| `vendas` | pedidos da Kiwify (bruto, líquido, status) |
| `webhook_logs` | todo aviso recebido, autenticado ou não, com o resultado |

Regras: RLS em tudo; o usuário só vê as próprias linhas; `ofertas`, `vendas` e `webhook_logs` sem política (só service role). Migrações numeradas em `supabase/migrations/`; em produção roda-se o arquivo exato no SQL Editor.

## 7. Conteúdo

- Fonte única: `docs/conteudo-modulo1-habitos.md` → seed para a tabela `licoes`.
- Estrutura de cada semana: `### Entenda` com `#### subtítulos`, citações em `> texto — Autor, *Obra*, ref`, `**Pergunta-chave:**`; `### Faça` (tipo do exercício); `### Compromisso`; `### Frases do dia` (7 frases, com `**destaque**`); `### Fontes (não aparece no app)`.
- 8 tipos de exercício no Trilho: inventário, identidade, gatilho, encadeamento, ambiente, versão mínima, rastreador/recuperação, contrato/revisão.
- Regras de texto que o dono aprovou: tom de conversa, frases que fluem (sem "acelera e freia"), explicar a origem da ideia (pesquisa + estoico), exemplos do cotidiano, nenhuma cópia de livro, citações dos estoicos em tradução própria.
- Semana 1 explica o nome (o que é um inventário) e o que é estoicismo.

## 8. Marca e temas

- Tokens nos dois temas (ver `docs/HANDOFF-marca-trilho.md` e `brand-kit/app/brand-tokens.css`), contraste AA conferido.
- App: tema Automático/Escuro/Claro. A escolha fica no **perfil** (fonte da verdade) e no `localStorage` (evita flash). **Toda tela logada sincroniza com o perfil**, inclusive as que ficam fora da barra de abas (lição, boas-vindas, criar senha, sem acesso).
- Marca nas telas: símbolo em linha que usa a cor do texto do tema, então aparece no claro e no escuro.
- Site, imagens de venda e prévia de link: sempre claros, paleta **gelo** (#EEF2EC, texto #131A17, verde #0E7444), celulares inclinados 4°.
- Frase do dia: alterna grafite (dias ímpares) e gelo (dias pares); só "DIA N" no topo.

## 9. Venda (Kiwify)

- **Lote 1 Fundador:** R$ 47, 100 vagas reais (código `trilho_fundador_47`). **Lote 2:** R$ 97. O site troca de lote sozinho quando acabam as vagas.
- Taxa Kiwify usada no painel: 8,99% + R$ 2,49 → líquido R$ 40,28 (R$ 47) e R$ 85,79 (R$ 97).
- Quem compra mantém o módulo para sempre. Plano recorrente ("Contínuo") só para módulos novos no futuro; o campo `plano` já existe.
- Variáveis na Vercel: `KIWIFY_CHECKOUT_URL`, `KIWIFY_CHECKOUT_URL_OFICIAL` (quando o lote 1 acabar), `KIWIFY_WEBHOOK_TOKEN`, `ADMIN_EMAILS`.
- Webhook: `https://www.{dominio}/api/webhooks/kiwify` (com **www**). Assinatura HMAC-SHA1 do corpo em `?signature=`. Eventos: compra aprovada, reembolso, chargeback, cancelamento. Produto ainda sem oferta cadastrada libera o acesso mesmo assim (ninguém fica sem o que pagou) e o aviso mostra o ID para cadastrar.
- Cadastrar o produto: `update ofertas set kiwify_product_id='<id do aviso real>' where codigo='trilho_fundador_47';` (o ID do botão "testar webhook" é fictício).
- Conta Kiwify: completar cadastro antes da primeira venda; verificação de documento e selfie depois da primeira venda, para liberar saque.

## 10. Operação e lançamento

Checklist completo em `docs/CHECKLIST-lancamento.md`. Em resumo:

1. Domínio + DNS (Vercel, Resend, ImprovMX).
2. Supabase: Site URL e Redirect URLs com o domínio; SMTP do Resend; templates de e-mail em português com logo.
3. Vercel: variáveis de ambiente (Production), Pro.
4. pg_cron do lembrete com o `CRON_SECRET` gerado na hora (nunca reaproveitar segredo de teste).
5. Kiwify: produto, checkout, webhook, URL do checkout no site.
6. Teste de ponta a ponta: compra com cupom → `/admin` → cadastrar produto → entrar como comprador → reembolso → acesso bloqueado → apagar cupom.
7. Antes de divulgar: revisão jurídica de Privacidade/Termos, busca do nome no INPI.

## 11. Regras de segurança

- Chaves (service role, token da Kiwify, `CRON_SECRET`, Resend, VAPID privada) só na Vercel/Supabase, nunca no chat, em print ou no código.
- `.env.local` de desenvolvimento não pode apontar para o banco de produção quando se roda seed ou teste.
- SQL destrutivo em produção só se for exatamente o arquivo de migração indicado.
- Nada de escassez falsa: contador de vagas real, sem cronômetro.

## 12. O que aprendemos (evitar na próxima)

| Problema | Causa | Como evitar |
|---|---|---|
| Link de login abria `localhost` | Site URL do Supabase não atualizada | configurar Site URL + Redirect URLs antes do primeiro teste real |
| "Muitos pedidos seguidos" no login | SMTP padrão do Supabase (limite baixíssimo) | SMTP próprio desde o início |
| Pedir e-mail toda vez que sair | só link mágico | senha opcional desde o MVP |
| Lição clara com sistema escuro | telas fora das abas não sincronizavam o tema do perfil | sincronizar o tema em toda tela logada |
| Logo sumindo no escuro | ícone com fundo grafite sobre fundo grafite | marca em linha que segue a cor do texto |
| Variável da Vercel sem efeito | faltou redeploy / "Production" desmarcado | toda mudança de env pede Redeploy |
| `CRON_SECRET` com texto de exemplo | colado o placeholder | gerar o segredo na hora e conferir o tamanho |
| Webhook "não funciona" | botão de teste da Kiwify manda dados fictícios | validar com compra real com cupom |
| Texto "picotado" | frases curtas demais | revisar com o dono semana por semana antes do seed |
