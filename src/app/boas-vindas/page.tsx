import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/perfil";
import { Onboarding } from "./onboarding";

export default async function BoasVindas() {
  const { perfil } = await obterSessao();
  if (perfil.onboarding_ok) redirect("/hoje");

  return <Onboarding nomeInicial={perfil.nome ?? ""} />;
}
