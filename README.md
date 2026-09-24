# Sistema de Hábitos

App web instalável (PWA) para profissionais técnicos: métodos de mudança de hábito viram exercícios na tela e indicadores de adesão, com check-in diário.

A especificação do MVP está em [`docs/HANDOFF-sistema-habitos.md`](docs/HANDOFF-sistema-habitos.md) e o conteúdo das lições em [`docs/conteudo-modulo1-habitos.md`](docs/conteudo-modulo1-habitos.md).

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Supabase, deploy na Vercel.

## Rodar localmente

```bash
cp .env.example .env.local   # preencha as chaves do Supabase
npm install
npm run dev
```

Abra http://localhost:3000.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript sem emitir arquivos
- `npm test`: testes unitários (Vitest)
