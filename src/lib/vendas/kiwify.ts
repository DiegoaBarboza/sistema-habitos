// Leitura do webhook da Kiwify. O formato exato só é confirmado com um pedido de teste real:
// por isso o leitor aceita os nomes de campo conhecidos e tudo o que chega fica em webhook_logs.

import { createHmac, timingSafeEqual } from "node:crypto";

export type EventoVenda = "aprovada" | "reembolsada" | "chargeback" | "cancelada";

export type Pedido = {
  evento: EventoVenda | null; // null = evento que não muda acesso (boleto gerado, carrinho abandonado...)
  eventoOriginal: string | null;
  orderId: string | null;
  email: string | null;
  productId: string | null;
};

const EVENTOS: Record<string, EventoVenda> = {
  order_approved: "aprovada",
  paid: "aprovada",
  approved: "aprovada",
  order_refunded: "reembolsada",
  refunded: "reembolsada",
  chargeback: "chargeback",
  chargedback: "chargeback",
  subscription_canceled: "cancelada",
  canceled: "cancelada",
};

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" ? (v as Obj) : {});
const texto = (...vs: unknown[]) => {
  for (const v of vs) if (typeof v === "string" && v.trim()) return v.trim();
  for (const v of vs) if (typeof v === "number") return String(v);
  return null;
};

export function lerPedido(corpo: unknown): Pedido {
  const b = obj(corpo);
  const cliente = obj(b.Customer ?? b.customer);
  const produto = obj(b.Product ?? b.product);
  const eventoOriginal = texto(b.webhook_event_type, b.event, b.order_status, b.status);
  const email = texto(cliente.email, b.email)?.toLowerCase() ?? null;
  return {
    evento: eventoOriginal ? (EVENTOS[eventoOriginal.toLowerCase()] ?? null) : null,
    eventoOriginal,
    orderId: texto(b.order_id, b.order_ref, b.id),
    email,
    productId: texto(produto.product_id, produto.id, b.product_id),
  };
}

// A Kiwify assina o corpo com HMAC-SHA1 usando o token do webhook e manda em ?signature=.
// Também aceitamos ?token= igual ao token, pra testes manuais.
export function autenticado(corpoBruto: string, params: URLSearchParams, token: string) {
  const assinatura = params.get("signature");
  if (assinatura) {
    const esperada = createHmac("sha1", token).update(corpoBruto).digest("hex");
    return iguais(assinatura, esperada);
  }
  const t = params.get("token");
  return t !== null && iguais(t, token);
}

function iguais(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
