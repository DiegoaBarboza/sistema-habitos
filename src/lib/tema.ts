export type Tema = "auto" | "escuro" | "claro";
export type TemaEfetivo = "dark" | "light";

export const TEMAS: readonly Tema[] = ["auto", "escuro", "claro"];
export const CHAVE_TEMA = "tema";

export function ehTema(valor: unknown): valor is Tema {
  return typeof valor === "string" && (TEMAS as readonly string[]).includes(valor);
}

export function resolverTema(tema: Tema, sistemaEscuro: boolean): TemaEfetivo {
  if (tema === "escuro") return "dark";
  if (tema === "claro") return "light";
  return sistemaEscuro ? "dark" : "light";
}

// Roda no <head> antes da primeira pintura: aplica data-theme sem esperar o React.
// Precisa ser autocontido (vira string), por isso repete a regra de resolverTema.
export const scriptTemaInicial = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  CHAVE_TEMA,
)});var d=t==="escuro"||(t!=="claro"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`;
