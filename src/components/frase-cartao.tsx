"use client";

import { useState } from "react";
import type { Frase } from "@/lib/conteudo/ler-licoes";
import { textoLimpo, type FormatoArte, type TemaArte } from "@/lib/frase-arte";

type Props = { licaoId: string; indice: number; frase: Frase; dia: number; tema: TemaArte; rotulo?: string };

// Frase com o trecho em destaque (entre **) na cor de acento.
function TextoFrase({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(\*\*[^*]+\*\*)/g).map((t, i) =>
        t.startsWith("**") ? (
          <span key={i} className="text-accent">
            {t.slice(2, -2)}
          </span>
        ) : (
          t
        ),
      )}
    </>
  );
}

export function FraseCartao({ licaoId, indice, frase, dia, tema, rotulo }: Props) {
  const [menu, setMenu] = useState(false);
  const [gerando, setGerando] = useState<FormatoArte | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function compartilhar(formato: FormatoArte) {
    setErro(null);
    setGerando(formato);
    try {
      const params = new URLSearchParams({ licao: licaoId, indice: String(indice), formato, tema, dia: String(dia) });
      const resposta = await fetch(`/api/frase/imagem?${params}`);
      if (!resposta.ok) throw new Error();
      const arquivo = new File([await resposta.blob()], `trilho-dia-${dia}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo] }).catch(() => {});
      } else {
        // Computador ou navegador sem compartilhamento de arquivos: baixa a imagem.
        const url = URL.createObjectURL(arquivo);
        const a = Object.assign(document.createElement("a"), { href: url, download: arquivo.name });
        a.click();
        URL.revokeObjectURL(url);
      }
      setMenu(false);
    } catch {
      setErro("Não foi possível gerar a imagem. Confira a conexão e tente de novo.");
    }
    setGerando(null);
  }

  return (
    <figure className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-4">
      <span className="font-mono text-[10px] tracking-[0.06em] text-text-2">{rotulo ?? `FRASE DO DIA · DIA ${dia}`}</span>
      <blockquote className="text-lg leading-snug font-bold" aria-label={textoLimpo(frase.texto)}>
        <TextoFrase texto={frase.texto} />
      </blockquote>
      <div className="flex items-end justify-between gap-3">
        <figcaption className="flex min-w-0 flex-col text-xs text-text-2">
          {frase.autor && <span className="font-semibold text-text">{frase.autor}</span>}
          {frase.fonte && <span className="font-mono">{frase.fonte}</span>}
        </figcaption>
        <button
          type="button"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
          className="flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border border-line px-3 text-[13px] font-semibold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" />
          </svg>
          Compartilhar
        </button>
      </div>
      {menu && (
        <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Formato da imagem">
          {(
            [
              ["status", "Status / stories"],
              ["feed", "Feed"],
            ] as const
          ).map(([f, nome]) => (
            <button
              key={f}
              type="button"
              disabled={gerando !== null}
              onClick={() => compartilhar(f)}
              className="min-h-11 cursor-pointer rounded-[10px] border border-line bg-bg px-2 text-[13px] font-semibold disabled:opacity-60"
            >
              {gerando === f ? "Gerando…" : nome}
            </button>
          ))}
        </div>
      )}
      {erro && (
        <p role="alert" className="text-sm text-warn">
          {erro}
        </p>
      )}
    </figure>
  );
}
