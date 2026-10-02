# Roadmap do Trilho (decidido em 29/09/2026)

Dono: Diego Barboza. Contexto: `claude/HANDOFF-marca-trilho.md` (marca) e `claude/HANDOFF-sistema-habitos.md` (módulo 1).

## Direção
O Trilho é uma plataforma de desenvolvimento pessoal e bem-estar que **mede, mostra padrões e lembra**. Persuasão, Negociação e Vendas saíram do roadmap. Só o módulo 1 (Hábitos) é construído e vendido agora. Os demais ficam como roadmap interno até haver prova de que o módulo 1 retém e vende.

## Princípio de produto: medir, lembrar, registrar
O Trilho não prescreve. Ele oferece ferramentas para a pessoa se observar.
- O app **não** diz o que comer, quanto exercitar, como tratar ansiedade nem interpreta o que a pessoa registra.
- Cada módulo usa os mesmos blocos: **check-in** (feito / mínimo / não feito), **lembrete**, **contador**, **escala 0 a 10**, **diário com etiquetas**, **relatório de padrões**.
- O critério de sucesso é sempre definido pelo usuário (por exemplo, o que conta como "almoço saudável" é escolha dele).
- Diego não é nutricionista nem clínico. Os textos de cada módulo deixam isso claro.

## Ordem dos módulos (de menor para maior risco)
| # | Módulo | O que o usuário faz no app | Blocos |
|---|---|---|---|
| 1 | Hábitos | 8 semanas: inventário, gatilho, ambiente, versão mínima, regra dos 2 dias | check-in, lembrete, indicadores (em construção) |
| 2 | Procrastinação | Lista a tarefa adiada, registra o gatilho ("o que eu fiz em vez disso"), define o primeiro passo de 2 min | diário com etiquetas, check-in, relatório de padrões |
| 3 | Sono | Hora de deitar e acordar, qualidade 0 a 10, rotina noturna | escala, check-in, lembrete de hora de desligar telas |
| 3 | Água | Contador de copos ou ml por dia, meta escolhida pelo usuário | contador, lembretes ao longo do dia |
| 4 | Atividade física | Registro de sessões, versão mínima de 5 min, sequência sem falhar 2x | check-in, diário |
| 4 | Respiração | Pausas guiadas de 1 a 3 min em horários definidos, registro antes e depois (0 a 10) | lembrete, escala |
| 5 | Alimentação | Check-in por refeição ("segui o que planejei?"), lembrete de fruta entre refeições, diário do que comeu | check-in, lembrete, diário |
| 5 | Ansiedade | Registro de episódio: situação, gatilho, intensidade 0 a 10, o que fez; relatório de gatilhos e horários mais frequentes | diário com etiquetas, escala, relatório de padrões |
| extra | Energia e foco | Pausas, blocos de foco, nível de energia no dia | escala, lembrete |
| extra | Revisão semanal | Transversal: olha todos os módulos ativos e escolhe 1 ajuste | relatório, texto livre |

## Limites de saúde (Alimentação e Ansiedade)
- **Alimentação:** sem plano alimentar, sem calorias, sem lista de "pode / não pode". Só registro e lembrete.
- **Ansiedade:** o relatório mostra **o que a pessoa registrou** (gatilhos que mais aparecem, horários, dias). Não diz o que a pessoa tem, não sugere tratamento e não chama nada de diagnóstico.
- Aviso fixo nesses dois módulos: "O Trilho é uma ferramenta de registro. Não substitui médico, psicólogo ou nutricionista."
- Ansiedade: quando o usuário registrar intensidade alta (por exemplo 9 ou 10) repetidas vezes, mostrar uma mensagem neutra sugerindo conversar com um profissional e citando o CVV (188, 24 horas). [Decisão a validar: o limite de "repetidas vezes".]
- Antes de lançar esses dois módulos: revisão dos textos por um profissional da área e por advogado. Diego e este assistente não substituem isso.
- Dados de saúde são dados pessoais sensíveis na LGPD. Antes de coletar diário de ansiedade ou alimentação: política de privacidade específica, consentimento claro, exportar e apagar os dados a qualquer momento (o Perfil já prevê exportar).

## Regras de escopo
1. Um módulo por vez. O próximo só começa quando o anterior tiver usuários reais completando a semana 4 (número a definir com o Diego).
2. A ordem acima é hipótese. Se os usuários do módulo 1 pedirem outro tema com frequência, ela muda.
3. Não anunciar a plataforma inteira antes de existir o módulo 2. Nas landing pages e no Instagram, vender **Hábitos**; "outros módulos em breve" é suficiente.
4. Conteúdo sempre em palavras próprias. Livros entram só como leitura recomendada (ver `produto-sistema-habitos.md`).

## Impacto técnico (para o Claude Code)
- Módulos são **dados** (`modulos`, `acessos`), não código fixo. Nenhum texto, rota ou tabela do app deve assumir que "módulo" = "hábitos".
- Os blocos (check-in, contador, escala, diário com etiquetas, lembrete, relatório) devem ser componentes reutilizáveis desde o módulo 1, mesmo que só o check-in seja usado agora.
- A aba "Semanas" pertence ao módulo 1. Cartões "EM BREVE" em "Outros módulos": trocar Negociação e Persuasão por Procrastinação e Sono.

## Depois do MVP: "Novo ciclo" do módulo Hábitos (registrado em 02/10/2026)
- Problema: depois da semana 8 a pessoa não tem como trabalhar hábitos novos, que não estavam no inventário ou que só percebeu depois. A revisão mensal só mantém, ajusta ou remove.
- Decisão: **não** fazer um "reset" que apaga dados. O histórico (adesão, recorde de "sem falha 2x", mapa) é a prova de progresso; apagar é motivo de cancelamento.
- Proposta: botão "Novo ciclo" depois da semana 8, que **soma** ao que existe:
  - refaz o inventário e as lições de montagem (gatilho, ambiente, versão mínima) para hábitos novos;
  - os hábitos atuais continuam ativos ou são encerrados (encerrar = `removido_em`, sem apagar check-ins);
  - indicadores e Progresso continuam somando todo o histórico.
- Impacto técnico previsto: `progresso_licao` hoje tem uma linha por lição; o ciclo precisa de um número de ciclo (ou tabela `ciclos`) para guardar as respostas de cada rodada.
- Quando: desenhar quando os primeiros usuários estiverem perto da semana 8 (cerca de 2 meses depois do início dos testes), usando o que eles pedirem.

## Preço e acesso (decidido em 02/10/2026)
- Lote 1 · Fundador: R$ 47, pagamento único, 100 vagas reais (contadas pelas vendas aprovadas). Lote 2 · Oficial: R$ 97.
- **Quem compra o Lote 1 ou o Lote 2 mantém o app inteiro para sempre** (lições, check-in, indicadores, revisões, frases).
- Trilho Contínuo (R$ 19,90/mês ou R$ 147/ano) vale só para módulos novos e ofertas futuras anunciadas assim; nunca para tirar algo de quem já comprou. Campo `plano` já existe em `acessos`.

## Pendências
- **Site institucional + landing de venda em `www.trilhoapp.com.br`** (pedido em 02/10/2026).
  - Quem abre o endereço sem estar logado vê uma página sobre o app: o que é, o que faz, módulos futuros. O app continua em `/entrar`, `/hoje` etc.
  - Referência de estrutura (não de conteúdo nem de cores): https://trilho.app.br/#recursos — seções Início, Sobre, Recursos, Comunidade, chamada final, rodapé.
  - Depois: landing de venda no mesmo site; o botão "Comprar" leva ao checkout da Kiwify, e o acesso é liberado pelo webhook (Marco 8).
  - Atenção: trilho.app.br é de outro app, o **Trilhô** (trilhas ao ar livre), com app nas lojas. Conferir no INPI se o nome Trilho pode ser registrado para apps antes de investir em divulgação.
- Rodar INPI, registro.br e Instagram para o nome Trilho (Diego).
- Landing e preço (R$ 97 → R$ 35 no doc de produto) precisam ser reavaliados com o nome e a marca novos.
