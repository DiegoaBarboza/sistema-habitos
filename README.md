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

## Banco de dados

As migrações ficam em `supabase/migrations/`, em ordem. Para aplicar no projeto da nuvem, abra o **SQL Editor** do Supabase e rode cada arquivo novo, na ordem do nome.

Configuração de Auth no painel (Authentication):
- **Sign In / Providers:** Email ligado e cadastro de novos usuários permitido.
- **URL Configuration:** Site URL = endereço do app; em Redirect URLs, `http://localhost:3000/**` e o domínio de produção.

### Carregar as lições

Depois de aplicar as migrações (e sempre que `docs/conteudo-modulo1-habitos.md` mudar):

```bash
npm run seed-licoes
```

Lê o arquivo de conteúdo e grava as 8 lições na tabela `licoes`. Pode rodar de novo sem duplicar.

### Liberar acesso manualmente (testadores)

Precisa de `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`.

```bash
npm run liberar-acesso -- email@exemplo.com
```

Vale na hora, mesmo para quem já está logado. Para revogar, no SQL Editor:
`update acessos set status = 'revogado' where email = 'email@exemplo.com';`

### Supabase local (opcional, precisa de Docker)

```bash
npx supabase start   # sobe o banco e aplica as migrações
```

Os e-mails de link mágico chegam no Mailpit (http://127.0.0.1:54324). Para usar o local, troque URL e chave no `.env.local` pelos valores que o comando mostra.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript sem emitir arquivos
- `npm test`: testes unitários (Vitest)
