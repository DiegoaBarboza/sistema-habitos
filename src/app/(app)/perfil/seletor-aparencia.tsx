"use client";

import { salvarTema } from "@/app/acoes";
import { useTema } from "@/components/tema-provider";
import type { Tema } from "@/lib/tema";

const OPCOES: { valor: Tema; rotulo: string }[] = [
  { valor: "auto", rotulo: "Automático" },
  { valor: "escuro", rotulo: "Escuro" },
  { valor: "claro", rotulo: "Claro" },
];

export function SeletorAparencia() {
  const { tema, sistemaEscuro, setTema } = useTema();

  const apoio =
    tema === "auto"
      ? `Segue o tema do seu celular (agora: ${sistemaEscuro ? "escuro" : "claro"}).`
      : `Fixo no tema ${tema}, independente do celular.`;

  return (
    <section aria-labelledby="rotulo-aparencia" className="flex flex-col gap-2.5">
      <h2 id="rotulo-aparencia" className="rotulo">
        Aparência
      </h2>
      <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-surface p-1">
        {OPCOES.map((opcao) => {
          const ativa = opcao.valor === tema;
          return (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={ativa}
              onClick={() => {
                setTema(opcao.valor);
                salvarTema(opcao.valor).catch(() => {});
              }}
              className={`h-11 cursor-pointer rounded-[9px] text-sm font-semibold ${
                ativa ? "bg-accent text-on-accent" : "bg-transparent text-text-2"
              }`}
            >
              {opcao.rotulo}
            </button>
          );
        })}
      </div>
      <p className="text-[13px] leading-normal text-text-2">{apoio}</p>
    </section>
  );
}
