import Link from "next/link";
import { Marca } from "@/components/marca";
import { VERSAO_DOCUMENTOS } from "@/lib/responsavel";

// Moldura das páginas públicas de texto (Privacidade e Termos).
export function Documento({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col gap-6 px-6 pt-10 pb-16">
      <Link href="/entrar" className="w-fit">
        <Marca />
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] leading-tight font-bold">{titulo}</h1>
        <span className="font-mono text-xs text-text-2">Versão de {VERSAO_DOCUMENTOS}</span>
      </div>
      <div className="documento flex flex-col gap-4 text-[15px] leading-relaxed">{children}</div>
    </main>
  );
}
