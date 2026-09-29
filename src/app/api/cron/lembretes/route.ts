import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { diaNoFuso } from "@/lib/datas";
import { somarDias, type CheckinInd } from "@/lib/indicadores";
import { decidirLembrete, type HabitoLembrete } from "@/lib/lembrete";
import { enviarPush, type Inscricao } from "@/lib/push";

// Chamado a cada 15 minutos pelo agendador, com "Authorization: Bearer CRON_SECRET".
// Com ?diagnostico=1 a resposta explica, por usuário, por que enviou ou não.
export async function GET(request: NextRequest) {
  const diagnostico = request.nextUrl.searchParams.get("diagnostico") === "1";
  const relatorio: { usuario: string; resultado: string }[] = [];
  const anotar = (usuario: string, resultado: string) => diagnostico && relatorio.push({ usuario: usuario.slice(0, 8), resultado });
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const agora = new Date();

  // Só quem tem lembrete ligado e pelo menos uma inscrição de push.
  const { data: inscricoes, error } = await supabase
    .from("push_inscricoes")
    .select("id, user_id, endpoint, chaves");
  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  const porUsuario = new Map<string, { id: string; endpoint: string; chaves: Inscricao["chaves"] }[]>();
  for (const i of inscricoes) porUsuario.set(i.user_id, [...(porUsuario.get(i.user_id) ?? []), i]);
  if (!porUsuario.size) {
    return NextResponse.json(diagnostico ? { enviados: 0, motivo: "nenhum aparelho inscrito (ligue o lembrete no Perfil)" } : { enviados: 0 });
  }

  const { data: perfis, error: erroPerfis } = await supabase
    .from("perfis")
    .select("user_id, fuso, lembrete_hora, lembrete_enviado_em")
    .eq("lembrete_ativo", true)
    .eq("onboarding_ok", true)
    .in("user_id", [...porUsuario.keys()]);
  if (erroPerfis) return NextResponse.json({ erro: erroPerfis.message }, { status: 500 });
  for (const id of porUsuario.keys()) {
    if (!perfis.some((p) => p.user_id === id)) anotar(id, "lembrete desligado no Perfil");
  }

  let enviados = 0;
  for (const perfil of perfis) {
    const dia = diaNoFuso(agora, perfil.fuso);
    const [habitos, checkins] = await Promise.all([
      supabase
        .from("habitos")
        .select("id, nome, criado_em, removido_em, aviso_falha")
        .eq("user_id", perfil.user_id)
        .returns<HabitoLembrete[]>(),
      supabase
        .from("checkins")
        .select("habito_id, dia, estado")
        .eq("user_id", perfil.user_id)
        .gte("dia", somarDias(dia, -1))
        .returns<CheckinInd[]>(),
    ]);
    if (habitos.error || checkins.error) {
      anotar(perfil.user_id, `erro ao ler dados: ${(habitos.error ?? checkins.error)!.message}`);
      continue;
    }

    const { texto, motivo } = decidirLembrete({
      agora,
      fuso: perfil.fuso,
      lembreteHora: perfil.lembrete_hora,
      enviadoEm: perfil.lembrete_enviado_em,
      habitos: habitos.data,
      checkins: checkins.data,
    });
    if (!texto) {
      anotar(perfil.user_id, motivo);
      continue;
    }

    let chegou = false;
    const resultados: string[] = [];
    for (const inscricao of porUsuario.get(perfil.user_id) ?? []) {
      const r = await enviarPush(inscricao, texto);
      resultados.push(r);
      if (r === "ok") chegou = true;
      if (r === "expirada") await supabase.from("push_inscricoes").delete().eq("id", inscricao.id);
    }
    anotar(perfil.user_id, `envio: ${resultados.join(", ")}`);
    if (chegou) {
      await supabase.from("perfis").update({ lembrete_enviado_em: dia }).eq("user_id", perfil.user_id);
      enviados++;
    }
  }

  return NextResponse.json(diagnostico ? { enviados, relatorio } : { enviados });
}
