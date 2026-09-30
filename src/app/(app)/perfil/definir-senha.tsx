"use client";

import { useState, useTransition } from "react";
import { definirSenha } from "@/app/acoes";
import { lembrarPreferenciaSenha, SENHA_MIN } from "@/lib/senha";

export function DefinirSenha({ temSenha }: { temSenha: boolean }) {
  const [aberto, setAberto] = useState(false);
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salva, setSalva] = useState(false);
  const [salvando, iniciar] = useTransition();

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciar(async () => {
      try {
        const { erro: falha } = await definirSenha(senha);
        if (falha) return setErro(falha);
        lembrarPreferenciaSenha();
        setSenha("");
        setAberto(false);
        setSalva(true);
      } catch {
        setErro("Não foi possível salvar a senha. Confira a conexão e tente de novo.");
      }
    });
  }

  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={aberto}
        onClick={() => {
          setAberto(!aberto);
          setSalva(false);
          setErro(null);
        }}
        className="flex w-full cursor-pointer flex-col gap-0.5 px-4 py-3.5 text-left"
      >
        <span className="text-[15px] font-semibold">{temSenha ? "Trocar senha" : "Criar senha"}</span>
        <span className="text-[13px] text-text-2">
          {salva ? "Senha salva. Na próxima vez, entre com e-mail e senha." : "Para entrar sem precisar abrir o e-mail."}
        </span>
      </button>
      {aberto && (
        <form onSubmit={salvar} className="flex flex-col gap-2.5 px-4 pb-4">
          <label htmlFor="nova-senha" className="text-sm font-semibold">
            Nova senha
          </label>
          <div className="flex gap-2">
            <input
              id="nova-senha"
              type={mostrar ? "text" : "password"}
              required
              minLength={SENHA_MIN}
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="h-12 min-w-0 grow rounded-xl border border-line bg-input px-4 text-base outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setMostrar(!mostrar)}
              className="h-12 shrink-0 cursor-pointer rounded-xl border border-line px-3 text-sm font-semibold"
            >
              {mostrar ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <span className="text-xs text-text-2">Pelo menos {SENHA_MIN} caracteres.</span>
          {erro && (
            <p role="alert" className="text-sm text-warn">
              {erro}
            </p>
          )}
          <button
            type="submit"
            disabled={salvando}
            className="h-12 cursor-pointer rounded-xl bg-accent text-[15px] font-bold text-on-accent disabled:opacity-60"
          >
            {salvando ? "Salvando…" : "Salvar senha"}
          </button>
        </form>
      )}
    </div>
  );
}
