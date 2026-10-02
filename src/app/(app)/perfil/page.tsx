import Link from "next/link";
import { iniciais, obterSessao } from "@/lib/perfil";
import { SUPORTE_EMAIL } from "@/lib/responsavel";
import { criarClienteServidor } from "@/lib/supabase/server";
import { BotaoSair } from "./botao-sair";
import { DefinirSenha } from "./definir-senha";
import { LembreteDiario } from "./lembrete-diario";
import { SeletorAparencia } from "./seletor-aparencia";

export default async function Perfil() {
  const [{ email, admin, perfil, temSenha, modulosLiberados }, supabase] = await Promise.all([obterSessao(), criarClienteServidor()]);
  const { data: modulos } = await supabase.from("modulos").select("id, titulo, status").order("ordem");
  const meusModulos = (modulos ?? []).filter((m) => modulosLiberados.includes(m.id) || m.status === "em_breve");
  const assuntoSuporte = encodeURIComponent("Trilho: suporte e sugestões");

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

      <section aria-labelledby="rotulo-modulos" className="flex flex-col gap-2.5">
        <h2 id="rotulo-modulos" className="rotulo">
          Meus módulos
        </h2>
        <ul className="rounded-xl border border-line bg-surface">
          {meusModulos.map((m) => {
            const liberado = modulosLiberados.includes(m.id);
            return (
              <li key={m.id} className="flex items-center justify-between border-b border-line px-4 py-3.5 last:border-b-0">
                <span className={`text-[15px] font-semibold ${liberado ? "" : "text-text-2"}`}>{m.titulo}</span>
                <span className={`font-mono text-[11px] ${liberado ? "text-accent" : "text-text-2"}`}>
                  {liberado ? "LIBERADO" : "EM BREVE"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="rotulo-conta" className="flex flex-col gap-2.5">
        <h2 id="rotulo-conta" className="rotulo">
          Conta
        </h2>
        <div className="rounded-xl border border-line bg-surface">
          {admin && (
            <Link href="/admin" className="flex flex-col gap-0.5 border-b border-line px-4 py-3.5">
              <span className="text-[15px] font-semibold">Painel de vendas</span>
              <span className="text-[13px] text-text-2">Vendas, vagas do lote e avisos da Kiwify. Só você vê.</span>
            </Link>
          )}
          <Link href="/frases" className="flex flex-col gap-0.5 border-b border-line px-4 py-3.5">
            <span className="text-[15px] font-semibold">Minhas frases</span>
            <span className="text-[13px] text-text-2">As frases do dia que você já viu, para rever e compartilhar.</span>
          </Link>
          <Link href="/como-funciona" className="flex flex-col gap-0.5 border-b border-line px-4 py-3.5">
            <span className="text-[15px] font-semibold">Como funciona</span>
            <span className="text-[13px] text-text-2">O método e um guia rápido das telas.</span>
          </Link>
          <DefinirSenha temSenha={temSenha} />
          <a href="/api/exportar" download className="flex flex-col gap-0.5 border-b border-line px-4 py-3.5">
            <span className="text-[15px] font-semibold">Exportar meus dados</span>
            <span className="text-[13px] text-text-2">Baixa um arquivo com tudo o que você registrou no app.</span>
          </a>
          <a href={`mailto:${SUPORTE_EMAIL}?subject=${assuntoSuporte}`} className="flex flex-col gap-0.5 border-b border-line px-4 py-3.5">
            <span className="text-[15px] font-semibold">Suporte e sugestões</span>
            <span className="text-[13px] text-text-2">{SUPORTE_EMAIL}</span>
          </a>
          <div className="flex gap-4 border-b border-line px-4 py-3.5 text-[13px] text-text-2">
            <Link href="/privacidade" className="underline">
              Privacidade
            </Link>
            <Link href="/termos" className="underline">
              Termos de uso
            </Link>
          </div>
          <BotaoSair />
        </div>
      </section>
    </>
  );
}
