import { redirect } from "next/navigation";
import { sair } from "@/app/acoes";
import { Marca } from "@/components/marca";
import { MODULO_ATUAL } from "@/lib/modulo";
import { obterModuloAtual } from "@/lib/modulo-servidor";
import { obterSessao } from "@/lib/perfil";
import { obterOfertaAtual } from "@/lib/vendas/servidor";

export default async function SemAcesso() {
  const [{ email, modulosLiberados }, modulo] = await Promise.all([obterSessao(), obterModuloAtual()]);
  if (modulosLiberados.includes(MODULO_ATUAL)) redirect("/hoje");

  const paginaVenda = (await obterOfertaAtual()).checkoutUrl;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-between gap-10 px-6 pt-[72px] pb-10">
      <div className="flex flex-col gap-7">
        <Marca />
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-xs tracking-[0.08em] text-accent">TRILHO</span>
          <h1 className="text-[28px] leading-[1.15] font-bold">Nenhum módulo liberado para este e-mail</h1>
          <p className="text-base leading-[1.55] text-text-2">
            Você entrou como <strong className="text-text">{email}</strong>.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {paginaVenda && (
          <a
            href={paginaVenda}
            className="flex h-14 items-center justify-center rounded-xl bg-accent text-base font-bold text-on-accent"
          >
            Conhecer o módulo {modulo.titulo}
          </a>
        )}
        <form action={sair}>
          <button
            type="submit"
            className="h-12 w-full cursor-pointer rounded-xl border border-line text-[15px] font-semibold"
          >
            Comprou com outro e-mail? Entre com ele.
          </button>
        </form>
      </div>
    </main>
  );
}
