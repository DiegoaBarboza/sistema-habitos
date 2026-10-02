import { SincronizarTema } from "@/components/sincronizar-tema";
import { obterSessao } from "@/lib/perfil";

// Telas logadas fora do layout das abas (lição, boas-vindas, criar senha, sem acesso) também seguem o tema do perfil.
// Sem isso, ficavam com o tema que sobrou no navegador (de outra conta ou de outro aparelho) até abrir o Hoje.
export async function TemaDoPerfil() {
  const { perfil } = await obterSessao();
  return <SincronizarTema temaDoPerfil={perfil.tema} />;
}
