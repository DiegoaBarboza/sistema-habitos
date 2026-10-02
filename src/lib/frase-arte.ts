// Regras da arte da frase do dia (imagem para status do WhatsApp, stories e feed).

export type TemaArte = "grafite" | "claro";
export type FormatoArte = "status" | "feed";

export const FORMATOS: Record<FormatoArte, { largura: number; altura: number }> = {
  status: { largura: 1080, altura: 1920 },
  feed: { largura: 1080, altura: 1350 },
};

// Os temas alternam a cada dia da jornada: dia ímpar grafite, dia par claro.
export function temaDoDia(diaDaJornada: number): TemaArte {
  return diaDaJornada % 2 === 1 ? "grafite" : "claro";
}

// Separa "texto com **destaque**" em palavras, marcando as que ficam em verde.
export function palavrasDaFrase(texto: string) {
  const palavras: { palavra: string; destaque: boolean }[] = [];
  texto.split(/(\*\*[^*]+\*\*)/g).forEach((trecho) => {
    const destaque = trecho.startsWith("**");
    const limpo = destaque ? trecho.slice(2, -2) : trecho;
    for (const palavra of limpo.split(/\s+/).filter(Boolean)) palavras.push({ palavra, destaque });
  });
  return palavras;
}

// Frase sem os marcadores, para o texto que acompanha o compartilhamento.
export const textoLimpo = (texto: string) => texto.replace(/\*\*/g, "");
