import "server-only";
import webpush from "web-push";

export type Inscricao = { endpoint: string; chaves: { p256dh: string; auth: string } };

let configurado = false;
function configurar() {
  if (configurado) return;
  const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error("Faltam VAPID_SUBJECT, VAPID_PUBLIC_KEY ou VAPID_PRIVATE_KEY");
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configurado = true;
}

// "expirada" = o navegador descartou a inscrição (404/410); ela deve ser apagada.
export async function enviarPush(inscricao: Inscricao, corpo: string): Promise<"ok" | "expirada" | "erro"> {
  configurar();
  try {
    await webpush.sendNotification(
      { endpoint: inscricao.endpoint, keys: inscricao.chaves },
      JSON.stringify({ titulo: "Trilho", corpo, url: "/hoje" }),
      { TTL: 60 * 60 },
    );
    return "ok";
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    return status === 404 || status === 410 ? "expirada" : "erro";
  }
}
