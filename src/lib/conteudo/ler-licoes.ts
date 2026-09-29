// Converte docs/conteudo-modulo1-habitos.md nas linhas da tabela licoes.
// O texto é copiado sem alteração: marcação inline (**negrito**, *itálico*) fica como está
// e é renderizada na tela da lição.

export type TipoExercicio =
  | "inventario"
  | "identidade"
  | "plano_gatilho"
  | "encadeamento"
  | "ambiente"
  | "versao_minima"
  | "recuperacao"
  | "contrato_revisao";

export type ConteudoLicao = {
  entenda: { titulo: string; paragrafos: string[]; pergunta: string };
  faca: string[];
  compromisso: string[];
  para_ir_alem: string;
};

export type Licao = {
  id: string;
  modulo_id: string;
  semana: number;
  titulo: string;
  duracao_min: number;
  tipo_exercicio: TipoExercicio;
  conteudo: ConteudoLicao;
};

const RE_SEMANA = /^## Semana (\d+) · (.+)$/;
const RE_META = /^- `id`: `([^`]+)` · duração: (\d+) min · `exercicio\.tipo`: `([^`]+)`$/;
const RE_TITULO = /^\*\*Título:\*\* (.+)$/;
const RE_PERGUNTA = /^\*\*Pergunta-teste[^*]*:\*\* (.+)$/;

export function lerLicoes(markdown: string, moduloId: string): Licao[] {
  const blocos = markdown.replace(/\r\n/g, "\n").split(/\n(?=## Semana )/).slice(1);
  return blocos.map((bloco) => lerSemana(bloco.replace(/\n---\s*$/, "").trim(), moduloId));
}

function lerSemana(bloco: string, moduloId: string): Licao {
  const linhas = bloco.split("\n");
  const cab = linhas[0].match(RE_SEMANA);
  if (!cab) throw new Error(`Cabeçalho de semana inválido: ${linhas[0]}`);
  const semana = Number(cab[1]);

  const meta = linhas.find((l) => RE_META.test(l))?.match(RE_META);
  if (!meta) throw new Error(`Semana ${semana}: linha de id/duração/tipo não encontrada`);

  const secoes = separarSecoes(linhas);
  const entenda = secoes.get("Entenda");
  const faca = secoes.get("Faça");
  const compromisso = secoes.get("Compromisso");
  const alem = secoes.get("Para ir além");
  if (!entenda || !faca || !compromisso || !alem) {
    throw new Error(`Semana ${semana}: falta alguma seção (Entenda, Faça, Compromisso, Para ir além)`);
  }

  return {
    id: meta[1],
    modulo_id: moduloId,
    semana,
    titulo: cab[2].trim(),
    duracao_min: Number(meta[2]),
    tipo_exercicio: meta[3] as TipoExercicio,
    conteudo: {
      entenda: lerEntenda(entenda, semana),
      faca: itens(faca),
      compromisso: itens(compromisso),
      para_ir_alem: paragrafos(alem).join("\n\n"),
    },
  };
}

function separarSecoes(linhas: string[]) {
  const secoes = new Map<string, string[]>();
  let atual: string[] | null = null;
  for (const linha of linhas) {
    const h3 = linha.match(/^### (.+)$/);
    if (h3) {
      atual = [];
      secoes.set(h3[1].trim(), atual);
    } else if (atual) {
      atual.push(linha);
    }
  }
  return secoes;
}

function lerEntenda(linhas: string[], semana: number) {
  let titulo = "";
  let pergunta = "";
  const corpo: string[] = [];
  for (const p of paragrafos(linhas)) {
    const t = p.match(RE_TITULO);
    const q = p.match(RE_PERGUNTA);
    if (t) titulo = t[1];
    else if (q) pergunta = q[1];
    else corpo.push(p);
  }
  if (!titulo || !pergunta) throw new Error(`Semana ${semana}: Entenda sem título ou pergunta-teste`);
  return { titulo, paragrafos: corpo, pergunta };
}

// Parágrafos separados por linha em branco.
function paragrafos(linhas: string[]) {
  return linhas
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Itens de lista de primeiro nível; sub-itens ficam no mesmo item, com a indentação original.
function itens(linhas: string[]) {
  const lista: string[] = [];
  for (const linha of linhas) {
    if (linha.startsWith("- ")) lista.push(linha.slice(2));
    else if (/^\s+- /.test(linha) && lista.length) lista[lista.length - 1] += "\n" + linha;
    else if (linha.trim()) throw new Error(`Linha fora de lista: ${linha}`);
  }
  return lista;
}
