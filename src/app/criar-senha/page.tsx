import { Marca } from "@/components/marca";
import { obterSessao } from "@/lib/perfil";
import { FormCriarSenha } from "./form-criar-senha";

// Destino de todo link de acesso: primeiro acesso (obrigatório) ou "Esqueci a senha" (opcional).
export default async function CriarSenha() {
  const { email, perfil, temSenha } = await obterSessao();
  const primeiroAcesso = !perfil.onboarding_ok;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-7 px-6 pt-[72px] pb-10">
      <Marca />
      <div className="flex flex-col gap-2.5">
        <h1 className="text-[30px] leading-[1.15] font-bold">{temSenha ? "Crie uma nova senha" : "Crie sua senha"}</h1>
        <p className="text-base leading-[1.55] text-text-2">
          Nas próximas vezes, você entra com e-mail e senha, sem precisar abrir o e-mail.
        </p>
      </div>
      <FormCriarSenha email={email} destino={primeiroAcesso ? "/boas-vindas" : "/hoje"} podePular={!primeiroAcesso} />
    </main>
  );
}
