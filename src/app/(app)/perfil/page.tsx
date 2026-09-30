import { iniciais, obterSessao } from "@/lib/perfil";
import { BotaoSair } from "./botao-sair";
import { DefinirSenha } from "./definir-senha";
import { LembreteDiario } from "./lembrete-diario";
import { SeletorAparencia } from "./seletor-aparencia";

export default async function Perfil() {
  const { email, perfil, temSenha } = await obterSessao();

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

      <LembreteDiario
        ativoNoPerfil={perfil.lembrete_ativo}
        horaInicial={perfil.lembrete_hora}
        chavePublica={process.env.VAPID_PUBLIC_KEY ?? null}
      />

      <section aria-labelledby="rotulo-conta" className="flex flex-col gap-2.5">
        <h2 id="rotulo-conta" className="rotulo">
          Conta
        </h2>
        <div className="rounded-xl border border-line bg-surface">
          <DefinirSenha temSenha={temSenha} />
          <BotaoSair />
        </div>
      </section>
    </>
  );
}
