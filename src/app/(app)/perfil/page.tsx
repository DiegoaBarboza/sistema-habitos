import Link from "next/link";
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
          <Link href="/frases" className="flex flex-col gap-0.5 border-b border-line px-4 py-3.5">
            <span className="text-[15px] font-semibold">Minhas frases</span>
            <span className="text-[13px] text-text-2">As frases do dia que você já viu, para rever e compartilhar.</span>
          </Link>
          <Link href="/como-funciona" className="flex flex-col gap-0.5 border-b border-line px-4 py-3.5">
            <span className="text-[15px] font-semibold">Como funciona</span>
            <span className="text-[13px] text-text-2">O método e um guia rápido das telas.</span>
          </Link>
          <DefinirSenha temSenha={temSenha} />
          <BotaoSair />
        </div>
      </section>
    </>
  );
}
