// E-mails de administrador (ADMIN_EMAILS, separados por vírgula). O admin vê o painel de vendas
// e tem todos os módulos ativos liberados, sem precisar de compra.
const ADMINS = (process.env.ADMIN_EMAILS ?? "diegono@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function ehAdmin(email: string) {
  return ADMINS.includes(email.trim().toLowerCase());
}
