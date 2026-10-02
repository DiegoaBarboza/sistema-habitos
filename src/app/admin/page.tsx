import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obterSessao } from "@/lib/perfil";
import { criarClienteServico } from "@/lib/supabase/servico";
import { reais, taxaKiwify } from "@/lib/vendas/taxas";

export const metadata: Metadata = { title: "Painel · Trilho", robots: { index: false } };

// Só os e-mails de ADMIN_EMAILS (separados por vírgula) enxergam o painel; pros outros a página não existe.
const ADMINS = (process.env.ADMIN_EMAILS ?? "diegono@gmail.com").split(",").map((e) => e.trim().toLowerCase());

type Venda = {
  kiwify_order_id: string;
  email: string;
  oferta_codigo: string | null;
  status: string;
  valor_bruto: number | null;
  valor_liquido: number | null;
  criado_em: string;
};

export default async function Admin() {
  const { email } = await obterSessao();
  if (!ADMINS.includes(email.toLowerCase())) notFound();

  const db = criarClienteServico();
  const [{ data: ofertas }, { data: vendas }, { data: logs }] = await Promise.all([
    db.from("ofertas").select("codigo, nome, preco, vagas, kiwify_product_id").order("ordem"),
    db.from("vendas").select("kiwify_order_id, email, oferta_codigo, status, valor_bruto, valor_liquido, criado_em").order("criado_em", { ascending: false }).returns<Venda[]>(),
    db.from("webhook_logs").select("recebido_em, evento, autenticado, resultado").order("recebido_em", { ascending: false }).limit(10),
  ]);

  const lista = vendas ?? [];
  const aprovadas = lista.filter((v) => v.status === "aprovada");
  const perdidas = lista.filter((v) => v.status !== "aprovada");
  const soma = (vs: Venda[], campo: "valor_bruto" | "valor_liquido") => vs.reduce((t, v) => t + Number(v[campo] ?? 0), 0);
  const brutoTotal = soma(aprovadas, "valor_bruto");
  const liquidoTotal = soma(aprovadas, "valor_liquido");
  const data = (iso: string) => new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10">
      <h1 className="text-[28px] font-bold">Painel de vendas</h1>

      <div className="grid gap-3 sm:grid-cols-4">
        <Numero rotulo="VENDAS APROVADAS" valor={String(aprovadas.length)} />
        <Numero rotulo="FATURAMENTO BRUTO" valor={reais(brutoTotal)} />
        <Numero rotulo="TAXAS KIWIFY" valor={reais(brutoTotal - liquidoTotal)} />
        <Numero rotulo="LÍQUIDO" valor={reais(liquidoTotal)} destaque />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="rotulo">Lotes</h2>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[11px] text-text-2">
              <tr>
                {["Lote", "Preço", "Líquido por venda", "Vendidas", "Vagas restantes", "Líquido do lote", "Produto Kiwify"].map((c) => (
                  <th key={c} className="px-4 py-3 font-normal">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(ofertas ?? []).map((o) => {
                const vendidas = aprovadas.filter((v) => v.oferta_codigo === o.codigo);
                const preco = Number(o.preco);
                return (
                  <tr key={o.codigo} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold">{o.nome}</td>
                    <td className="px-4 py-3">{reais(preco)}</td>
                    <td className="px-4 py-3">{reais(preco - taxaKiwify(preco))}</td>
                    <td className="px-4 py-3">{vendidas.length}</td>
                    <td className="px-4 py-3">{o.vagas ? Math.max(0, o.vagas - vendidas.length) : "sem limite"}</td>
                    <td className="px-4 py-3 text-accent">{reais(soma(vendidas, "valor_liquido"))}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{o.kiwify_product_id ?? "não cadastrado"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {perdidas.length > 0 && (
          <p className="text-sm text-warn">
            {perdidas.length} pedido(s) reembolsado(s), cancelado(s) ou com chargeback ({reais(soma(perdidas, "valor_bruto"))} bruto).
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="rotulo">Últimos pedidos</h2>
        <ul className="flex flex-col divide-y divide-line rounded-xl border border-line bg-surface text-sm">
          {lista.slice(0, 30).map((v) => (
            <li key={v.kiwify_order_id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="font-semibold">{v.email}</span>
              <span className="text-text-2">{v.oferta_codigo ?? "sem lote"} · {data(v.criado_em)}</span>
              <span className={v.status === "aprovada" ? "text-accent" : "text-warn"}>
                {v.status} · {v.valor_liquido === null ? "—" : reais(Number(v.valor_liquido))}
              </span>
            </li>
          ))}
          {lista.length === 0 && <li className="px-4 py-3 text-text-2">Nenhum pedido ainda.</li>}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="rotulo">Últimos avisos da Kiwify (webhook)</h2>
        <ul className="flex flex-col divide-y divide-line rounded-xl border border-line bg-surface font-mono text-xs">
          {(logs ?? []).map((l, i) => (
            <li key={i} className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-3">
              <span className="text-text-2">{data(l.recebido_em)}</span>
              <span>{l.evento ?? "—"}</span>
              <span className={l.autenticado ? "text-accent" : "text-warn"}>{l.autenticado ? "autenticado" : "recusado"}</span>
              <span className="text-text-2">{l.resultado}</span>
            </li>
          ))}
          {(logs ?? []).length === 0 && <li className="px-4 py-3 text-text-2">Nenhum aviso recebido ainda.</li>}
        </ul>
      </section>
    </main>
  );
}

function Numero({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4">
      <span className="font-mono text-[10px] tracking-[0.06em] text-text-2">{rotulo}</span>
      <span className={`text-2xl font-bold ${destaque ? "text-accent" : ""}`}>{valor}</span>
    </div>
  );
}
