// Taxa da Kiwify por venda: 8,99% + R$ 2,49 (valores informados pelo Diego em 02/10/2026).
export const TAXA_PERCENTUAL = 0.0899;
export const TAXA_FIXA = 2.49;

const arredondar = (v: number) => Math.round(v * 100) / 100;

export function taxaKiwify(bruto: number) {
  return arredondar(bruto * TAXA_PERCENTUAL + TAXA_FIXA);
}

export function liquidoKiwify(bruto: number) {
  return arredondar(bruto - taxaKiwify(bruto));
}

export const reais = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
