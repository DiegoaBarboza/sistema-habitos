"use client";

import {
  HABITO_NOVO,
  MAX_INVENTARIO,
  opcoesFoco,
  type Classificacao,
  type Contexto,
  type Encadeamento,
  type Identidade,
  type Inventario,
  type PlanoGatilho,
} from "@/lib/exercicios/regras";
import { TEXTOS } from "@/lib/exercicios/textos";
import { Campo, Cartao, Chip, classeCampo, minuscula, Opcao } from "./ui";

export type Dados30d = Record<string, { adesao: number | null; semFalha2x: number }>;
export type PropsExercicio<T> = {
  r: T;
  set: (r: T) => void;
  ctx: Contexto;
  sugestoesAncora: string[];
  dados30d: Dados30d;
};

// ---------- Semana 1 · inventario ----------

const CLASSES: { valor: Exclude<Classificacao, "">; nome: string; cor: string }[] = [
  { valor: "+", nome: "ajuda", cor: "var(--accent)" },
  { valor: "=", nome: "neutro", cor: "var(--text-2)" },
  { valor: "-", nome: "atrapalha", cor: "var(--warn)" },
];

export function InventarioFaca({ r, set }: PropsExercicio<Inventario>) {
  const T = TEXTOS.inventario;
  const mudar = (i: number, patch: Partial<Inventario["itens"][number]>) =>
    set({ ...r, itens: r.itens.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
  const conta = (c: Classificacao) => r.itens.filter((i) => i.texto.trim() && i.classificacao === c).length;
  const [p, n, m] = [conta("+"), conta("="), conta("-")];

  return (
    <>
      <p className="text-[15px] leading-normal">{T.instrucao}</p>
      <ol className="flex flex-col gap-2">
        {r.itens.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <label htmlFor={`inv-${i}`} className="w-5 shrink-0 font-mono text-xs text-text-2">
              {String(i + 1).padStart(2, "0")}
            </label>
            <input
              id={`inv-${i}`}
              value={item.texto}
              maxLength={80}
              placeholder={T.placeholders[i] ?? ""}
              onChange={(e) => mudar(i, { texto: e.target.value })}
              className={classeCampo}
            />
            {CLASSES.map((c) => {
              const ativo = item.classificacao === c.valor;
              return (
                <button
                  key={c.valor}
                  type="button"
                  aria-label={`Hábito ${i + 1}: ${c.nome}`}
                  aria-pressed={ativo}
                  onClick={() => mudar(i, { classificacao: ativo ? "" : c.valor })}
                  className="h-12 w-10 shrink-0 cursor-pointer rounded-[10px] border text-lg font-bold"
                  style={
                    ativo
                      ? { background: c.cor, borderColor: c.cor, color: "var(--on-accent)" }
                      : { background: "var(--surface)", borderColor: "var(--line)", color: "var(--text-2)" }
                  }
                >
                  {c.valor === "-" ? "−" : c.valor}
                </button>
              );
            })}
          </li>
        ))}
      </ol>
      {r.itens.length < MAX_INVENTARIO && (
        <button
          type="button"
          onClick={() => set({ ...r, itens: [...r.itens, { texto: "", classificacao: "" }] })}
          className="h-11 cursor-pointer rounded-[10px] border border-dashed border-line text-sm font-semibold text-text-2"
        >
          {T.adicionar}
        </button>
      )}
      <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface px-4 py-3.5">
        <div className="flex justify-between">
          <span className="rotulo">Diagnóstico</span>
          <span className="font-mono text-xs">
            {p + n + m === 0 ? "aguardando" : `${p} + · ${n} = · ${m} −`}
          </span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-[5px] bg-track" aria-hidden="true">
          <div style={{ flexGrow: p, background: "var(--accent)" }} />
          <div style={{ flexGrow: n, background: "var(--text-2)" }} />
          <div style={{ flexGrow: m, background: "var(--warn)" }} />
        </div>
      </div>
    </>
  );
}

export function InventarioCompromisso({ r, set }: PropsExercicio<Inventario>) {
  const { semNegativo, opcoes } = opcoesFoco(r);
  return (
    <>
      <p className="text-[15px] leading-normal">{TEXTOS.inventario.escolha}</p>
      {semNegativo && opcoes.length > 0 && <p className="text-sm text-text-2">{TEXTOS.inventario.semNegativo}</p>}
      {opcoes.map(({ item, i }) => (
        <Opcao key={i} ativa={r.foco === i} aoEscolher={() => set({ ...r, foco: i })}>
          {item.texto}
        </Opcao>
      ))}
    </>
  );
}

// ---------- Semana 2 · identidade ----------

export function IdentidadeFaca({ r, set }: PropsExercicio<Identidade>) {
  const T = TEXTOS.identidade;
  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="frase" className="text-sm font-semibold">
          Sou alguém que…
        </label>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[15px] text-text-2">Sou alguém que</span>
          <input
            id="frase"
            value={r.frase}
            maxLength={80}
            onChange={(e) => set({ ...r, frase: e.target.value })}
            className={classeCampo}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {T.sugestoes.map((s) => (
            <Chip key={s} ativo={r.frase === s} aoAlternar={() => set({ ...r, frase: s })}>
              {s}
            </Chip>
          ))}
        </div>
      </div>
      {r.evidencias.map((e, i) => (
        <Campo
          key={i}
          id={`evid-${i}`}
          rotulo={`Evidência ${i + 1}`}
          valor={e.texto}
          max={60}
          placeholder={T.placeholdersEvidencia[i]}
          aoMudar={(v) => set({ ...r, evidencias: r.evidencias.map((x, j) => (j === i ? { texto: v } : x)) })}
        />
      ))}
      <p className="text-sm text-text-2">{T.dica}</p>
    </>
  );
}

export function IdentidadeCompromisso({ r, set, ctx }: PropsExercicio<Identidade>) {
  if (!ctx.foco) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="rotulo">Hábito-foco</span>
      <p className="text-[15px] font-semibold">{ctx.foco.texto}</p>
      <p className="text-sm text-text-2">{TEXTOS.identidade.sugestaoFoco}</p>
      {r.evidencias.map((e, i) =>
        e.texto.trim() ? (
          <Opcao
            key={i}
            ativa={r.foco_evidencia === i}
            aoEscolher={() => set({ ...r, foco_evidencia: r.foco_evidencia === i ? null : i })}
          >
            {e.texto}
          </Opcao>
        ) : null,
      )}
    </div>
  );
}

// ---------- Semana 3 · plano_gatilho ----------

export function PlanoGatilhoFaca({ r, set, ctx }: PropsExercicio<PlanoGatilho>) {
  const T = TEXTOS.plano_gatilho;
  return (
    <>
      {ctx.habitos.map((h) => {
        const p = r.planos[h.id];
        const mudar = (patch: Partial<typeof p>) => set({ planos: { ...r.planos, [h.id]: { ...p, ...patch } } });
        return (
          <Cartao key={h.id} titulo={h.nome}>
            <Campo id={`hor-${h.id}`} rotulo="Horário" tipo="time" valor={p.horario} aoMudar={(v) => mudar({ horario: v })} />
            <Campo id={`lug-${h.id}`} rotulo="Lugar" valor={p.lugar} placeholder={T.placeholderLugar} aoMudar={(v) => mudar({ lugar: v })} />
            <Campo
              id={`dep-${h.id}`}
              rotulo="Depois de"
              valor={p.depois_de}
              placeholder={T.placeholderDepoisDe}
              aoMudar={(v) => mudar({ depois_de: v })}
            />
            <p className="rounded-[10px] bg-bg px-3 py-2.5 text-sm leading-normal">
              Às {p.horario || "__:__"}, {p.lugar.trim() || "…"}, depois de {p.depois_de.trim() || "…"}, eu vou{" "}
              {minuscula(h.nome)}.
            </p>
          </Cartao>
        );
      })}
    </>
  );
}

// ---------- Semana 4 · encadeamento ----------

export function EncadeamentoFaca({ r, set, ctx, sugestoesAncora }: PropsExercicio<Encadeamento>) {
  const opcoesAncora = Array.from(new Set([...sugestoesAncora, ...r.ancoras]));
  const alternar = (a: string) =>
    set({ ...r, ancoras: r.ancoras.includes(a) ? r.ancoras.filter((x) => x !== a) : r.ancoras.length < 5 ? [...r.ancoras, a] : r.ancoras });
  const adicionarOutra = () => {
    const a = r.outra.trim();
    if (a && !r.ancoras.includes(a) && r.ancoras.length < 5) set({ ...r, ancoras: [...r.ancoras, a], outra: "" });
  };
  const mudarCorrente = (i: number, patch: Partial<Encadeamento["correntes"][number]>) =>
    set({ ...r, correntes: r.correntes.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
  const nomeHabito = (c: Encadeamento["correntes"][number]) =>
    c.habito === HABITO_NOVO ? c.novo_nome : (ctx.habitos.find((h) => h.id === c.habito)?.nome ?? "");

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="rotulo">Passo 1 · Âncoras ({r.ancoras.length}/5)</span>
        <div className="flex flex-wrap gap-2">
          {opcoesAncora.map((a) => (
            <Chip key={a} ativo={r.ancoras.includes(a)} aoAlternar={() => alternar(a)}>
              {a}
            </Chip>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <div className="grow">
            <Campo id="outra" rotulo={TEXTOS.encadeamento.outraAncora} valor={r.outra} max={80} aoMudar={(v) => set({ ...r, outra: v })} />
          </div>
          <button
            type="button"
            onClick={adicionarOutra}
            className="h-12 shrink-0 cursor-pointer rounded-[10px] border border-line px-4 text-sm font-semibold"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="rotulo">Passo 2 · Correntes</span>
        {r.correntes.map((c, i) => (
          <Cartao key={i}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`anc-${i}`} className="text-sm font-semibold">
                Depois de
              </label>
              <select id={`anc-${i}`} value={c.ancora} onChange={(e) => mudarCorrente(i, { ancora: e.target.value })} className={classeCampo}>
                <option value="">Escolha a âncora</option>
                {r.ancoras.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`hab-${i}`} className="text-sm font-semibold">
                eu vou
              </label>
              <select id={`hab-${i}`} value={c.habito} onChange={(e) => mudarCorrente(i, { habito: e.target.value })} className={classeCampo}>
                <option value="">Escolha o hábito</option>
                {ctx.habitos.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nome}
                  </option>
                ))}
                <option value={HABITO_NOVO}>Hábito novo…</option>
              </select>
              {c.habito === HABITO_NOVO && (
                <input
                  aria-label="Nome do hábito novo"
                  value={c.novo_nome}
                  maxLength={60}
                  onChange={(e) => mudarCorrente(i, { novo_nome: e.target.value })}
                  className={classeCampo}
                />
              )}
            </div>
            {c.ancora && nomeHabito(c) && (
              <p className="text-sm">
                {c.ancora} <span className="text-accent">→</span> {minuscula(nomeHabito(c))}
              </p>
            )}
            <button
              type="button"
              onClick={() => set({ ...r, correntes: r.correntes.filter((_, j) => j !== i) })}
              className="h-10 w-fit cursor-pointer text-sm font-semibold text-warn"
            >
              Remover corrente
            </button>
          </Cartao>
        ))}
        {r.correntes.length < 3 && (
          <button
            type="button"
            onClick={() => set({ ...r, correntes: [...r.correntes, { ancora: "", habito: "", novo_nome: "" }] })}
            className="h-11 cursor-pointer rounded-[10px] border border-dashed border-line text-sm font-semibold text-text-2"
          >
            + Adicionar corrente
          </button>
        )}
      </div>
    </>
  );
}
