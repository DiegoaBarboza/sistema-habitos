"use client";

import {
  cartoesAmbiente,
  type Ambiente,
  type ContratoRevisao,
  type Decisao,
  type Recuperacao,
  type VersaoMinima,
} from "@/lib/exercicios/regras";
import { TEXTOS } from "@/lib/exercicios/textos";
import type { PropsExercicio } from "./exercicios-1a4";
import { Campo, Cartao, classeCampo, Marcador } from "./ui";

// ---------- Semana 5 · ambiente ----------

export function AmbienteFaca({ r, set, ctx }: PropsExercicio<Ambiente>) {
  return (
    <>
      {cartoesAmbiente(ctx).map((cartao) => {
        const T = TEXTOS.ambiente[cartao.tipo];
        const rotulos = [
          { rotulo: T.a, ex: T.exA },
          { rotulo: T.b, ex: T.exB },
        ];
        const acoes = r.acoes[cartao.chave];
        const mudar = (i: number, patch: Partial<(typeof acoes)[number]>) =>
          set({ acoes: { ...r.acoes, [cartao.chave]: acoes.map((a, j) => (j === i ? { ...a, ...patch } : a)) } });
        return (
          <Cartao key={cartao.chave} titulo={cartao.nome}>
            {acoes.map((a, i) => (
              <div key={a.id} className="flex flex-col gap-1">
                <Campo
                  id={`amb-${a.id}`}
                  rotulo={rotulos[i].rotulo}
                  valor={a.texto}
                  max={80}
                  placeholder={rotulos[i].ex}
                  aoMudar={(v) => mudar(i, { texto: v })}
                />
                <Marcador marcado={a.aplicado} aoMudar={(v) => mudar(i, { aplicado: v })}>
                  Aplicado
                </Marcador>
              </div>
            ))}
          </Cartao>
        );
      })}
    </>
  );
}

// ---------- Semana 6 · versao_minima ----------

export function VersaoMinimaFaca({ r, set, ctx }: PropsExercicio<VersaoMinima>) {
  return (
    <>
      {ctx.habitos.map((h) => (
        <Cartao key={h.id}>
          <div className="flex flex-col gap-0.5">
            <span className="rotulo">Versão completa</span>
            <span className="text-[15px] font-semibold">{h.nome}</span>
          </div>
          <Campo
            id={`min-${h.id}`}
            rotulo={TEXTOS.versao_minima.rotulo}
            valor={r.minimas[h.id]}
            max={60}
            aoMudar={(v) => set({ minimas: { ...r.minimas, [h.id]: v } })}
          />
        </Cartao>
      ))}
    </>
  );
}

// ---------- Semana 7 · recuperacao ----------

export function RecuperacaoFaca({ r, set, ctx }: PropsExercicio<Recuperacao>) {
  const T = TEXTOS.recuperacao;
  return (
    <>
      {ctx.habitos.map((h) => {
        const p = r.planos[h.id];
        const mudar = (patch: Partial<typeof p>) => set({ planos: { ...r.planos, [h.id]: { ...p, ...patch } } });
        return (
          <Cartao key={h.id} titulo={h.nome}>
            <Campo id={`rec-${h.id}`} rotulo={T.rotulo} valor={p.plano} max={80} placeholder={T.placeholder} aoMudar={(v) => mudar({ plano: v })} />
            <Marcador marcado={p.aviso} aoMudar={(v) => mudar({ aviso: v })}>
              {T.aviso}
            </Marcador>
          </Cartao>
        );
      })}
    </>
  );
}

// ---------- Semana 8 · contrato_revisao ----------

const DECISOES: { valor: Exclude<Decisao, "">; rotulo: string }[] = [
  { valor: "manter", rotulo: "Manter" },
  { valor: "ajustar", rotulo: "Ajustar" },
  { valor: "remover", rotulo: "Remover" },
];

export function ContratoRevisaoFaca({ r, set, ctx }: PropsExercicio<ContratoRevisao>) {
  const T = TEXTOS.contrato_revisao;
  const mudarContrato = (patch: Partial<ContratoRevisao["contrato"]>) => set({ ...r, contrato: { ...r.contrato, ...patch } });
  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());

  return (
    <>
      <span className="rotulo">Parte 1 · Contrato</span>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="compromisso" className="text-sm font-semibold">
          {T.compromisso}
        </label>
        <textarea
          id="compromisso"
          rows={3}
          value={r.contrato.compromisso}
          onChange={(e) => mudarContrato({ compromisso: e.target.value })}
          className={`${classeCampo} h-auto py-2.5 leading-normal`}
        />
      </div>
      <Campo id="consequencia" rotulo={T.consequencia} valor={r.contrato.consequencia} aoMudar={(v) => mudarContrato({ consequencia: v })} />
      <Campo id="testemunha" rotulo={T.testemunha} valor={r.contrato.testemunha} max={60} aoMudar={(v) => mudarContrato({ testemunha: v })} />
      <Marcador marcado={r.contrato.assinado} aoMudar={(v) => mudarContrato({ assinado: v })}>
        {T.assinar}
        {r.contrato.assinado && <span className="ml-2 font-mono text-xs text-text-2">{hoje}</span>}
      </Marcador>

      <span className="rotulo mt-2">Parte 2 · Primeira revisão</span>
      {ctx.habitos.map((h) => {
        const rev = r.revisao[h.id];
        const mudar = (patch: Partial<typeof rev>) => set({ ...r, revisao: { ...r.revisao, [h.id]: { ...rev, ...patch } } });
        return (
          <Cartao key={h.id} titulo={h.nome}>
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={`Decisão para ${h.nome}`}>
              {DECISOES.map((d) => (
                <button
                  key={d.valor}
                  type="button"
                  aria-pressed={rev.decisao === d.valor}
                  onClick={() => mudar({ decisao: d.valor })}
                  className={`h-11 cursor-pointer rounded-[10px] border text-sm font-semibold ${
                    rev.decisao === d.valor ? "border-accent bg-accent text-on-accent" : "border-line bg-bg text-text"
                  }`}
                >
                  {d.rotulo}
                </button>
              ))}
            </div>
            {rev.decisao === "ajustar" && (
              <Campo id={`nota-${h.id}`} rotulo={T.oQueMuda} valor={rev.nota} max={120} aoMudar={(v) => mudar({ nota: v })} />
            )}
          </Cartao>
        );
      })}
    </>
  );
}
