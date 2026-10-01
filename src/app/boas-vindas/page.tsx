import { redirect } from "next/navigation";
import { exigirModulo } from "@/lib/perfil";
import { obterSemanas } from "@/lib/semanas";
import { Onboarding } from "./onboarding";

export default async function BoasVindas() {
  const { perfil, temSenha } = await exigirModulo();
  if (perfil.onboarding_ok) redirect("/hoje");
  if (!temSenha) redirect("/criar-senha");

  const primeira = (await obterSemanas())[0].licao;
  return (
    <Onboarding
      nomeInicial={perfil.nome ?? ""}
      primeiraLicao={{ id: primeira.id, titulo: primeira.titulo, duracao: primeira.duracao_min }}
    />
  );
}
