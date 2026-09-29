# Atualização do HANDOFF · Marca Trilho

> Para o Claude Code. Este arquivo complementa `HANDOFF-sistema-habitos.md`. Onde houver conflito, vale este arquivo. Não muda regra de negócio, dados nem telas: muda nome, cores, ícones e alguns textos.
> Dono do produto: Diego Barboza. O Trilho é um projeto separado da Zênite Robótica: nenhum texto, ícone ou e-mail do app deve citar a Zênite.

## 1. Nome e assinatura

- Produto (plataforma): **Trilho**. Módulo 1: **Hábitos**. "Sistema de Hábitos" era nome provisório e sai do app.
- Assinatura oficial: **"Hábito é processo. Processo se mede."** (já é o título da tela Entrar).
- Grafia: sempre "Trilho", com T maiúsculo em texto corrido; o logotipo é em minúsculas ("trilho"). Nunca "Trilhos" nem "TRILHO" fora dos rótulos em mono.

## 2. Substituições de texto (fazer todas)

| Onde | Antes | Depois |
|---|---|---|
| Seção 2, item 5 | "Trilha das 8 semanas com regra de liberação" | "Tela Semanas (as 8 semanas) com regra de liberação" |
| Seção 4, barra de abas | Hoje · Trilha · Progresso · Perfil | Hoje · **Semanas** · Progresso · Perfil |
| Seção 4.4, título e rota | "4.4 Trilha", rota de trilha | "4.4 Semanas", rota `/semanas`. Ícone sugerido (Lucide): `calendar-days` |
| Seção 4.1, rótulo em mono | "SISTEMA DE HÁBITOS" | "TRILHO" |
| Seção 4.1, marca | quadrado de 56 px com o ícone em cor de acento | `public/brand/icon.svg` a 56 px (quadrado escuro com o símbolo) |
| Seção 7, regras de liberação | "A Trilha mostra o motivo e o contador" | "A tela Semanas mostra o motivo e o contador" |
| Seção 10, manifest | nome "Sistema de Hábitos", curto "Hábitos", cor #1E2328 | nome "Trilho", curto "Trilho", cor #1B2120 (ver seção 5 abaixo) |
| Seção 12, marco 4 | "Seed das lições + Trilha + regra de liberação" | "Seed das lições + Semanas + regra de liberação" |
| `conteudo-modulo1-habitos.md`, semana 1, Compromisso | "fica com destaque na Trilha" | "fica com destaque em Semanas" |
| `<title>`, meta og:site_name, remetente do e-mail do magic link | qualquer nome antigo | "Trilho" |

Busque por `Trilha` e `Sistema de Hábitos` nos dois arquivos e no código. "Trilha" só pode sobrar em texto que fala de trilha no sentido comum, nunca como nome de tela.

## 3. Tokens (substitui a tabela da seção 5)

Arquivo pronto: `brand-tokens.css` (copiar para o estilo global). Mesmos nomes de token, valores novos. A regra do tema (`data-theme` no `<html>`, Automático via `prefers-color-scheme`, sem flash) não muda.

| Token | Escuro | Claro | Uso |
|---|---|---|---|
| `--bg` | #1B2120 | #F1F4F2 | fundo da página |
| `--surface` | #232A29 | #FFFFFF | cartões |
| `--line` | #333C3A | #D3DCD8 | bordas, divisórias |
| `--text` | #F0F4F2 | #131A17 | texto principal |
| `--text-2` | #9DABA6 | #52605A | texto secundário |
| `--accent` | #3AD48C | #0E7444 | acento, ativo, feito |
| `--on-accent` | #0B1A13 | #FFFFFF | texto sobre acento |
| `--accent-mid` | #2A8A61 | #52A47C | "mínimo", barras passadas |
| `--warn` | #F2A93B | #9A5000 | pendente, alerta, sair |
| `--success` | = `--accent` | = `--accent` | lição concluída |
| `--nav` | #171C1B | #FFFFFF | barra de abas e cabeçalhos |
| `--input` | #171C1B | #FFFFFF | fundo de campos |
| `--track` | #333C3A | #D3DCD8 | trilho de barras vazias |

Mudanças em relação à versão anterior:
- O acento deixa de ser o ciano da Zênite (#37C0E0 / #0A7390) e passa a verde-sinal.
- `--success` agora aponta para `--accent`. Motivo: com acento verde, um segundo verde para "concluída" ficaria quase igual e criaria dois tokens para a mesma ideia.
- Os neutros ganharam um leve tom verde (antes eram azul-grafite). Fundo escuro #1E2328 → #1B2120.
- `--warn` escuro continua #F2A93B; no claro passou de #A35604 para #9A5000 (maior contraste sobre o novo fundo).
- Todos os usos literais dos hex antigos devem sumir do código: `grep -ri "37C0E0\|0A7390\|2A7F94\|7FB5C6\|1E2328"` precisa voltar vazio.

Contraste WCAG (calculado, texto AA = 4,5:1; elementos gráficos = 3:1):

| Par | Mínimo | Escuro | Claro |
|---|---|---|---|
| Texto principal sobre fundo | 4.5:1 | 14.73:1 | 15.96:1 |
| Texto principal sobre cartão | 4.5:1 | 13.19:1 | 17.68:1 |
| Texto secundário sobre fundo | 4.5:1 | 6.86:1 | 5.96:1 |
| Texto secundário sobre cartão | 4.5:1 | 6.14:1 | 6.60:1 |
| Acento (texto, ícone ativo) sobre fundo | 4.5:1 | 8.54:1 | 5.27:1 |
| Acento sobre cartão | 4.5:1 | 7.65:1 | 5.83:1 |
| Texto sobre botão de acento | 4.5:1 | 9.37:1 | 5.83:1 |
| Alerta (pendente) sobre fundo | 4.5:1 | 8.18:1 | 5.38:1 |
| Alerta sobre cartão | 4.5:1 | 7.33:1 | 5.96:1 |
| Acento intermediário (mínimo) sobre cartão, não texto | 3.0:1 | 3.42:1 | 3.02:1 |

Regra de acessibilidade que já vale: nunca depender só de cor para estado. Feito, mínimo e pendente já se distinguem por forma no spec (check, borda tracejada). Mantenha.

Mapeamento Tailwind (v3, `tailwind.config`):

```js
colors: {
  bg: 'var(--bg)', surface: 'var(--surface)', line: 'var(--line)',
  text: 'var(--text)', 'text-2': 'var(--text-2)',
  accent: 'var(--accent)', 'on-accent': 'var(--on-accent)', 'accent-mid': 'var(--accent-mid)',
  warn: 'var(--warn)', success: 'var(--success)', nav: 'var(--nav)', input: 'var(--input)', track: 'var(--track)',
}
```

## 4. Arquivos de marca

Copiar a pasta `app/` deste kit para `public/brand/` (renomeando apenas se o projeto já tiver convenção):

| Arquivo | Uso |
|---|---|
| `icon.svg` | marca da tela Entrar (56 px) e ícone "any" vetorial |
| `favicon.svg`, `favicon.ico` | aba do navegador (versão compacta, legível em 16 px) |
| `icon-192.png`, `icon-512.png` | manifest, purpose `any` |
| `icon-maskable-512.png` | manifest, purpose `maskable` (símbolo dentro da zona segura) |
| `apple-touch-icon.png` (180 px) | ícone do iOS na tela de início, sem transparência |
| `manifest.webmanifest` | modelo do manifest (raiz do site, ajustar `start_url` se preciso) |

Logotipos completos (`logo/`) só entram no app se uma tela nova pedir; hoje o spec usa apenas o ícone na tela Entrar. Não colocar logotipo nas telas internas.

Tags do `<head>` (ou equivalente na API de metadata do Next.js):

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/brand/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#1B2120" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F1F4F2" media="(prefers-color-scheme: light)">
```

## 5. PWA (seção 10)

Usar `manifest.webmanifest` deste kit. Valores: `name` e `short_name` "Trilho", `theme_color` e `background_color` #1B2120, três ícones (192, 512, maskable 512).

## 6. Critérios de aceite

1. Trocar o tema no Perfil muda todos os tokens na hora e sem flash ao recarregar (mesmo critério do marco 1).
2. `grep` dos hex antigos (seção 3) volta vazio.
3. Nenhuma tela mostra "Trilha" como nome de aba ou de tela; a aba é "Semanas".
4. Lighthouse (PWA) reconhece os ícones 192, 512 e maskable; instalado no Android, o ícone não é cortado.
5. No iOS, o ícone na tela de início mostra o quadrado escuro com o símbolo, sem borda branca.
6. Estados de "feito", "mínimo" e "concluída" continuam distintos entre si nos dois temas.

## 7. Decisões do Diego (aprovadas em 29/09/2026)

- **Célula "mínimo" com metade da altura preenchida** (aprovado). No mapa de 14 dias e no gráfico semanal, "feito" = célula cheia em `--accent`; "mínimo" = célula com a metade inferior preenchida em `--accent-mid` e a metade superior vazia (borda `--line`); "pendente" continua com a forma e a cor de `--warn` do spec. Assim o estado não depende só da luminosidade do verde. Incluir na legenda e no critério de aceite 6.
- **Titular da marca:** Diego Barboza, pessoa física. Publica e registra a marca (INPI, domínio, Instagram) em nome próprio. Nenhum texto do app cita a Zênite.
- **Escopo dos módulos:** o Trilho é uma plataforma de desenvolvimento pessoal e bem-estar. Persuasão e Vendas saíram do roadmap. Hábitos é o módulo 1; a ordem dos próximos ainda será definida. Não implementar nada além do módulo 1 agora, mas não amarrar o nome, o esquema de dados ou a navegação a "hábitos".
- **Cartões "Outros módulos" (tela Semanas):** trocar "Negociação" e "Persuasão com ética" por "Procrastinação" e "Sono" (status `em_breve` na tabela `modulos`). Detalhes e ordem completa em `claude/ROADMAP-trilho.md`.
