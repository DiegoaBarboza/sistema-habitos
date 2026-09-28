import { sair } from "@/app/acoes";
import { iniciais, obterSessao } from "@/lib/perfil";
import { SeletorAparencia } from "./seletor-aparencia";

export default async function Perfil() {
  const { email, perfil } = await obterSessao();

  return (
    <>
      <h1 className="text-[28px] font-bold">Perfil</h1>

      <div className="flex items-center gap-3.5">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-xl font-bold text-on-accent">
          {iniciais(perfil.nome, email)}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-lg font-bold">{perfil.nome}</span>
          <span className="truncate text-sm text-text-2">{email}</span>
        </div>
      </div>

      <SeletorAparencia />

      <section aria-labelledby="rotulo-conta" className="flex flex-col gap-2.5">
        <h2 id="rotulo-conta" className="rotulo">
          Conta
        </h2>
        <form action={sair} className="rounded-xl border border-line bg-surface">
          <button type="submit" className="w-full cursor-pointer px-4 py-3.5 text-left text-[15px] font-semibold text-warn">
            Sair
          </button>
        </form>
      </section>
    </>
  );
}
