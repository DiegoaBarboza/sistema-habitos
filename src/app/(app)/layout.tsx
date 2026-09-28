import { redirect } from "next/navigation";
import { BarraAbas } from "@/components/barra-abas";
import { SincronizarTema } from "@/components/sincronizar-tema";
import { exigirModuloHabitos } from "@/lib/perfil";

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const { perfil } = await exigirModuloHabitos();
  if (!perfil.onboarding_ok) redirect("/boas-vindas");

  return (
    <>
      <SincronizarTema temaDoPerfil={perfil.tema} />
      <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-6 px-5 pt-7 pb-[calc(76px+24px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BarraAbas />
    </>
  );
}
