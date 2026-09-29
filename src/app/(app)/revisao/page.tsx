import { redirect } from "next/navigation";
import { exigirModulo } from "@/lib/perfil";
import { dadosUltimos30Dias, proximaRevisao } from "@/lib/progresso";
import { criarClienteServidor } from "@/lib/supabase/server";
import { RevisaoForm } from "./revisao-form";

export default async function Revisao() {
  const { perfil } = await exigirModulo();
  const revisao = await proximaRevisao(perfil.fuso);
  if (!revisao || revisao.dias > 0) redirect("/progresso");

  const supabase = await criarClienteServidor();
  const { data: habitos, error } = await supabase.from("habitos").select("id, nome").eq("ativo", true).order("criado_em");
  if (error) throw new Error(error.message);
  const dados = await dadosUltimos30Dias(habitos.map((h) => h.id));

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <span className="rotulo text-xs">Revisão mensal</span>
        <h1 className="text-[26px] leading-tight font-bold">Manter, ajustar ou remover</h1>
        <p className="text-[15px] leading-normal text-text-2">
          Os números dos últimos 30 dias ajudam, mas a decisão é sua.
        </p>
      </div>
      <RevisaoForm habitos={habitos.map((h) => ({ ...h, ...dados[h.id] }))} />
    </>
  );
}
