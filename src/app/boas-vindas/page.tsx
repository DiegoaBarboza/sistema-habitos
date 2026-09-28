import { redirect } from "next/navigation";
import { exigirModuloHabitos } from "@/lib/perfil";
import { Onboarding } from "./onboarding";

export default async function BoasVindas() {
  const { perfil } = await exigirModuloHabitos();
  if (perfil.onboarding_ok) redirect("/hoje");

  return <Onboarding nomeInicial={perfil.nome ?? ""} />;
}
