"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { concluirOnboarding } from "@/app/acoes";

const HORARIOS = ["07:00", "12:30", "18:30", "21:00"];

const CICLO = [
  { n: "01", titulo: "Entenda", texto: "o conceito em até 3 minutos" },
  { n: "02", titulo: "Faça", texto: "o exercício na tela, sem papel" },
  { n: "03", titulo: "Execute", texto: "check-in diário de 10 segundos" },
  { n: "04", titulo: "Meça", texto: "adesão, sequência e tendência" },
];

export function Onboarding({
  nomeInicial,
  primeiraLicao,
}: {
  nomeInicial: string;
  primeiraLicao: { id: string; titulo: string; duracao: number };
}) {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [nome, setNome] = useState(nomeInicial);
  const [hora, setHora] = useState("07:00");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, iniciarSalvamento] = useTransition();

  const nomeLimpo = nome.trim();
  const podeContinuar = passo !== 2 || nomeLimpo.length > 0;

  function comecar() {
    setErro(null);
    iniciarSalvamento(async () => {
      try {
        await concluirOnboarding({
          nome: nomeLimpo,
          hora,
          fuso: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        router.replace(`/licao/${primeiraLicao.id}`);
      } catch {
        setErro("Não foi possível salvar. Confira a conexão e tente de novo.");
      }
    });
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-7 px-6 pt-8 pb-9">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full ${i === passo ? "w-7" : "w-2.5"} ${i <= passo ? "bg-accent" : "bg-line"}`}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-text-2">{passo} de 3</span>
      </div>

      <div className="flex grow flex-col gap-[22px]">
        {passo === 1 && (
          <>
            <h1 className="text-[30px] leading-[1.15] font-bold">Como o sistema funciona</h1>
            <p className="text-base leading-[1.55] text-text-2">
              8 semanas, uma ferramenta por semana. Toda lição segue o mesmo ciclo:
            </p>
            <ol className="flex flex-col gap-2.5">
              {CICLO.map((c) => (
                <li key={c.n} className="flex items-center gap-3.5 rounded-xl border border-line bg-surface px-4 py-3.5">
                  <span className="w-[30px] font-mono text-xl font-semibold text-accent">{c.n}</span>
                  <span className="flex flex-col">
                    <span className="font-semibold">{c.titulo}</span>
                    <span className="text-sm text-text-2">{c.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}

        {passo === 2 && (
          <>
            <h1 className="text-[30px] leading-[1.15] font-bold">Dois ajustes rápidos</h1>
            <div className="flex flex-col gap-2.5">
              <label htmlFor="nome" className="text-sm font-semibold">
                Como quer ser chamado?
              </label>
              <input
                id="nome"
                type="text"
                autoComplete="given-name"
                maxLength={40}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu primeiro nome"
                className="h-[54px] w-full rounded-xl border border-line bg-input px-4 text-base outline-none focus:border-accent"
              />
            </div>
            <fieldset className="flex flex-col gap-2.5">
              <legend className="mb-2.5 text-sm font-semibold">Horário do lembrete de check-in</legend>
              <div className="grid grid-cols-4 gap-2">
                {HORARIOS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    aria-pressed={h === hora}
                    onClick={() => setHora(h)}
                    className={`h-12 cursor-pointer rounded-[10px] border font-mono text-[15px] font-semibold ${
                      h === hora ? "border-accent bg-accent text-on-accent" : "border-line bg-surface text-text"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <span className="text-[13px] text-text-2">Dá para mudar depois em Perfil.</span>
            </fieldset>
          </>
        )}

        {passo === 3 && (
          <>
            <h1 className="text-[30px] leading-[1.15] font-bold">Tudo pronto, {nomeLimpo}.</h1>
            <p className="text-base leading-[1.55] text-text-2">
              Sua primeira tarefa é mapear o que você já faz no automático. É a linha de base do seu painel.
            </p>
            <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-[18px]">
              <span className="font-mono text-[11px] tracking-[0.06em] text-accent">SEMANA 1 · {primeiraLicao.duracao} MIN</span>
              <span className="text-xl font-bold">{primeiraLicao.titulo}</span>
              <span className="text-sm leading-normal text-text-2">
                Liste 5 hábitos da sua rotina e classifique cada um: ajuda, neutro ou atrapalha.
              </span>
            </div>
          </>
        )}
      </div>

      {erro && (
        <p role="alert" className="text-sm text-warn">
          {erro}
        </p>
      )}

      <div className="flex gap-2.5">
        {passo > 1 && (
          <button
            type="button"
            onClick={() => setPasso(passo - 1)}
            disabled={salvando}
            className="h-14 cursor-pointer rounded-xl border border-line px-5 text-base font-semibold"
          >
            Voltar
          </button>
        )}
        {passo < 3 ? (
          <button
            type="button"
            onClick={() => setPasso(passo + 1)}
            disabled={!podeContinuar}
            className="h-14 grow cursor-pointer rounded-xl bg-accent text-base font-bold text-on-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            onClick={comecar}
            disabled={salvando}
            className="h-14 grow cursor-pointer rounded-xl bg-accent text-base font-bold text-on-accent disabled:opacity-60"
          >
            {salvando ? "Salvando…" : "Começar a semana 1"}
          </button>
        )}
      </div>
    </main>
  );
}
