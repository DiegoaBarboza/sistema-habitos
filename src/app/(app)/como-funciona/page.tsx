import Link from "next/link";
import { ComoFuncionaSistema, ComoUsarApp } from "@/components/tutorial";

export default function ComoFunciona() {
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
      <section className="flex flex-col gap-[22px]">
        <ComoFuncionaSistema />
      </section>
      <section className="flex flex-col gap-[22px]">
        <ComoUsarApp Titulo="h2" />
      </section>
    </>
  );
}
