# Como usar este pacote

1. Crie a pasta do projeto e abra o Claude Code nela.
2. Copie para dentro dela **as pastas `docs/` e `brand-kit/`** deste pacote (mantendo os nomes). O `COMECE-AQUI.md` pode ficar na raiz.
3. Cole o prompt abaixo no Claude Code.
4. Trabalhe marco a marco. Ao fim de cada marco, teste e só então mande ele seguir.

## Prompt para colar

Você vai construir o módulo 1 do **Trilho**, um app PWA de hábitos. Dono do produto: Diego Barboza.

Leia antes de escrever código, nesta ordem:
1. `docs/HANDOFF-sistema-habitos.md`: telas, dados, regras, marcos e critérios de aceite.
2. `docs/HANDOFF-marca-trilho.md`: nome, cores, ícones e textos. **Onde houver conflito com o arquivo 1, vale este.**
3. `docs/ROADMAP-trilho.md`: módulos são dados, não código fixo. Nenhum texto, rota ou tabela pode assumir que "módulo" = "hábitos".
4. `docs/conteudo-modulo1-habitos.md`: o conteúdo das lições (o texto no app deve ficar idêntico).
5. `docs/guia-de-marca-trilho.html`: referência visual da marca (abra no navegador). Os arquivos de marca estão em `brand-kit/` (copie `brand-kit/app/` para `public/brand/`).

Regras:
- Trabalhe por marcos, na ordem do handoff (seção 12). Ao fim de cada marco, rode os critérios de aceite e me mostre o resultado antes de seguir.
- Não implemente nada além do módulo 1. Outros módulos aparecem só como cartões "EM BREVE" (Procrastinação, Sono).
- Componentes reutilizáveis desde o início: check-in (feito / mínimo / não feito), lembrete, contador, escala 0 a 10, diário com etiquetas. Só o check-in precisa ser usado agora.
- Tabelas com RLS por usuário desde o primeiro marco; exportar dados do usuário na tela Perfil.
- Nenhum texto do app cita a Zênite.
- Se uma decisão não estiver nos documentos, pergunte em vez de inventar.

Antes de codar, me responda em 5 linhas: o que entendeu do produto, quais pontos do arquivo 1 foram substituídos pelo arquivo 2, e o que ficou ambíguo.

Depois, primeira tarefa (marco 1): configurar o projeto (Next.js, Tailwind, Supabase), aplicar os tokens de `brand-kit/app/brand-tokens.css` nos dois temas com `data-theme` no `<html>`, e entregar a tela Entrar com login por link mágico. Me mostre o que ficou pronto e como testar.
