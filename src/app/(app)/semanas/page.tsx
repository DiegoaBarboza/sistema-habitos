import Link from "next/link";
import { resumoConclusao } from "@/lib/conteudo/resumo";
import { TOTAL_SEMANAS } from "@/lib/regras/liberacao";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterTrilha, type SemanaTrilha } from "@/lib/trilha";

export default async function Trilha() {
  const supabase = await criarClienteServidor();
  const [semanas, { data: emBreve }] = await Promise.all([
    obterTrilha(),
    supabase.from("modulos").select("id, titulo").eq("status", "em_breve").order("ordem"),
  ]);

  const concluidas = semanas.filter((s) => s.estado === "concluida").length;
  const pct = Math.round((concluidas / TOTAL_SEMANAS) * 100);

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <span className="rotulo text-xs">Módulo 1</span>
        <h1 className="text-[28px] font-bold">Hábitos</h1>
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface px-4 py-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">
            {concluidas} de {TOTAL_SEMANAS} semanas concluídas
          </span>
          <span className="font-mono text-[13px] text-accent">{pct}%</span>
        </div>
        <div
          className="h-2 rounded bg-track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Semanas concluídas"
        >
          <div className="h-full rounded bg-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {semanas.map((s) => (
          <li key={s.semana}>
            <LinhaSemana semana={s} />
          </li>
        ))}
      </ol>

      {emBreve && emBreve.length > 0 && (
        <section aria-labelledby="outros-modulos" className="mt-1.5 flex flex-col gap-2">
          <h2 id="outros-modulos" className="text-[15px] font-semibold">
            Outros módulos
          </h2>
          {emBreve.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border border-dashed border-line px-4 py-3.5"
            >
              <span className="font-semibold text-text-2">{m.titulo}</span>
              <span className="font-mono text-[11px] text-text-2">EM BREVE</span>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

function LinhaSemana({ semana: s }: { semana: SemanaTrilha }) {
  const href = `/licao/${s.licao.id}`;
  const subtitulo =
    s.estado === "concluida"
      ? resumoConclusao(s.licao.tipo_exercicio, s.progresso?.respostas ?? {})
      : s.estado === "atual"
        ? s.progresso?.iniciada_em
          ? "Em andamento · exercício pendente"
          : `Não iniciada · ${s.licao.duracao_min} min`
        : (s.motivo ?? "Bloqueada");

  const conteudo = (
    <>
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-[9px] ${
          s.estado === "bloqueada" ? "border border-line" : "bg-accent"
        }`}
      >
        {s.estado === "concluida" && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--on-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" />
          </svg>
        )}
        {s.estado === "atual" && (
          <span className="font-mono text-[13px] font-semibold text-on-accent">{s.semana}</span>
        )}
        {s.estado === "bloqueada" && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        )}
      </span>
      <span className="flex min-w-0 grow flex-col gap-0.5">
        <span className="font-mono text-[10px] tracking-[0.06em] text-text-2">SEMANA {s.semana}</span>
        <span className="text-[15px] font-semibold">{s.licao.titulo}</span>
        <span className="text-xs text-text-2">{subtitulo}</span>
      </span>
    </>
  );

  const base = "flex items-center gap-3.5 rounded-xl border bg-surface px-3.5 py-3";

  if (s.estado === "atual") {
    return (
      <div className={`${base} border-accent`}>
        {conteudo}
        <Link
          href={href}
          className="flex h-10 shrink-0 items-center rounded-[10px] bg-accent px-3.5 text-[13px] font-bold text-on-accent"
        >
          Continuar
        </Link>
      </div>
    );
  }
  if (s.estado === "concluida") {
    return (
      <Link href={href} className={`${base} border-line`} aria-label={`Semana ${s.semana}: ${s.licao.titulo}, concluída. Abrir para consultar`}>
        {conteudo}
      </Link>
    );
  }
  return <div className={`${base} border-line opacity-70`}>{conteudo}</div>;
}
