# Conteúdo · Módulo 1 · Hábitos (v1)

Sistema de Hábitos para Profissionais Técnicos · 8 semanas, 1 ferramenta por semana.

Regra de conteúdo: pontos-chave das obras de referência reescritos com palavras, exemplos e opiniões próprias, focados na rotina técnica (projeto, obra, fábrica, campo, venda técnica). Nenhum trecho, exemplo ou estrutura de capítulo copiado. Referência citada só em "Para ir além".

Cada lição tem 3 etapas no app: **Entenda** (até 3 min de leitura) → **Faça** (exercício na tela) → **Compromisso** (o que entra no check-in diário). O campo `exercicio.tipo` diz qual componente o app renderiza.

---

## Semana 1 · Inventário de hábitos

- `id`: `habitos-s1` · duração: 10 min · `exercicio.tipo`: `inventario`

### Entenda
**Título:** Você não melhora o que não enxerga

#### O que é um inventário

Inventário é a palavra que o comércio usa pra contar tudo o que tem no estoque. Antes de comprar, vender ou arrumar qualquer coisa, o dono da loja precisa saber o que já tem nas prateleiras. Por isso a contagem vem sempre primeiro.

Com a sua rotina acontece igual: antes de criar um hábito novo ou largar um antigo, você precisa saber o que já tá rolando no seu dia. É isso que a gente vai fazer nesta primeira semana.

#### O piloto automático

Um grupo de psicólogos americanos pediu pra voluntários anotarem, de hora em hora, o que estavam fazendo e pensando. Resultado: cerca de 40% do que a gente faz se repete todo dia, no mesmo lugar e do mesmo jeito, com a cabeça em outro planeta. Quase metade do seu dia roda no automático. E é justamente essa metade que a gente nunca para pra olhar.

Isso não é defeito. É economia de energia. O cérebro transforma em rotina tudo o que se repete pra liberar espaço pros perrengues novos. O problema? Ele não é crítico de conteúdo. Rolar o feed do celular ao acordar entra no pacote com a mesma facilidade que beber água. Pra ele, repetiu, virou padrão.

Tem mais: o automático não cobra só tempo, cobra atenção. Enquanto ele toca o dia, você mal percebe as pequenas escolhas que vão empurrando a sua rotina pra um lado ou pro outro. Por isso tanta gente chega no fim do dia sem saber direito pra onde as horas foram.

Uma revisão de 138 estudos chegou numa conclusão simples: quem monitora o próprio progresso tem mais chance de chegar aonde quer. E a chance sobe quando o registro é escrito. Observar já é o começo da mudança.

#### Um pouco de estoicismo

Nas próximas semanas você vai trombar com ideias de uma escola de filosofia que combina demais com hábitos: o estoicismo. Ela nasceu na Grécia, por volta do ano 300 a.C., mas ficou famosa com três romanos de vidas bem diferentes.

Sêneca foi escritor, riquíssimo e conselheiro do imperador Nero. Escreveu dezenas de cartas pra um amigo ensinando a viver com mais propósito. Epicteto nasceu escravo, conquistou a liberdade e virou um dos professores mais respeitados de Roma. Marco Aurélio foi imperador e, entre guerras e epidemias, escrevia à noite anotações só pra si mesmo. Hoje elas são conhecidas como *Meditações*.

A ideia que une os três é separar o que depende de você do que não depende. Você não controla o trânsito, a opinião alheia ou se vai passar na entrevista. Mas controla como se prepara, como reage e o que faz logo depois. Pra eles, a vida melhora quando a gente coloca energia no que tá ao alcance. E isso não era teoria, era treino diário. Um dos exercícios? Rever o próprio dia antes de dormir. Por isso eles cabem tão bem num app de hábitos.

#### O que Sêneca diria do seu inventário

> Grande parte da vida nos escapa enquanto fazemos outra coisa. — Sêneca, *Cartas a Lucílio*, 1

Essa frase abre a primeira carta que Sêneca escreveu pro amigo Lucílio. Ele falava do tempo que vaza sem a gente ver, e é exatamente isso que o seu inventário vai mostrar. Os vinte minutos de rede social na cama, o almoço engolido na frente do computador, o e-mail que você responde às dez da noite só pra "adiantar"… Sozinhos, parecem nada. Somados, viram meses de vida por ano.

#### Na prática

Um hábito não é bom nem ruim por si só. Ele ajuda ou atrapalha conforme o resultado que você quer. Um café às três da tarde pode ser a pausa que salva a produtividade de quem treina cedo. Pra quem tem insônia, é sabotagem. Contexto manda.

Por isso, no exercício, você não vai julgar. Vai só classificar cada hábito como algo que ajuda, que é neutro ou que atrapalha.

Faça como numa auditoria: anote o que acontece de verdade, não o que deveria acontecer. Comece pelo momento em que você acorda e siga até a hora de dormir. Ajuda dividir o dia em três: manhã, horário de trabalho e noite.

Não lembrou de tudo agora? Normal. Comece com cinco hábitos, observe o seu dia por mais três dias e volte aqui pra completar a lista. Começar pequeno aumenta a chance de você realmente fazer.

#### O erro mais comum

O erro mais comum é ser vago. "Comer mal" não diz nada. Mas "beliscar biscoito às quatro da tarde na frente do computador" mostra o quê, quando e onde. É com essa informação que você vai trabalhar nas próximas semanas.

O segundo erro é anotar só o que quer mudar. Os hábitos que ajudam também entram na lista. Eles são a base que você vai usar pra construir os próximos.

**Pergunta-teste (caixa de destaque):** isso me aproxima ou me afasta do resultado que eu quero daqui a um ano?

### Faça
- Instrução: "Liste pelo menos 5 hábitos da sua rotina e marque cada um: + ajuda · = neutro · − atrapalha."
- Campos: lista de 5 a 12 itens `{texto (até 80 caracteres), classificacao: '+' | '=' | '-'}`. Começa com 5 linhas; botão "+ Adicionar outro hábito" até 12.
- Placeholders: "checar o celular ao acordar", "revisar a agenda depois do café", "almoçar na frente do computador", "caminhar depois do expediente", "responder e-mail à noite".
- Validação: mínimo 5 itens com texto e classificação.
- Resultado mostrado: barra de diagnóstico com contagem de + / = / −.

### Compromisso
- "Escolha 1 hábito para trabalhar nas próximas semanas." Opções: os itens marcados com −. Se não houver nenhum −, os itens marcados com +, com o texto "Nenhum atrapalha? Escolha um + para fortalecer."
- Efeito no sistema: o hábito escolhido vira o **hábito-foco** (fica com destaque em Semanas e entra nos exercícios das semanas 3 a 6).
- Check-in desta semana: nenhum hábito novo ainda. O check-in começa na semana 2.

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.


### Frases do dia
1. Grande parte da vida escapa **enquanto fazemos outra coisa.** — Sêneca, Cartas a Lucílio, 1
2. Você não muda **o que não enxerga.**
3. Não recebemos uma vida curta, **nós a tornamos curta.** — Sêneca, Sobre a brevidade da vida, 1
4. Anote o que acontece, **não o que deveria acontecer.**
5. Todo hábito se mantém e cresce **pelas ações que o alimentam.** — Epicteto, Discursos, II.18
6. Um hábito não é bom nem ruim. **Ele aproxima ou afasta você do que quer.**
7. Tome posse de si mesmo **e do seu tempo.** — Sêneca, Cartas a Lucílio, 1

### Fontes (não aparece no app)
- Wood, Quinn e Kashy (2002), *Habits in everyday life*, Journal of Personality and Social Psychology: cerca de 43% das ações diárias são repetidas no mesmo contexto, com a atenção em outra coisa.
- Harkin et al. (2016), metanálise de 138 estudos no Psychological Bulletin: monitorar o progresso aumenta a chance de atingir metas, e o efeito é maior quando o registro é físico ou escrito.
- Sêneca, *Cartas a Lucílio*, 1.1 (tradução nossa do latim).

---

## Semana 2 · Identidade-alvo

- `id`: `habitos-s2` · duração: 10 min · `exercicio.tipo`: `identidade`

### Entenda
**Título:** Meta diz o que você quer. Identidade diz quem faz.

#### O que é identidade-alvo

Identidade é a resposta pra pergunta "quem eu sou?". Alvo é pra onde você mira. Juntando as duas, identidade-alvo é a pessoa que você quer virar, escrita numa frase curta: "sou alguém que cumpre o que planeja", "sou alguém que cuida da própria saúde".

Parece frase de efeito, mas tem uma razão prática por trás. E é essa razão que vai segurar os seus hábitos quando a motivação for embora.

#### Por que meta sozinha não segura

Meta tem prazo e acaba. Bateu a meta, o comportamento volta a ser o que era. Quem trabalha com projeto conhece bem: o indicador melhora enquanto alguém cobra e piora no mês em que a auditoria vai embora.

Hábito que dura nasce de outra pergunta. Não é "o que eu quero alcançar?", é "que tipo de pessoa eu quero ser?". A meta é a linha de chegada. A identidade é o jeito que você corre, e ela não acaba quando a corrida termina.

#### A gente descobre quem é olhando o que faz

Nos anos 70, um psicólogo chamado Daryl Bem propôs uma ideia que parece invertida: a gente não age de acordo com quem acha que é. A gente descobre quem é observando como age. Igual a gente faz com os outros, só que olhando pra si mesmo.

Na prática, isso significa que cada vez que você faz a ação pequena, você junta uma prova de que é aquela pessoa. Uma prova não convence ninguém. Trinta provas mudam a forma como você se enxerga.

E trinta é pouco. Uma pesquisa da University College London acompanhou pessoas criando um hábito novo e viu que, em média, foram 66 dias até a ação ficar automática. Teve gente que levou 18 dias, teve gente que levou mais de 200. O detalhe que mais importa: falhar um dia aqui e outro ali não atrapalhou o resultado final. Guarda isso, porque vai voltar nas próximas semanas.

#### O que Epicteto diria

> Primeiro diga a si mesmo quem você quer ser; depois, faça o que isso exige. — Epicteto, *Discursos*, III.23

Epicteto dava aula pra jovens que queriam parecer filósofos: barba comprida, discurso bonito, nenhuma prática. A bronca dele era essa ordem aí. Primeiro decida quem você quer ser. Depois, faça o que essa pessoa faria. Não o contrário, e nunca só a primeira parte.

#### Na prática

Você não "quer ler mais". Você é alguém que se mantém atualizado. E alguém que se mantém atualizado lê duas páginas técnicas por dia, inclusive nos dias corridos.

Repara na diferença. "Quero ler mais" não diz quando, nem quanto, nem como saber se deu certo. "Sou alguém que se mantém atualizado" puxa uma ação pequena que dá pra conferir com sim ou não no fim do dia. É isso que você vai montar no exercício: uma frase de identidade e três ações pequenas que provam essa frase todo dia.

A partir de hoje, essas três ações viram o seu check-in. Leva dez segundos por dia.

#### O erro mais comum

O erro mais comum é escolher evidências grandes demais. "Treinar uma hora" é ótimo no primeiro dia e impossível na semana do fechamento. Evidência boa cabe em dois minutos e continua possível no seu pior dia.

O segundo erro é escolher uma identidade que não é sua. Se a frase não te dá vontade nenhuma, ela não vai segurar nada. Escolha uma pessoa que você teria orgulho de ser, não uma que alguém espera que você seja.

**Pergunta-teste:** o que uma pessoa com essa identidade faria hoje, em 2 minutos?

### Faça
- Campo 1: frase de identidade no formato "Sou alguém que ___" (até 80 caracteres). Sugestões clicáveis que preenchem o campo: "cumpre o que planeja", "se mantém atualizado", "cuida da própria saúde", "chega preparado às reuniões", "termina o que começa".
- Campo 2: 3 evidências diárias, cada uma uma ação pequena e observável (até 60 caracteres). Placeholders: "revisar a agenda do dia", "ler 2 páginas técnicas", "caminhar 15 minutos".
- Validação: frase preenchida e 3 evidências com texto.
- Dica embaixo dos campos: "Evidência boa cabe em 2 minutos e dá para responder com sim ou não."

### Compromisso
- As 3 evidências viram os **hábitos ativos** do check-in diário, a partir de hoje.
- O hábito-foco da semana 1 aparece como sugestão: "Quer que uma das evidências seja a troca do seu hábito-foco?"
- Indicador que nasce aqui: **adesão** (check-ins feitos ÷ previstos) e **sem falha 2x**.

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.

### Frases do dia
1. Primeiro diga a si mesmo quem você quer ser; **depois, faça o que isso exige.** — Epicteto, Discursos, III.23
2. Cada ação pequena **é uma prova de quem você está virando.**
3. Pare de discutir como deve ser uma pessoa boa. **Seja uma.** — Marco Aurélio, Meditações, X.16
4. Meta acaba quando você chega. **Identidade continua no dia seguinte.**
5. Não diga que é filósofo. **Mostre com o que você faz.** — Epicteto, Manual, 46
6. Uma vez não prova nada. **Trinta vezes mudam quem você é.**
7. Pequeno e todo dia **vale mais que grande e de vez em quando.**

### Fontes (não aparece no app)
- Bem (1972), *Self-perception theory*, Advances in Experimental Social Psychology.
- Lally et al. (2009), *How are habits formed*, European Journal of Social Psychology: mediana de 66 dias até a automaticidade (de 18 a 254); falhar um dia isolado não afetou o processo.
- Epicteto, *Discursos* III.23.1 e *Manual* 46; Marco Aurélio, *Meditações* X.16 (traduções nossas do grego).

---

## Semana 3 · Plano de gatilho

- `id`: `habitos-s3` · duração: 10 min · `exercicio.tipo`: `plano_gatilho`

### Entenda
**Título:** "Vou tentar" não é plano

#### O que é um plano de gatilho

Gatilho é o que dispara alguma coisa. No seu dia, gatilho é aquilo que já acontece sozinho e pode puxar o hábito novo: o primeiro café, sentar no carro, fechar o notebook. Plano de gatilho é decidir antes, por escrito, em que momento o hábito vai acontecer.

Parece burocracia. É o contrário: é o que tira a burocracia da sua cabeça na hora H.

#### Por que "vou tentar" não funciona

Na obra ninguém escreve "vamos concretar quando der". Tem data, hora, equipe e sequência. Com hábito, a maioria das pessoas fica no "vou tentar ler mais" e depois culpa a falta de força de vontade.

O que falta não é vontade, é especificação. Sem um momento definido, cada dia vira uma nova negociação com você mesmo. E essa negociação costuma terminar em "amanhã eu faço".

#### O que a pesquisa diz

O psicólogo alemão Peter Gollwitzer passou anos estudando um tipo de plano bem simples, no formato "quando acontecer X, eu faço Y". Uma revisão de 94 estudos mostrou que quem escreve o plano desse jeito cumpre o que se propôs bem mais do que quem só tem a intenção.

Um exemplo de fora do laboratório: uma empresa americana mandou o convite da vacina da gripe pros funcionários. Parte deles recebeu só o aviso. A outra parte recebeu um espaço pra anotar o dia e o horário em que iria se vacinar. Só anotar já fez mais gente ir.

O motivo é que o plano transfere a decisão pro ambiente. Quando o gatilho aparece, o cérebro já sabe o que vem depois. Você não precisa lembrar nem se convencer, só executar.

#### O que Marco Aurélio diria

> Ao começar o dia, diga a si mesmo o que vai encontrar pela frente. — Marco Aurélio, *Meditações*, II.1

Marco Aurélio abria o dia avisando a si mesmo que ia encontrar gente difícil, ingrata e apressada. Não era pessimismo, era preparo. Quem decide antes como vai reagir não é pego de surpresa. Com hábito é igual: quem decide antes quando vai fazer não precisa decidir na hora, que é justamente quando o cansaço e a preguiça estão mais fortes.

#### Na prática

Uma frase resolve: "Às [hora], em [lugar], depois de [ação que já acontece], eu vou [hábito]."

Fica assim: "Às 7h30, na mesa do escritório, depois de servir o primeiro café, eu vou revisar a agenda do dia." Repara que o café já acontece todo dia, sem esforço nenhum. Ele vira a ponte pro hábito novo.

No exercício, você vai montar essa frase pra cada um dos seus três hábitos. O horário vai aparecer no seu check-in, e o app vai começar a medir quantas vezes você fez no horário planejado.

#### O erro mais comum

O erro mais comum é escolher um gatilho que não acontece todo dia. "Depois da academia" não serve se você vai à academia três vezes por semana. O gatilho bom é aquele que acontece até no domingo.

O segundo erro é escolher um gatilho vago, como "de manhã" ou "quando tiver um tempo". Manhã tem quatro horas, e tempo livre não aparece sozinho. Quanto mais concreto o gatilho, menos espaço pra negociação.

**Pergunta-teste:** se alguém lesse o seu plano, saberia exatamente quando e onde conferir se você fez?

### Faça
- Para cada hábito ativo (os 3 da semana 2), um cartão com os campos: **horário** (seletor de hora), **lugar** (texto curto: "na mesa do escritório"), **depois de** (texto curto: "servir o primeiro café").
- Frase gerada ao vivo embaixo do cartão: "Às 07:30, na mesa do escritório, depois de servir o primeiro café, eu vou revisar a agenda do dia."
- Validação: os 3 cartões completos.

### Compromisso
- O horário de cada hábito passa a aparecer no check-in (linha secundária do cartão, ex.: "07:30 · na mesa").
- Indicador que nasce aqui: **% no horário** = check-ins "feito" registrados até 90 min depois do horário planejado ÷ check-ins "feito". É uma estimativa, e a tela deve dizer isso.

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.

### Frases do dia
1. Ao começar o dia, diga a si mesmo **o que vai encontrar pela frente.** — Marco Aurélio, Meditações, II.1
2. "Vou tentar" **não é plano.**
3. Decida antes. **Na hora, só execute.**
4. Quando for fazer algo, **lembre antes como aquilo costuma ser.** — Epicteto, Manual, 4
5. Hora, lugar e gatilho. **O resto é negociação.**
6. Nenhum vento ajuda **quem não sabe pra que porto vai.** — Sêneca, Cartas a Lucílio, 71
7. Sem plano, todo dia vira **uma nova negociação com você mesmo.**

### Fontes (não aparece no app)
- Gollwitzer e Sheeran (2006), metanálise de 94 estudos sobre intenções de implementação, Advances in Experimental Social Psychology.
- Milkman et al. (2011), *Using implementation intentions prompts to enhance influenza vaccination rates*, PNAS.
- Marco Aurélio, *Meditações* II.1; Epicteto, *Manual* 4; Sêneca, *Cartas a Lucílio* 71.3 (traduções nossas).

---

## Semana 4 · Encadeamento

- `id`: `habitos-s4` · duração: 5 min · `exercicio.tipo`: `encadeamento`

### Entenda
**Título:** Pendure o novo no que já funciona

Você já tem dezenas de rotinas que rodam sozinhas: ligar o notebook, estacionar o carro, fechar a última reunião do dia. Elas são âncoras confiáveis, porque acontecem todo dia sem esforço.

Encadear é usar essas âncoras como gatilho: "depois de X, eu faço Y". É o mesmo princípio de uma sequência de automação. A etapa seguinte só começa quando a anterior termina, e ninguém precisa lembrar de dar a partida.

A âncora tem que ter a mesma frequência do hábito novo e acontecer num lugar em que o hábito novo seja possível. "Depois de estacionar, eu caminho 15 minutos" funciona. "Depois de estacionar, eu leio 2 páginas" provavelmente não.

**Pergunta-teste:** essa âncora acontece todo dia, no mesmo lugar em que o hábito novo pode acontecer?

### Faça
- Passo 1: selecione de 3 a 5 âncoras. Sugestões vêm do inventário da semana 1 (itens + e =), mais o campo livre "Outra ação que já faço todo dia".
- Passo 2: monte de 1 a 3 correntes no formato "Depois de [âncora] → eu vou [hábito ativo ou novo]". Os campos são dois seletores: âncora e hábito.
- Resultado: lista visual das correntes, com seta entre os elos.
- Validação: pelo menos 1 corrente.

### Compromisso
- A âncora aparece no cartão do check-in ("depois de estacionar").
- Indicador: **adesão do elo** = adesão do hábito encadeado nos dias depois da criação da corrente, comparada aos 7 dias anteriores (mostrar "+X pontos" ou "−X pontos").

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.

---

## Semana 5 · Projeto de ambiente

- `id`: `habitos-s5` · duração: 6 min · `exercicio.tipo`: `ambiente`

### Entenda
**Título:** O layout decide antes de você

Todo engenheiro de processo sabe: se a ferramenta está a três passos, o operador improvisa. Se está na mão, ele usa. Comportamento acompanha o arranjo físico muito mais do que acompanha a intenção.

Em casa e no escritório vale a mesma lógica. O que está visível e próximo acontece. O que exige passos extras deixa de acontecer. Então você não briga com a força de vontade, você reorganiza o posto de trabalho.

Duas alavancas para o hábito que você quer: **deixar à vista** e **tirar passos**. Duas para o que você quer largar: **esconder o gatilho** e **colocar passos**.

**Pergunta-teste:** o que eu mudaria nesse ambiente se ele fosse um posto de trabalho que precisa bater meta?

### Faça
- Para cada hábito ativo, e para o hábito-foco se ele for um −, um cartão com 2 campos de ação (até 80 caracteres), com rótulos que mudam conforme o tipo:
  - Hábito a construir: "Deixar à vista:" (ex.: "livro técnico em cima do teclado") e "Tirar passos:" (ex.: "tênis separado na porta").
  - Hábito a largar: "Esconder o gatilho:" (ex.: "celular carregando fora do quarto") e "Colocar passos:" (ex.: "sair do app de vídeo no celular").
- Cada ação tem um checkbox "Aplicado".
- Validação: pelo menos 2 ações escritas no total.

### Compromisso
- Ações não marcadas como aplicadas aparecem na tela Hoje como lembrete, até serem marcadas ("2 ajustes de ambiente pendentes").
- Indicador: **ajustes aplicados** (aplicados ÷ escritos).

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.

---

## Semana 6 · Versão mínima

- `id`: `habitos-s6` · duração: 5 min · `exercicio.tipo`: `versao_minima`

### Entenda
**Título:** Dia ruim também conta

A rotina de quem trabalha com prazo não é estável. Tem dia de parada de linha, viagem para cliente, entrega atrasada. Se o seu hábito só existe na versão completa, ele morre no primeiro dia ruim.

A saída é definir, com antecedência, uma versão tão pequena que cabe em 2 minutos. Ler um parágrafo em vez de duas páginas. Calçar o tênis e dar a volta no quarteirão. Parece pouco, e é de propósito: o objetivo desse dia não é o resultado, é não quebrar a sequência. Quem mantém a sequência volta à versão completa. Quem quebra costuma recomeçar do zero, quando recomeça.

**Pergunta-teste:** consigo fazer isso num dia de parada de linha, cansado e atrasado?

### Faça
- Para cada hábito ativo: campo "Versão mínima (até 2 minutos)" (até 60 caracteres). Mostrar a versão completa ao lado como referência.
- Validação: todos os hábitos ativos com versão mínima.

### Compromisso
- No check-in, o botão "mínimo" passa a mostrar o texto definido ("mínimo: 1 parágrafo").
- Indicador: **dias salvos pelo mínimo** (dias em que o único registro do hábito foi "mínimo").

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.

---

## Semana 7 · Rastreador e recuperação

- `id`: `habitos-s7` · duração: 5 min · `exercicio.tipo`: `recuperacao`

### Entenda
**Título:** Falhar uma vez é ruído. Duas é tendência.

Em controle de processo, um ponto fora da curva não muda nada. Uma sequência de pontos fora da curva é sinal de que o processo mudou. Hábito funciona igual. Perder um dia é normal e não significa nada. Perder dois seguidos é o começo de um novo padrão, o de não fazer.

Por isso o indicador principal deste sistema não é "dias seguidos sem falhar", que pune qualquer imprevisto. É "sem falha 2x": você pode falhar, mas não duas vezes seguidas.

O plano de recuperação é decidido agora, com a cabeça fria, e não no dia seguinte à falha, quando a tentação é deixar para a próxima semana.

**Pergunta-teste:** se eu falhar amanhã, o que exatamente eu faço no dia seguinte?

### Faça
- Para cada hábito ativo: campo "Se eu falhar, no dia seguinte eu vou:" (até 80 caracteres). Placeholder: "fazer a versão mínima logo depois do café".
- Opção (toggle): "Me avisar quando eu estiver a 1 falha de quebrar a sequência" (padrão: ligado).
- Validação: todos os hábitos com plano de recuperação.

### Compromisso
- Quando um hábito tem "não feito" ou nenhum registro ontem, o cartão dele na tela Hoje ganha a faixa "Hoje é dia de não falhar 2x" e mostra o plano de recuperação.
- Se o aviso estiver ligado, a notificação do dia usa esse texto.
- Indicador: **sem falha 2x** (atual e recorde).

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.

---

## Semana 8 · Compromisso e revisão

- `id`: `habitos-s8` · duração: 7 min · `exercicio.tipo`: `contrato_revisao`

### Entenda
**Título:** Todo processo tem ciclo de revisão

Nenhum processo fica bom na primeira versão. Ele passa por medição, análise e ajuste, e depois de novo. Com hábitos, a revisão evita dois erros comuns: carregar para sempre um hábito que já não serve e abandonar um hábito que só precisava de ajuste.

A partir de agora, uma vez por mês, você revisa cada hábito com três opções: **manter**, **ajustar** ou **remover**. Os números do seu painel ajudam, mas a decisão é sua.

O contrato é o último elemento. Um compromisso escrito, com consequência definida e, se quiser, uma testemunha, pesa mais que uma intenção. Ninguém gosta de descumprir o que assinou.

**Pergunta-teste:** esse hábito ainda me aproxima do profissional que eu disse que queria ser na semana 2?

### Faça
- Parte 1, **contrato:** "Eu me comprometo a:" (texto, pré-preenchido com os hábitos ativos), "Se eu falhar 2x seguidas, eu vou:" (texto), "Testemunha (opcional):" (nome), checkbox "Assino este compromisso" e data automática.
- Parte 2, **primeira revisão:** para cada hábito ativo, os dados dos últimos 30 dias (adesão e sem falha 2x) e 3 botões: Manter / Ajustar / Remover. "Ajustar" abre um campo de texto ("O que muda?").
- Validação: contrato assinado e todos os hábitos revisados.

### Compromisso
- Hábitos marcados como "remover" saem do check-in. Os marcados como "ajustar" guardam a nota no histórico.
- Agenda a próxima revisão para 30 dias depois; a tela Progresso mostra "Revisão mensal libera em X dias".
- Indicador: **revisões feitas**.
- Tela de conclusão do módulo: resumo das 8 semanas (adesão total, recorde de sem falha 2x, dias salvos pelo mínimo) e os módulos "em breve".

### Para ir além
Leitura recomendada: *Hábitos Atômicos*, de James Clear.
