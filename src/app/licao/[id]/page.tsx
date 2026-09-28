import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { exigirModuloHabitos } from "@/lib/perfil";
import { obterTrilha } from "@/lib/trilha";

export default async function Licao({ params }: PageProps<"/licao/[id]">) {
  const { id } = await params;
  const { perfil } = await exigirModuloHabitos();
  if (!perfil.onboarding_ok) redirect("/boas-vindas");

  const semana = (await obterTrilha()).find((s) => s.licao.id === id);
  if (!semana) notFound();
  if (semana.estado === "bloqueada") redirect("/trilha");

  const { licao } = semana;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-6 px-5 pt-6 pb-10">
      <Link href="/trilha" className="flex h-11 w-fit items-center gap-1.5 text-sm font-semibold text-text-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Trilha
      </Link>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-[0.08em] text-accent">
          SEMANA {licao.semana} · {licao.duracao_min} MIN
        </span>
        <h1 className="text-[26px] leading-tight font-bold">{licao.titulo}</h1>
      </div>
      <p className="text-sm text-text-2">O conteúdo da lição entra no marco 5.</p>
    </main>
  );
}
