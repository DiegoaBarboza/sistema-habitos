import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { autenticado, lerPedido } from "./kiwify";

describe("webhook da Kiwify", () => {
  it("lê o formato da Kiwify (Customer/Product com maiúscula)", () => {
    expect(
      lerPedido({
        order_id: "abc-123",
        order_status: "paid",
        webhook_event_type: "order_approved",
        Product: { product_id: "prod-1", product_name: "Trilho" },
        Customer: { email: "Pessoa@Email.com", full_name: "Pessoa" },
      }),
    ).toEqual({ evento: "aprovada", eventoOriginal: "order_approved", orderId: "abc-123", email: "pessoa@email.com", productId: "prod-1" });
  });

  it("aceita o formato simples { email, status, product_id }", () => {
    const p = lerPedido({ email: "a@b.com", status: "order_refunded", product_id: "prod-1", order_id: "x" });
    expect(p.evento).toBe("reembolsada");
    expect(p.email).toBe("a@b.com");
  });

  it("chargeback e cancelamento bloqueiam; boleto gerado não muda nada", () => {
    expect(lerPedido({ webhook_event_type: "chargeback" }).evento).toBe("chargeback");
    expect(lerPedido({ webhook_event_type: "subscription_canceled" }).evento).toBe("cancelada");
    expect(lerPedido({ webhook_event_type: "billet_created" }).evento).toBeNull();
  });

  it("confere a assinatura HMAC-SHA1 ou o token", () => {
    const corpo = '{"order_id":"1"}';
    const sig = createHmac("sha1", "segredo").update(corpo).digest("hex");
    expect(autenticado(corpo, new URLSearchParams({ signature: sig }), "segredo")).toBe(true);
    expect(autenticado(corpo, new URLSearchParams({ signature: "errada" }), "segredo")).toBe(false);
    expect(autenticado(corpo, new URLSearchParams({ token: "segredo" }), "segredo")).toBe(true);
    expect(autenticado(corpo, new URLSearchParams(), "segredo")).toBe(false);
  });
});
