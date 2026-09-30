export const SENHA_MIN = 8;

// Lembra neste aparelho que a pessoa já usa senha, para a tela Entrar abrir no modo certo.
const CHAVE_MODO = "trilho-entrar-com-senha";

export function lerPreferenciaSenha() {
  try {
    return localStorage.getItem(CHAVE_MODO) === "1";
  } catch {
    return false;
  }
}

export function lembrarPreferenciaSenha() {
  try {
    localStorage.setItem(CHAVE_MODO, "1");
  } catch {
    // Sem armazenamento local: a tela Entrar abre no modo link, como no primeiro acesso.
  }
}
