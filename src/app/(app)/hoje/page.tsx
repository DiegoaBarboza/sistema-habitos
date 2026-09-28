import Link from "next/link";
import { META_ADESAO } from "@/lib/indicadores";
import { iniciais, obterSessao } from "@/lib/perfil";
import { obterHoje } from "@/lib/hoje";
import { AjustesPendentes } from "./ajustes-pendentes";
import { CheckinLista } from "./checkin-lista";

const LETRAS_SEMANA = ["S", "T", "Q", "Q", "S", "S", "D"];
const ALTURA_GRAFICO = 56;

function cabecalho(agora: string, fuso: string) {
  const d = new Date(agora);
  const partes = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("pt-BR", { timeZone: fuso, ...o }).format(d).replace(".", "").toUpperCase();
  const hora = Number(new Intl.DateTimeFormat("en-GB", { timeZone: fuso, hour: "2-digit", hourCycle: "h23" }).format(d));
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  return { data: `${partes({ weekday: "short" })} · ${partes({ day: "2-digit" })} ${partes({ month: "short" })}`, saudacao };
}

const pct = (t: number | null) => (t === null ? "—" : `${Math.round(t * 100)}%`);

export default async function Hoje() {
  const [{ email }, h] = await Promise.all([obterSessao(), obterHoje()]);
  const { data, saudacao } = cabecalho(h.agora, h.fuso);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs tracking-[0.08em] text-text-2">
            {data} · SEMANA {h.semanaAtual}/8
          </span>
          <h1 className="text-[26px] font-bold">
            {saudacao}, {h.nome}
          </h1>
        </div>
        <Link
          href="/perfil"
          aria-label="Perfil"
          className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-sm font-semibold"
        >
          {iniciais(h.nome, email)}
        </Link>
      </div>

      {!h.temHabitos ? (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-line p-5">
          <p className="text-[15px] leading-normal">Seu check-in começa na semana 2. Primeiro, conclua o inventário.</p>
          {h.licao && (
            <Link
              href={`/licao/${h.licao.id}`}
              className="flex h-12 items-center justify-center rounded-xl bg-accent text-[15px] font-bold text-on-accent"
            >
              {h.licao.titulo}
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Indicador rotulo="HOJE" valor={`${h.indicadores.hoje.feitos}/${h.indicadores.hoje.previstos}`} />
            <Indicador rotulo="ADESÃO SEM." valor={pct(h.indicadores.adesaoSemana)} destaque />
            <Indicador rotulo="SEM FALHA 2X" valor={`${h.indicadores.semFalha2x}d`} />
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface px-3.5 pt-3.5 pb-2.5">
            <div className="flex justify-between font-mono text-[10px] text-text-2">
              <span className="tracking-[0.06em]">ESTA SEMANA</span>
              <span>meta {META_ADESAO * 100}%</span>
            </div>
            <div
              className="relative flex items-end gap-2"
              style={{ height: ALTURA_GRAFICO }}
              role="img"
              aria-label={`Adesão por dia desta semana: ${h.semana
                .map((s, i) => (s.taxa === null ? null : `${LETRAS_SEMANA[i]} ${pct(s.taxa)}`))
                .filter(Boolean)
                .join(", ")}`}
            >
              <div
                className="absolute inset-x-0 border-t border-dashed border-text-2 opacity-60"
                style={{ bottom: ALTURA_GRAFICO * META_ADESAO }}
              />
              {h.semana.map((s) => (
                <div key={s.dia} className="flex h-full flex-1 flex-col justify-end">
                  {s.taxa === null ? (
                    <div className="h-1 rounded-sm bg-track" />
                  ) : (
                    <div
                      className={`rounded-t-[3px] ${s.hoje ? "bg-text" : "bg-accent"}`}
                      style={{ height: Math.max(6, Math.round(s.taxa * ALTURA_GRAFICO)) }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2" aria-hidden="true">
              {h.semana.map((s, i) => (
                <span key={s.dia} className={`flex-1 text-center font-mono text-[10px] ${s.hoje ? "text-text" : "text-text-2"}`}>
                  {LETRAS_SEMANA[i]}
                </span>
              ))}
            </div>
          </div>

          <CheckinLista hoje={h.dia} ontem={h.ontem} cartoesHoje={h.cartoesHoje} cartoesOntem={h.cartoesOntem} />
          <AjustesPendentes ajustes={h.ajustesPendentes} />
        </>
      )}

      {h.licao && h.temHabitos && (
        <Link href={`/licao/${h.licao.id}`} className="flex items-center gap-3.5 rounded-xl bg-accent px-4 py-3.5 text-on-accent">
          <span className="flex grow flex-col gap-0.5">
            <span className="font-mono text-[11px] font-semibold tracking-[0.06em]">
              LIÇÃO DA SEMANA · {h.licao.duracao} MIN
            </span>
            <span className="text-base font-bold">{h.licao.titulo}</span>
          </span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </>
  );
}

function Indicador({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="font-mono text-[10px] tracking-[0.06em] text-text-2">{rotulo}</span>
      <span className={`font-mono text-[26px] font-semibold ${destaque ? "text-accent" : ""}`}>{valor}</span>
    </div>
  );
}
