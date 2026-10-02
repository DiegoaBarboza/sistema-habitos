# Checklist de lançamento · Lote Fundador

Siga na ordem. Cada etapa depende da anterior.

## 1. Kiwify: criar o produto
- Tipo: produto digital com entrega por link externo (não usar a área de membros da Kiwify).
- Nome: `Trilho · Módulo Hábitos · Lote Fundador`
- Preço: R$ 47,00, pagamento único (não é assinatura).
- Pagamento: Pix e cartão (boleto opcional: libera em até 3 dias úteis). Parcelamento até 12x com juros pro comprador.
- Garantia: 7 dias.
- E-mail de suporte: `suporte@trilhoapp.com.br`
- Página de obrigado: `https://www.trilhoapp.com.br/obrigado`
- Link de acesso (se pedir): `https://www.trilhoapp.com.br/entrar`
- Imagem do produto: `docs/kiwify/kiwify-capa-produto.png`
- Banner do checkout (se houver o campo): `docs/kiwify/kiwify-banner-checkout.png`
- Não ativar cronômetro nem "últimas vagas" falsos no checkout.
- Descrição:
  > O Trilho é um app pra você construir hábitos de verdade em 8 semanas. Toda semana libera uma ferramenta nova, com uma lição curta, um exercício na tela e o check-in diário, e os seus indicadores mostram o seu progresso. Lote Fundador: pagamento único e acesso vitalício. Depois da compra, entre em trilhoapp.com.br/entrar com o mesmo e-mail que você usou aqui.
- Copie o **link do checkout** (começa com `https://pay.kiwify.com.br/`).

## 2. Kiwify: webhook
- Apps / Integrações → Webhooks → Criar.
- URL: `https://www.trilhoapp.com.br/api/webhooks/kiwify`
- Produto: o Trilho.
- Eventos: compra aprovada, reembolso, chargeback, assinatura cancelada (se existir).
- Copie o **token** (não mandar no chat).

## 3. Vercel: variáveis (Settings → Environment Variables)
| Nome | Valor |
|---|---|
| `KIWIFY_WEBHOOK_TOKEN` | token do passo 2 |
| `KIWIFY_CHECKOUT_URL` | link do checkout do passo 1 |
| `ADMIN_EMAILS` | `diegono@gmail.com` |

## 4. GitHub: merge
- Fazer o merge da PR #8.
- Vercel → Deployments → ⋯ → Redeploy (pra ler as variáveis novas). Esperar "Ready".

## 5. Supabase: tabela de vendas
- SQL Editor → colar todo o conteúdo de `supabase/migrations/20261002000009_vendas_kiwify.sql` → Run.

## 6. Conferir o site
- Abrir `www.trilhoapp.com.br` sem estar logado (aba anônima).
- O botão deve mostrar "Garantir minha vaga · R$ 47" e "restam 100 de 100 vagas".

## 7. Compra de teste
1. Comprar com `diegono+compra1@gmail.com`, no Pix.
2. Abrir `www.trilhoapp.com.br/admin` logado com o seu e-mail.
3. Em "Últimos avisos da Kiwify" deve aparecer: `liberado habitos … (produto sem oferta cadastrada: CÓDIGO)`.
4. No SQL Editor, rodar (trocando CÓDIGO):
   `update ofertas set kiwify_product_id = 'CÓDIGO' where codigo = 'trilho_fundador_47';`
5. Entrar no app com o e-mail de teste e conferir o acesso.
6. Pedir o reembolso na Kiwify e conferir no /admin que o acesso foi bloqueado.
7. Se aparecer "recusado" ou "erro" no /admin: mandar print pro Claude.

## 8. Antes de divulgar
- Vercel → plano Pro (o grátis proíbe uso comercial).
- Revisão jurídica de Privacidade e Termos (antes de escalar as vendas).
