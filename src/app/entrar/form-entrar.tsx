"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { entrarComSenha } from "@/app/acoes";
import { lembrarPreferenciaSenha, lerPreferenciaSenha } from "@/lib/senha";
import { criarClienteNavegador } from "@/lib/supabase/client";

type Modo = "link" | "senha";
const semAssinatura = () => () => {};

export function FormEntrar({ linkInvalido }: { linkInvalido: boolean }) {
  // Quem já entrou com senha neste aparelho vê direto o campo de senha.
  const preferida = useSyncExternalStore<Modo>(
    semAssinatura,
    () => (lerPreferenciaSenha() ? "senha" : "link"),
    () => "link",
  );
  const router = useRouter();
  const [escolhido, setEscolhido] = useState<Modo | null>(null);
  const modo = linkInvalido && !escolhido ? "link" : (escolhido ?? preferida);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(
    linkInvalido ? "Esse link expirou ou já foi usado. Peça um novo." : null,
  );

  function trocarModo(novo: Modo) {
    setEscolhido(novo);
    setErro(null);
  }

  async function enviarLink(e: React.FormEvent) {
    e.preventDefault();
    const destino = email.trim().toLowerCase();
    setEnviando(true);
    setErro(null);
    const { error } = await criarClienteNavegador().auth.signInWithOtp({
      email: destino,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirmar` },
    });
    setEnviando(false);
    if (error) {
      setErro(
        error.status === 429
          ? "Muitos pedidos seguidos. Espere alguns minutos e tente de novo."
          : "Não foi possível enviar o link. Confira o e-mail e tente de novo.",
      );
      return;
    }
    setEnviadoPara(destino);
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const { erro: falha } = await entrarComSenha(email, senha);
      if (!falha) {
        lembrarPreferenciaSenha();
        router.replace("/hoje");
        return;
      }
      setErro(falha);
    } catch {
      setErro("Não foi possível entrar. Confira a conexão e tente de novo.");
    }
    setEnviando(false);
  }

  if (enviadoPara) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[22px]">
        <div className="flex size-11 items-center justify-center rounded-xl bg-accent/15">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Confira seu e-mail</h2>
        <p className="text-[15px] leading-[1.55] text-text-2">
          Enviamos um link de acesso para <strong className="text-text">{enviadoPara}</strong>. Ele vale por 1 hora e funciona uma vez.
        </p>
        <button
          type="button"
          onClick={() => setEnviadoPara(null)}
          className="h-12 cursor-pointer rounded-xl border border-line text-[15px] font-semibold"
        >
          Usar outro e-mail
        </button>
      </div>
    );
  }

  const campo = "h-[54px] w-full rounded-xl border border-line bg-input px-4 text-base outline-none focus:border-accent";

  return (
    <form onSubmit={modo === "senha" ? entrar : enviarLink} className="flex flex-col gap-3.5">
      <label htmlFor="email" className="text-sm font-semibold">
        E-mail
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="voce@empresa.com.br"
        className={campo}
      />
      {modo === "senha" && (
        <>
          <label htmlFor="senha" className="text-sm font-semibold">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={campo}
          />
        </>
      )}
      {erro && (
        <p role="alert" className="text-sm text-warn">
          {erro}
        </p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="h-14 cursor-pointer rounded-xl bg-accent text-base font-bold text-on-accent disabled:opacity-60"
      >
        {modo === "senha" ? (enviando ? "Entrando…" : "Entrar") : enviando ? "Enviando…" : "Receber link de acesso"}
      </button>
      <button
        type="button"
        onClick={() => trocarModo(modo === "senha" ? "link" : "senha")}
        className="min-h-11 cursor-pointer text-[15px] font-semibold text-accent"
      >
        {modo === "senha" ? "Esqueci a senha / receber link de acesso" : "Já tenho senha"}
      </button>
      <p className="text-center text-[13px] leading-normal text-text-2">
        {modo === "senha"
          ? "Sem senha ainda? Entre pelo link e crie uma no Perfil."
          : "Primeiro acesso é pelo link no e-mail. Comprou pela Kiwify? Use o mesmo e-mail da compra para liberar seu módulo."}
      </p>
    </form>
  );
}

