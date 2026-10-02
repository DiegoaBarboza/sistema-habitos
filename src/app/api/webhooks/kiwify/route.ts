import { NextResponse, type NextRequest } from "next/server";
import { autenticado, lerPedido } from "@/lib/vendas/kiwify";
import { aplicarPedido, registrarWebhook } from "@/lib/vendas/servidor";

// Webhook da Kiwify: compra aprovada libera o módulo; reembolso, chargeback ou cancelamento bloqueia.
// Configurar na Kiwify: https://www.trilhoapp.com.br/api/webhooks/kiwify com o token igual a KIWIFY_WEBHOOK_TOKEN.
export async function POST(request: NextRequest) {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!token) return NextResponse.json({ erro: "KIWIFY_WEBHOOK_TOKEN não configurado" }, { status: 500 });

  const corpoBruto = await request.text();
  let corpo: unknown = null;
  try {
    corpo = JSON.parse(corpoBruto);
  } catch {
    corpo = { corpo_invalido: corpoBruto.slice(0, 2000) };
  }

  const ok = autenticado(corpoBruto, request.nextUrl.searchParams, token);
  const pedido = lerPedido(corpo);

  if (!ok) {
    await registrarWebhook({ evento: pedido.eventoOriginal, autenticado: false, resultado: "recusado: assinatura inválida", payload: corpo });
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  try {
    const resultado = await aplicarPedido(pedido);
    await registrarWebhook({ evento: pedido.eventoOriginal, autenticado: true, resultado, payload: corpo });
    return NextResponse.json({ ok: true, resultado });
  } catch (e) {
    const resultado = `erro: ${e instanceof Error ? e.message : String(e)}`;
    await registrarWebhook({ evento: pedido.eventoOriginal, autenticado: true, resultado, payload: corpo });
    // 500 faz a Kiwify tentar de novo mais tarde.
    return NextResponse.json({ erro: resultado }, { status: 500 });
  }
}
