"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { TextoMd } from "@/components/texto-md";
import type { ConteudoLicao, TipoExercicio } from "@/lib/conteudo/ler-licoes";
import { etapaAtual, podeConcluir, ROTULO_PENDENTE, type Contexto } from "@/lib/exercicios/regras";
import { concluirLicao, iniciarLicao, salvarRespostas } from "../acoes";
import {
  EncadeamentoFaca,
  IdentidadeCompromisso,
  IdentidadeFaca,
  InventarioCompromisso,
  InventarioFaca,
  PlanoGatilhoFaca,
  type Dados30d,
  type PropsExercicio,
} from "./exercicios-1a4";
import { AmbienteFaca, ContratoRevisaoFaca, RecuperacaoFaca, VersaoMinimaFaca } from "./exercicios-5a8";

type Componente = (p: PropsExercicio<unknown>) => React.ReactNode;
// Cada exercício tipa as próprias respostas; aqui o formato vem de normalizar(tipo, …).
const c = <T,>(f: (p: PropsExercicio<T>) => React.ReactNode) => f as unknown as Componente;

const FACA: Record<TipoExercicio, Componente> = {
  inventario: c(InventarioFaca),
  identidade: c(IdentidadeFaca),
  plano_gatilho: c(PlanoGatilhoFaca),
  encadeamento: c(EncadeamentoFaca),
  ambiente: c(AmbienteFaca),
  versao_minima: c(VersaoMinimaFaca),
  recuperacao: c(RecuperacaoFaca),
  contrato_revisao: c(ContratoRevisaoFaca),
};

const COMPROMISSO: Partial<Record<TipoExercicio, Componente>> = {
  inventario: c(InventarioCompromisso),
  identidade: c(IdentidadeCompromisso),
};

const ESPERA_SALVAR_MS = 600;
const POR_HABITO: TipoExercicio[] = ["plano_gatilho", "ambiente", "versao_minima", "recuperacao", "contrato_revisao"];

type Props = {
  licao: { id: string; semana: number; titulo: string; duracao_min: number; tipo_exercicio: TipoExercicio; conteudo: ConteudoLicao };
  respostasIniciais: unknown;
  iniciada: boolean;
  concluida: boolean;
  ctx: Contexto;
  sugestoesAncora: string[];
  dados30d: Dados30d;
};

export function LicaoTela({ licao, respostasIniciais, iniciada, concluida: jaConcluida, ctx, sugestoesAncora, dados30d }: Props) {
  const tipo = licao.tipo_exercicio;
  const [respostas, setRespostas] = useState(respostasIniciais);
  const [concluida, setConcluida] = useState(jaConcluida);
  const [editada, setEditada] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [concluindo, iniciarConclusao] = useTransition();
  const pendente = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ultimo = useRef(respostasIniciais);

  useEffect(() => {
    if (!iniciada) iniciarLicao(licao.id).catch(() => {});
  }, [iniciada, licao.id]);

  // Salvamento automático com debounce; ao sair da página, grava o que estiver pendente.
  useEffect(() => {
    if (ultimo.current === respostas) return;
    ultimo.current = respostas;
    if (pendente.current) clearTimeout(pendente.current);
    pendente.current = setTimeout(() => {
      pendente.current = null;
      salvarRespostas(licao.id, respostas)
        .then(() => setErro(null))
        .catch(() => setErro("Não foi possível salvar. Confira a conexão."));
    }, ESPERA_SALVAR_MS);
  }, [respostas, licao.id]);

  useEffect(() => {
    return () => {
      if (pendente.current) {
        clearTimeout(pendente.current);
        salvarRespostas(licao.id, ultimo.current).catch(() => {});
      }
    };
  }, [licao.id]);

  const mudar = (r: unknown) => {
    setRespostas(r);
    setEditada(true);
  };

  const pronta = podeConcluir(tipo, respostas, ctx);
  const etapa = etapaAtual(tipo, respostas, ctx);
  const sucesso = concluida && !editada;
  const semHabitos = POR_HABITO.includes(tipo) && ctx.habitos.length === 0;

  function concluir() {
    if (!pronta) return;
    if (pendente.current) clearTimeout(pendente.current);
    pendente.current = null;
    setErro(null);
    iniciarConclusao(async () => {
      try {
        await concluirLicao(licao.id, respostas);
        setConcluida(true);
        setEditada(false);
      } catch {
        setErro("Não foi possível concluir. Confira a conexão e tente de novo.");
      }
    });
  }

  const Faca = FACA[tipo];
  const Compromisso = COMPROMISSO[tipo];
  const props = { r: respostas, set: mudar, ctx, sugestoesAncora, dados30d };
  const { entenda, compromisso, para_ir_alem } = licao.conteudo;
  const barras = [true, etapa !== "entenda" || concluida, etapa === "compromisso" || concluida];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-line bg-nav px-5 pt-4 pb-3.5">
        <div className="flex items-center gap-3">
          <Link
            href="/semanas"
            aria-label="Voltar para Semanas"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          <div className="flex min-w-0 flex-col">
            <span className="font-mono text-[11px] tracking-[0.06em] text-text-2">
              SEMANA {licao.semana} · {licao.duracao_min} MIN
            </span>
            <h1 className="truncate text-[17px] font-bold">{licao.titulo}</h1>
          </div>
        </div>
        <ol className="grid grid-cols-3 gap-1.5" aria-label="Etapas da lição">
          {["Entenda", "Faça", "Compromisso"].map((nome, i) => (
            <li key={nome} className="flex flex-col gap-1">
              <span className={`h-1 rounded-sm ${barras[i] ? "bg-accent" : "bg-track"}`} />
              <span className="text-[11px] text-text-2">{nome}</span>
            </li>
          ))}
        </ol>
      </header>

      <main className="flex flex-col gap-[26px] px-5 pt-6 pb-8">
        <section className="flex flex-col gap-3.5" aria-labelledby="entenda">
          <span className="font-mono text-xs tracking-[0.08em] text-accent">01 · ENTENDA</span>
          <h2 id="entenda" className="text-2xl leading-tight font-bold">
            {entenda.titulo}
          </h2>
          {entenda.paragrafos.map((p, i) => (
            <p key={i} className="text-base leading-relaxed">
              <TextoMd texto={p} />
            </p>
          ))}
          <div className="flex gap-3 rounded-xl border border-line bg-surface px-4 py-3.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-px shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            <p className="text-[15px] leading-normal">
              <strong>Pergunta-teste:</strong> <TextoMd texto={entenda.pergunta} />
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3" aria-label="Faça">
          <span className="font-mono text-xs tracking-[0.08em] text-accent">02 · FAÇA</span>
          {semHabitos ? (
            <p className="text-sm text-text-2">Você ainda não tem hábitos ativos. Conclua a semana 2 primeiro.</p>
          ) : (
            <Faca {...props} />
          )}
        </section>

        <section className="flex flex-col gap-3" aria-label="Compromisso">
          <span className="font-mono text-xs tracking-[0.08em] text-accent">03 · COMPROMISSO</span>
          {Compromisso ? null : (
            <p className="text-[15px] leading-normal">
              <TextoMd texto={compromisso[0]} />
            </p>
          )}
          {tipo === "identidade" && (
            <p className="text-[15px] leading-normal">
              <TextoMd texto={compromisso[0]} />
            </p>
          )}
          {Compromisso && <Compromisso {...props} />}
        </section>

        {erro && (
          <p role="alert" className="text-sm text-warn">
            {erro}
          </p>
        )}

        {sucesso ? (
          <Link
            href="/hoje"
            className="flex h-14 items-center justify-center rounded-xl bg-success text-base font-bold text-on-accent"
          >
            Lição concluída · voltar para Hoje
          </Link>
        ) : (
          <button
            type="button"
            onClick={concluir}
            disabled={!pronta || concluindo}
            className={`h-14 rounded-xl text-base font-bold ${
              pronta ? "cursor-pointer bg-accent text-on-accent" : "cursor-not-allowed bg-track text-text-2"
            }`}
          >
            {concluindo ? "Concluindo…" : pronta ? "Concluir lição" : ROTULO_PENDENTE[tipo]}
          </button>
        )}

        <div className="flex flex-col gap-1 border-t border-line pt-4">
          <span className="rotulo">Para ir além</span>
          <p className="text-sm leading-normal text-text-2">
            <TextoMd texto={para_ir_alem} />
          </p>
        </div>
      </main>
    </div>
  );
}
