// Rótulos, placeholders e dicas dos exercícios, copiados de docs/conteudo-modulo1-habitos.md.
// textos.test.ts garante que cada frase daqui existe no arquivo, sem alteração.

export const TEXTOS = {
  inventario: {
    instrucao: "Liste pelo menos 5 hábitos da sua rotina e marque cada um: + ajuda · = neutro · − atrapalha.",
    placeholders: [
      "checar o celular ao acordar",
      "revisar a agenda depois do café",
      "almoçar na frente do computador",
      "caminhar depois do expediente",
      "responder e-mail à noite",
    ],
    adicionar: "+ Adicionar outro hábito",
    escolha: "Escolha 1 hábito para trabalhar nas próximas semanas.",
    semNegativo: "Nenhum atrapalha? Escolha um + para fortalecer.",
  },
  identidade: {
    sugestoes: [
      "cumpre o que planeja",
      "se mantém atualizado",
      "cuida da própria saúde",
      "chega preparado às reuniões",
      "termina o que começa",
    ],
    placeholdersEvidencia: ["revisar a agenda do dia", "ler 2 páginas técnicas", "caminhar 15 minutos"],
    dica: "Evidência boa cabe em 2 minutos e dá para responder com sim ou não.",
    sugestaoFoco: "Quer que uma das evidências seja a troca do seu hábito-foco?",
  },
  plano_gatilho: {
    placeholderLugar: "na mesa do escritório",
    placeholderDepoisDe: "servir o primeiro café",
  },
  encadeamento: {
    outraAncora: "Outra ação que já faço todo dia",
  },
  ambiente: {
    construir: { a: "Deixar à vista:", b: "Tirar passos:", exA: "livro técnico em cima do teclado", exB: "tênis separado na porta" },
    largar: { a: "Esconder o gatilho:", b: "Colocar passos:", exA: "celular carregando fora do quarto", exB: "sair do app de vídeo no celular" },
  },
  versao_minima: {
    rotulo: "Versão mínima (até 2 minutos)",
  },
  recuperacao: {
    rotulo: "Se eu falhar, no dia seguinte eu vou:",
    placeholder: "fazer a versão mínima logo depois do café",
    aviso: "Me avisar quando eu estiver a 1 falha de quebrar a sequência",
  },
  contrato_revisao: {
    compromisso: "Eu me comprometo a:",
    consequencia: "Se eu falhar 2x seguidas, eu vou:",
    testemunha: "Testemunha (opcional):",
    assinar: "Assino este compromisso",
    oQueMuda: "O que muda?",
  },
} as const;
