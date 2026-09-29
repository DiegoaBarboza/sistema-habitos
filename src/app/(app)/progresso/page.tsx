import Link from "next/link";
import { META_ADESAO, type EstadoDia } from "@/lib/indicadores";
import { obterProgresso, PERIODOS, type Periodo } from "@/lib/progresso";

const ROTULO: Record<Periodo, string> = { "7d": "7d", "30d": "30d", tudo: "Tudo" };
const ALTURA = 120;
const pct = (t: number | null) => (t === null ? "—" : `${Math.round(t * 100)}%`);

export default async function Progresso({ searchParams }: PageProps<"/progresso">) {
  const { periodo: bruto } = await searchParams;
  const periodo: Periodo = PERIODOS.includes(bruto as Periodo) ? (bruto as Periodo) : "30d";
  const p = await obterProgresso(periodo);

  const taxa = p.adesao.taxa;
  const subAdesao =
    taxa === null
      ? "sem check-ins previstos"
      : taxa >= META_ADESAO
        ? `acima da meta de ${META_ADESAO * 100}%`
        : `abaixo da meta de ${META_ADESAO * 100}%`;

  return (
    <>
      <div className="flex items-end justify-between">
        <h1 className="text-[28px] font-bold">Progresso</h1>
        <nav aria-label="Período" className="flex rounded-[10px] border border-line bg-surface p-[3px]">
          {PERIODOS.map((op) => (
            <Link
              key={op}
              href={`/progresso?periodo=${op}`}
              replace
              scroll={false}
              aria-current={op === periodo ? "page" : undefined}
              className={`flex h-9 min-w-12 items-center justify-center rounded-lg px-2.5 font-mono text-xs font-semibold ${
                op === periodo ? "bg-accent text-on-accent" : "text-text-2"
              }`}
            >
              {ROTULO[op]}
            </Link>
          ))}
        </nav>
      </div>

      {!p.temHabitos ? (
        <p className="rounded-xl border border-dashed border-line p-5 text-[15px] leading-normal text-text-2">
          Seus indicadores aparecem aqui depois que o check-in começar, na semana 2.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Indicador rotulo="ADESÃO" valor={pct(taxa)} sub={subAdesao} destaque />
            <Indicador
              rotulo="SEM FALHA 2X"
              valor={`${p.semFalha2x.atual} ${p.semFalha2x.atual === 1 ? "dia" : "dias"}`}
              sub={`recorde: ${p.semFalha2x.recorde}`}
            />
            <Indicador
              rotulo="CHECK-INS"
              valor={String(p.checkins.checkins)}
              sub={`em ${p.checkins.diasAtivos} ${p.checkins.diasAtivos === 1 ? "dia ativo" : "dias ativos"}`}
            />
            <Indicador rotulo="VERSÃO MÍNIMA" valor={String(p.minimo)} sub="dias salvos pelo mínimo" />
          </div>

          <section aria-labelledby="por-semana" className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
            <div className="flex justify-between">
              <h2 id="por-semana" className="text-[15px] font-semibold">
                Adesão por semana
              </h2>
              <span className="font-mono text-[11px] text-text-2">– – meta {META_ADESAO * 100}%</span>
            </div>
            <div
              className="relative flex items-end gap-2.5"
              style={{ height: ALTURA + 30 }}
              role="img"
              aria-label={`Adesão por semana do módulo: ${p.porSemana
                .filter((s) => s.taxa !== null)
                .map((s) => `semana ${s.semana} ${pct(s.taxa)}`)
                .join(", ")}`}
            >
              <div
                className="absolute inset-x-0 border-t border-dashed border-text-2 opacity-60"
                style={{ bottom: ALTURA * META_ADESAO }}
              />
              {p.porSemana.map((s) => (
                <div key={s.semana} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  {s.taxa !== null && <span className="font-mono text-[10px] text-text-2">{pct(s.taxa)}</span>}
                  <div
                    className={`w-full rounded-t ${s.taxa === null ? "bg-track" : s.atual ? "bg-accent" : "bg-accent-mid"}`}
                    style={{ height: s.taxa === null ? 4 : Math.max(4, Math.round(s.taxa * ALTURA)) }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2.5" aria-hidden="true">
              {p.porSemana.map((s) => (
                <span key={s.semana} className="flex-1 text-center font-mono text-[10px] text-text-2">
                  S{s.semana}
                </span>
              ))}
            </div>
          </section>

          <section aria-labelledby="por-habito" className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 id="por-habito" className="text-[15px] font-semibold">
                Por hábito · 14 dias
              </h2>
              <span className="flex gap-2.5 text-[11px] text-text-2">
                <Legenda estado="feito">feito</Legenda>
                <Legenda estado="minimo">mínimo</Legenda>
                <Legenda estado="falhou">falhou</Legenda>
              </span>
            </div>
            {p.porHabito.map((h) => (
              <div key={h.id} className="flex flex-col gap-2 rounded-xl border border-line bg-surface px-3.5 py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">{h.nome}</span>
                  <span className="font-mono text-[13px] text-accent">{pct(h.taxa)}</span>
                </div>
                <div className="grid grid-cols-14 gap-[3px]" role="img" aria-label={`${h.nome}, últimos 14 dias: ${resumoDias(h.dias)}`}>
                  {h.dias.map((d, i) => (
                    <Celula key={i} estado={d} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {p.revisao &&
        (p.revisao.dias === 0 ? (
          <Link href="/revisao" className="flex items-center gap-3 rounded-xl bg-accent px-4 py-3.5 text-on-accent">
            <IconeCalendario />
            <span className="text-sm leading-normal font-semibold">
              Revisão mensal guiada disponível: manter, ajustar ou remover cada hábito.
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-line px-4 py-3.5">
            <IconeCalendario />
            <span className="text-sm leading-normal text-text-2">
              Revisão mensal guiada libera em{" "}
              <strong className="text-text">
                {p.revisao.dias} {p.revisao.dias === 1 ? "dia" : "dias"}
              </strong>
              : manter, ajustar ou remover cada hábito.
            </span>
          </div>
        ))}

      {p.moduloConcluido && (
        <Link href="/concluido" className="text-center text-sm font-semibold text-accent">
          Ver o resumo do módulo
        </Link>
      )}
    </>
  );
}

function Indicador({ rotulo, valor, sub, destaque }: { rotulo: string; valor: string; sub: string; destaque?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3.5">
      <span className="font-mono text-[10px] tracking-[0.06em] text-text-2">{rotulo}</span>
      <span className={`font-mono text-[30px] font-semibold ${destaque ? "text-accent" : ""}`}>{valor}</span>
      <span className="text-xs text-text-2">{sub}</span>
    </div>
  );
}

// Mínimo = metade inferior preenchida (decisão de marca): o estado não depende só do tom de verde.
function Celula({ estado, pequena }: { estado: EstadoDia; pequena?: boolean }) {
  const tamanho = pequena ? "size-2.5 rounded-[2px]" : "h-[18px] rounded-[3px]";
  if (estado === "feito") return <span className={`${tamanho} bg-accent`} />;
  if (estado === "minimo")
    return (
      <span
        className={`${tamanho} border border-line`}
        style={{ background: "linear-gradient(to top, var(--accent-mid) 50%, var(--track) 50%)" }}
      />
    );
  if (estado === "falhou") return <span className={`${tamanho} border border-line bg-track`} />;
  return <span className={`${tamanho} border border-dashed border-line`} />;
}

function Legenda({ estado, children }: { estado: EstadoDia; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      <Celula estado={estado} pequena />
      {children}
    </span>
  );
}

function resumoDias(dias: EstadoDia[]) {
  const n = (e: EstadoDia) => dias.filter((d) => d === e).length;
  return `${n("feito")} feitos, ${n("minimo")} no mínimo, ${n("falhou")} sem cumprir`;
}

function IconeCalendario() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
