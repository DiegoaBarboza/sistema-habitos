import { NextResponse } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";

// Perfil → Exportar meus dados: um JSON com tudo o que é da pessoa (direito de portabilidade da LGPD).
// A RLS garante que cada consulta só devolve os registros de quem está logado.
const TABELAS = {
  perfil: ["perfis", "user_id, nome, tema, fuso, lembrete_ativo, lembrete_hora, onboarding_ok, criado_em"],
  acessos: ["acessos", "modulo_id, origem, status, criado_em"],
  licoes: ["progresso_licao", "licao_id, etapa, respostas, iniciada_em, concluida_em"],
  habitos: ["habitos", "*"],
  checkins: ["checkins", "habito_id, dia, estado, registrado_em"],
  ajustes_ambiente: ["ajustes_ambiente", "habito_id, alavanca, texto, aplicado"],
  revisoes: ["revisoes", "tipo, dados, criado_em, proxima_em"],
  frases_vistas: ["frases_vistas", "licao_id, indice, vista_em, dia_jornada"],
  aparelhos_com_lembrete: ["push_inscricoes", "criado_em"],
} as const;

export async function GET() {
  const supabase = await criarClienteServidor();
  const { data: sessao } = await supabase.auth.getClaims();
  if (!sessao?.claims) return new NextResponse("Entre no app para exportar seus dados.", { status: 401 });

  const entradas = await Promise.all(
    Object.entries(TABELAS).map(async ([nome, [tabela, colunas]]) => {
      const { data, error } = await supabase.from(tabela).select(colunas);
      if (error) throw new Error(`Não foi possível exportar ${nome}: ${error.message}`);
      return [nome, data] as const;
    }),
  );

  const corpo = {
    exportado_em: new Date().toISOString(),
    email: sessao.claims.email ?? null,
    ...Object.fromEntries(entradas),
  };
  const dia = corpo.exportado_em.slice(0, 10);
  return new NextResponse(JSON.stringify(corpo, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="trilho-meus-dados-${dia}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
