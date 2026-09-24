import { BarraAbas } from "@/components/barra-abas";

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-6 px-5 pt-7 pb-[calc(76px+24px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BarraAbas />
    </>
  );
}
