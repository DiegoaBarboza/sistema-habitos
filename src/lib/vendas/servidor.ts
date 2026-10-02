import "server-only";
import { MODULO_ATUAL } from "@/lib/modulo";
import { criarClienteServico } from "@/lib/supabase/servico";
import type { Pedido } from "./kiwify";
import { liquidoKiwify } from "./taxas";

export const FUNDADOR = "trilho_fundador_47";
export const OFICIAL = "trilho_oficial_97";

export type Oferta = {
  codigo: string;
  nome: string;
  preco: number;
  plano: string;
  modulo_id: string;
  vagas: number | null;
  kiwify_product_id: string | null;
  ativa: boolean;
};

export type OfertaAtual = { codigo: string; preco: number; checkoutUrl: string | null; vagasRestantes: number | null };

async function vendasAprovadas(codigo: string) {
  const { count, error } = await criarClienteServico()
    .from("vendas")
    .select("id", { count: "exact", head: true })
    .eq("oferta_codigo", codigo)
    .eq("status", "aprovada");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Lote 1 enquanto houver vaga; depois, Lote 2. O link de cada lote vem do .env.
export async function obterOfertaAtual(): Promise<OfertaAtual> {
  const fundador = { codigo: FUNDADOR, preco: 47, checkoutUrl: process.env.KIWIFY_CHECKOUT_URL ?? null };
  const oficial = { codigo: OFICIAL, preco: 97, checkoutUrl: process.env.KIWIFY_CHECKOUT_URL_OFICIAL ?? null };
  try {
    const { data } = await criarClienteServico().from("ofertas").select("vagas").eq("codigo", FUNDADOR).maybeSingle();
    const vagas = (data?.vagas as number | null) ?? 100;
    const restantes = Math.max(0, vagas - (await vendasAprovadas(FUNDADOR)));
    return restantes > 0 ? { ...fundador, vagasRestantes: restantes } : { ...oficial, vagasRestantes: null };
  } catch {
    // Banco sem a migração ou fora do ar: o site continua de pé, sem o contador.
    return { ...fundador, vagasRestantes: null };
  }
}

// Aplica um pedido da Kiwify: grava a venda e libera ou bloqueia o acesso ao módulo.
export async function aplicarPedido(p: Pedido): Promise<string> {
  if (!p.evento) return `ignorado (${p.eventoOriginal ?? "sem evento"})`;
  if (!p.orderId || !p.email) return "recusado: pedido sem order_id ou e-mail";

  const db = criarClienteServico();
  const { data: oferta } = p.productId
    ? await db.from("ofertas").select("*").eq("kiwify_product_id", p.productId).maybeSingle<Oferta>()
    : { data: null };
  // Produto ainda não cadastrado em ofertas: libera o módulo atual mesmo assim, pra nenhum comprador ficar sem acesso.
  const modulo = oferta?.modulo_id ?? MODULO_ATUAL;
  const plano = oferta?.plano ?? "vitalicio";
  const bruto = oferta ? Number(oferta.preco) : null;

  const { error: erroVenda } = await db.from("vendas").upsert(
    {
      kiwify_order_id: p.orderId,
      email: p.email,
      oferta_codigo: oferta?.codigo ?? null,
      status: p.evento,
      valor_bruto: bruto,
      valor_liquido: bruto === null ? null : liquidoKiwify(bruto),
      plano,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "kiwify_order_id" },
  );
  if (erroVenda) throw new Error(`venda: ${erroVenda.message}`);

  if (p.evento === "aprovada") {
    const { error } = await db.from("acessos").upsert(
      { email: p.email, modulo_id: modulo, origem: "kiwify", status: "ativo", kiwify_order_id: p.orderId, plano },
      { onConflict: "email,modulo_id" },
    );
    if (error) throw new Error(`acesso: ${error.message}`);
    return `liberado ${modulo} para ${p.email}${oferta ? ` (${oferta.codigo})` : " (produto sem oferta cadastrada)"}`;
  }

  // Reembolso, chargeback ou cancelamento: bloqueia só o acesso que veio deste pedido.
  const { error } = await db.from("acessos").update({ status: "revogado" }).eq("kiwify_order_id", p.orderId);
  if (error) throw new Error(`acesso: ${error.message}`);
  return `bloqueado ${modulo} para ${p.email} (${p.evento})`;
}

export async function registrarWebhook(registro: {
  evento: string | null;
  autenticado: boolean;
  resultado: string;
  payload: unknown;
}) {
  await criarClienteServico().from("webhook_logs").insert(registro);
}
