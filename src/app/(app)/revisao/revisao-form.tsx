"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TEXTOS } from "@/lib/exercicios/textos";
import { Campo, Cartao } from "@/app/licao/[id]/ui";
import { salvarRevisaoMensal } from "./acoes";

type Decisao = "manter" | "ajustar" | "remover";
const OPCOES: { valor: Decisao; rotulo: string }[] = [
  { valor: "manter", rotulo: "Manter" },
  { valor: "ajustar", rotulo: "Ajustar" },
  { valor: "remover", rotulo: "Remover" },
];

export function RevisaoForm({
  habitos,
}: {
  habitos: { id: string; nome: string; adesao: number | null; semFalha2x: number }[];
}) {
  const router = useRouter();
  const [decisoes, setDecisoes] = useState<Record<string, { decisao: Decisao | ""; nota: string }>>(
    Object.fromEntries(habitos.map((h) => [h.id, { decisao: "", nota: "" }])),
  );
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, iniciar] = useTransition();
  const pronta = habitos.every((h) => decisoes[h.id].decisao);

  function salvar() {
    setErro(null);
    iniciar(async () => {
      try {
        await salvarRevisaoMensal(decisoes);
        router.replace("/progresso");
      } catch {
        setErro("Não foi possível salvar. Confira a conexão e tente de novo.");
      }
    });
  }

  return (
    <>
      {habitos.map((h) => {
        const d = decisoes[h.id];
        const mudar = (patch: Partial<typeof d>) => setDecisoes({ ...decisoes, [h.id]: { ...d, ...patch } });
        return (
          <Cartao key={h.id} titulo={h.nome}>
            <p className="font-mono text-xs text-text-2">
              ÚLTIMOS 30 DIAS · adesão {h.adesao === null ? "—" : `${Math.round(h.adesao * 100)}%`} · sem falha 2x{" "}
              {h.semFalha2x}d
            </p>
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={`Decisão para ${h.nome}`}>
              {OPCOES.map((o) => (
                <button
                  key={o.valor}
                  type="button"
                  aria-pressed={d.decisao === o.valor}
                  onClick={() => mudar({ decisao: o.valor })}
                  className={`h-11 cursor-pointer rounded-[10px] border text-sm font-semibold ${
                    d.decisao === o.valor ? "border-accent bg-accent text-on-accent" : "border-line bg-bg text-text"
                  }`}
                >
                  {o.rotulo}
                </button>
              ))}
            </div>
            {d.decisao === "ajustar" && (
              <Campo
                id={`nota-${h.id}`}
                rotulo={TEXTOS.contrato_revisao.oQueMuda}
                valor={d.nota}
                max={120}
                aoMudar={(v) => mudar({ nota: v })}
              />
            )}
          </Cartao>
        );
      })}
      {erro && (
        <p role="alert" className="text-sm text-warn">
          {erro}
        </p>
      )}
      <button
        type="button"
        onClick={salvar}
        disabled={!pronta || salvando}
        className={`h-14 rounded-xl text-base font-bold ${
          pronta ? "cursor-pointer bg-accent text-on-accent" : "cursor-not-allowed bg-track text-text-2"
        }`}
      >
        {salvando ? "Salvando…" : pronta ? "Salvar revisão" : "Revise cada hábito"}
      </button>
    </>
  );
}
