import { Marca } from "@/components/marca";
import { FormEntrar } from "./form-entrar";

export default async function Entrar({ searchParams }: PageProps<"/entrar">) {
  const { erro } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-between gap-10 px-6 pt-[72px] pb-10">
      <div className="flex flex-col gap-7">
        <Marca />
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-xs tracking-[0.08em] text-accent">TRILHO</span>
          <h1 className="text-[34px] leading-[1.1] font-bold">Hábito é processo. Processo se mede.</h1>
          <p className="text-base leading-[1.55] text-text-2">
            Exercícios na tela, check-in diário e indicadores de adesão. Para quem trabalha com método.
          </p>
        </div>
      </div>
      <FormEntrar linkInvalido={erro === "link"} />
    </main>
  );
}
