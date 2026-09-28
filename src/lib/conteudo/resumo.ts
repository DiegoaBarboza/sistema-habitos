import type { TipoExercicio } from "./ler-licoes";

// Linha "Concluída · …" da Trilha. Lê o formato de respostas gravado pelos exercícios (marco 5).
export function resumoConclusao(tipo: TipoExercicio, respostas: Record<string, unknown>): string {
  const preenchidos = (lista: unknown, campo: string) =>
    Array.isArray(lista)
      ? lista.filter((i) => typeof i?.[campo] === "string" && i[campo].trim()).length
      : 0;

  if (tipo === "inventario") {
    const n = preenchidos(respostas.itens, "texto");
    if (n) return `Concluída · ${n} hábitos mapeados`;
  }
  if (tipo === "identidade") {
    const n = preenchidos(respostas.evidencias, "texto");
    if (n) return `Concluída · ${n} evidências definidas`;
  }
  return "Concluída";
}
