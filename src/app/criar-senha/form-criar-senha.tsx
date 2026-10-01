"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { definirSenha } from "@/app/acoes";
import { lembrarPreferenciaSenha, SENHA_MIN } from "@/lib/senha";

export function FormCriarSenha({ email, destino, podePular }: { email: string; destino: string; podePular: boolean }) {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, iniciar] = useTransition();

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciar(async () => {
      try {
        const { erro: falha } = await definirSenha(senha);
        if (falha) return setErro(falha);
        lembrarPreferenciaSenha();
        router.replace(destino);
      } catch {
        setErro("Não foi possível salvar a senha. Confira a conexão e tente de novo.");
      }
    });
  }

  return (
    <form onSubmit={salvar} className="flex flex-col gap-3.5">
      {/* Campo oculto para o gerenciador de senhas do celular salvar o par e-mail + senha. */}
      <input type="email" name="email" autoComplete="username" value={email} readOnly hidden />
      <label htmlFor="senha" className="text-sm font-semibold">
        Senha
      </label>
      <div className="flex gap-2">
        <input
          id="senha"
          type={mostrar ? "text" : "password"}
          required
          minLength={SENHA_MIN}
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="h-[54px] min-w-0 grow rounded-xl border border-line bg-input px-4 text-base outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setMostrar(!mostrar)}
          className="h-[54px] shrink-0 cursor-pointer rounded-xl border border-line px-3.5 text-sm font-semibold"
        >
          {mostrar ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      <span className="text-[13px] text-text-2">Pelo menos {SENHA_MIN} caracteres.</span>
      {erro && (
        <p role="alert" className="text-sm text-warn">
          {erro}
        </p>
      )}
      <button
        type="submit"
        disabled={salvando}
        className="h-14 cursor-pointer rounded-xl bg-accent text-base font-bold text-on-accent disabled:opacity-60"
      >
        {salvando ? "Salvando…" : "Salvar e continuar"}
      </button>
      {podePular && (
        <Link href="/hoje" className="flex min-h-11 items-center justify-center text-[15px] font-semibold text-accent">
          Agora não
        </Link>
      )}
    </form>
  );
}
