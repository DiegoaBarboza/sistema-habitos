import Link from "next/link";
import { FraseCartao } from "@/components/frase-cartao";
import { obterFrasesVistas } from "@/lib/frase-do-dia-servidor";

export default async function MinhasFrases() {
  const frases = await obterFrasesVistas();
  return (
    <>
      <Link
        href="/perfil"
        aria-label="Voltar para Perfil"
        className="flex size-11 items-center justify-center rounded-xl border border-line"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </Link>
      <h1 className="text-[28px] font-bold">Minhas frases</h1>
      {frases.length === 0 ? (
        <p className="text-[15px] text-text-2">As frases do dia que aparecerem em Hoje ficam guardadas aqui.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {frases.map((f) => (
            <FraseCartao key={`${f.licaoId}-${f.indice}`} {...f} rotulo={`DIA ${f.dia}`} />
          ))}
        </div>
      )}
    </>
  );
}
