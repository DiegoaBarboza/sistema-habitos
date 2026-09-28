"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import type { EstadoCheckin } from "@/lib/indicadores";
import { registrarCheckin } from "./acoes";

export type Cartao = {
  id: string;
  nome: string;
  detalhe: string;
  versaoMinima: string | null;
  estado: EstadoCheckin | null;
  diaDeNaoFalhar: boolean;
  planoRecuperacao: string | null;
};

const TAG: Record<EstadoCheckin | "pendente", string> = {
  feito: "FEITO",
  minimo: "MÍNIMO",
  nao_feito: "NÃO FEITO",
  pendente: "PENDENTE",
};

const TOQUE_LONGO_MS = 500;

export function CheckinLista({
  hoje,
  ontem,
  cartoesHoje,
  cartoesOntem,
}: {
  hoje: string;
  ontem: string;
  cartoesHoje: Cartao[];
  cartoesOntem: Cartao[];
}) {
  const [qual, setQual] = useState<"hoje" | "ontem">("hoje");
  const dia = qual === "hoje" ? hoje : ontem;
  const cartoes = qual === "hoje" ? cartoesHoje : cartoesOntem;
  const [estados, aplicar] = useOptimistic(
    Object.fromEntries(cartoes.map((c) => [c.id, c.estado])),
    (atual: Record<string, EstadoCheckin | null>, [id, estado]: [string, EstadoCheckin | null]) => ({ ...atual, [id]: estado }),
  );
  const [, iniciar] = useTransition();
  const [menu, setMenu] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function registrar(id: string, estado: EstadoCheckin | null) {
    setMenu(null);
    setErro(null);
    iniciar(async () => {
      aplicar([id, estado]);
      try {
        await registrarCheckin(id, dia, estado);
      } catch {
        setErro("Não foi possível registrar. Confira a conexão e tente de novo.");
      }
    });
  }

  return (
    <section aria-labelledby="titulo-checkin" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 id="titulo-checkin" className="text-base font-semibold">
          {qual === "hoje" ? "Check-in de hoje" : "Check-in de ontem"}
        </h2>
        {cartoesOntem.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMenu(null);
              setQual(qual === "hoje" ? "ontem" : "hoje");
            }}
            className="min-h-11 cursor-pointer font-mono text-[11px] text-accent"
          >
            {qual === "hoje" ? "marcar ontem" : "voltar para hoje"}
          </button>
        )}
      </div>
      {cartoes.map((c) => (
        <CartaoCheckin
          key={`${dia}-${c.id}`}
          cartao={c}
          estado={estados[c.id] ?? null}
          menuAberto={menu === c.id}
          abrirMenu={() => setMenu(menu === c.id ? null : c.id)}
          registrar={(e) => registrar(c.id, e)}
        />
      ))}
      {erro && (
        <p role="alert" className="text-sm text-warn">
          {erro}
        </p>
      )}
    </section>
  );
}

function CartaoCheckin({
  cartao: c,
  estado,
  menuAberto,
  abrirMenu,
  registrar,
}: {
  cartao: Cartao;
  estado: EstadoCheckin | null;
  menuAberto: boolean;
  abrirMenu: () => void;
  registrar: (e: EstadoCheckin | null) => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longo = useRef(false);
  const cumprido = estado === "feito" || estado === "minimo";
  const cor = estado === null ? "var(--warn)" : estado === "nao_feito" ? "var(--text-2)" : "var(--accent)";

  const inicioToque = () => {
    longo.current = false;
    timer.current = setTimeout(() => {
      longo.current = true;
      abrirMenu();
    }, TOQUE_LONGO_MS);
  };
  const fimToque = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border bg-surface ${
        estado === null ? "border-dashed border-warn" : "border-line"
      }`}
    >
      {c.diaDeNaoFalhar && (
        <div className="flex flex-col gap-0.5 bg-warn/15 px-3.5 py-2 text-[13px]">
          <span className="font-semibold text-warn">Hoje é dia de não falhar 2x</span>
          {c.planoRecuperacao && <span className="text-text">{c.planoRecuperacao}</span>}
        </div>
      )}
      <div className="flex items-stretch">
        <button
          type="button"
          aria-pressed={cumprido}
          onPointerDown={inicioToque}
          onPointerUp={fimToque}
          onPointerLeave={fimToque}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => {
            if (longo.current) return;
            registrar(estado === "feito" ? null : "feito");
          }}
          className="flex min-h-[60px] grow cursor-pointer items-center gap-3 py-2.5 pl-3.5 text-left select-none"
        >
          <span
            className={`flex size-[26px] shrink-0 items-center justify-center rounded-[7px] ${
              cumprido ? "bg-accent" : "border-2 border-text-2"
            }`}
          >
            {cumprido && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--on-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" />
              </svg>
            )}
          </span>
          <span className="flex min-w-0 grow flex-col gap-0.5">
            <span className="text-[15px] font-medium">{c.nome}</span>
            {(c.detalhe || (estado === "minimo" && c.versaoMinima)) && (
              <span className="text-xs text-text-2">
                {estado === "minimo" && c.versaoMinima ? `mínimo: ${c.versaoMinima}` : c.detalhe}
              </span>
            )}
          </span>
          <span className="shrink-0 font-mono text-[10px] tracking-[0.06em]" style={{ color: cor }}>
            {TAG[estado ?? "pendente"]}
          </span>
        </button>
        <button
          type="button"
          aria-label={`Mais opções para ${c.nome}`}
          aria-expanded={menuAberto}
          onClick={abrirMenu}
          className="w-11 shrink-0 cursor-pointer text-lg text-text-2"
        >
          ⋯
        </button>
      </div>
      {menuAberto && (
        <div className="grid grid-cols-3 gap-1.5 border-t border-line p-2" role="group" aria-label={`Registrar ${c.nome}`}>
          <OpcaoMenu ativa={estado === "feito"} onClick={() => registrar("feito")}>
            Feito
          </OpcaoMenu>
          <OpcaoMenu ativa={estado === "minimo"} onClick={() => registrar("minimo")}>
            Mínimo{c.versaoMinima && <span className="block text-[11px] font-normal">({c.versaoMinima})</span>}
          </OpcaoMenu>
          <OpcaoMenu ativa={estado === "nao_feito"} onClick={() => registrar("nao_feito")}>
            Não feito
          </OpcaoMenu>
        </div>
      )}
    </div>
  );
}

function OpcaoMenu({ ativa, onClick, children }: { ativa: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={ativa}
      onClick={onClick}
      className={`min-h-11 cursor-pointer rounded-[10px] border px-2 py-1.5 text-[13px] font-semibold ${
        ativa ? "border-accent bg-accent text-on-accent" : "border-line bg-bg text-text"
      }`}
    >
      {children}
    </button>
  );
}
