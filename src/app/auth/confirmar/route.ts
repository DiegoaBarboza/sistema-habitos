import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";

// Destino do link mágico. Aceita os dois formatos que o Supabase pode mandar:
// ?code= (modelo de e-mail padrão, PKCE) e ?token_hash=&type= (modelo personalizado).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await criarClienteServidor();
  let ok = false;

  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }

  // Liga as compras e liberações feitas para este e-mail ao usuário que acabou de entrar.
  if (ok) await supabase.rpc("vincular_acessos");

  return NextResponse.redirect(new URL(ok ? "/hoje" : "/entrar?erro=link", origin));
}
