import { redirect } from "next/navigation";
import { obterModuloAtual } from "@/lib/modulo-servidor";
import { obterProgresso } from "@/lib/progresso";
import { criarClienteServidor } from "@/lib/supabase/server";

// Conclusão do módulo (semana 8, Compromisso): resumo das 8 semanas e os módulos em breve.
export default async function Concluido() {
  const supabase = await criarClienteServidor();
  const [p, modulo, { data: emBreve }] = await Promise.all([
    obterProgresso("tudo"),
    obterModuloAtual(),
    supabase.from("modulos").select("id, titulo").eq("status", "em_breve").order("ordem"),
  ]);
  if (!p.moduloConcluido) redirect("/semanas");

  const itens = [
    { rotulo: "ADESÃO TOTAL", valor: p.adesao.taxa === null ? "—" : `${Math.round(p.adesao.taxa * 100)}%` },
    { rotulo: "RECORDE SEM FALHA 2X", valor: `${p.semFalha2x.recorde}d` },
    { rotulo: "DIAS SALVOS PELO MÍNIMO", valor: String(p.minimo) },
  ];

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <span className="rotulo text-xs">
          Módulo {modulo.ordem} · {modulo.titulo}
        </span>
        <h1 className="text-[28px] leading-tight font-bold">8 semanas concluídas</h1>
      </div>
      <dl className="flex flex-col gap-2">
        {itens.map((i) => (
          <div key={i.rotulo} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3.5">
            <dt className="font-mono text-[11px] tracking-[0.06em] text-text-2">{i.rotulo}</dt>
            <dd className="font-mono text-2xl font-semibold text-accent">{i.valor}</dd>
          </div>
        ))}
      </dl>
      {emBreve && emBreve.length > 0 && (
        <section aria-labelledby="em-breve" className="flex flex-col gap-2">
          <h2 id="em-breve" className="text-[15px] font-semibold">
            Outros módulos
          </h2>
          {emBreve.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl border border-dashed border-line px-4 py-3.5">
              <span className="font-semibold text-text-2">{m.titulo}</span>
              <span className="font-mono text-[11px] text-text-2">EM BREVE</span>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
