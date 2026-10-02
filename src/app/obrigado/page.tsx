import type { Metadata } from "next";
import Link from "next/link";
import { Marca } from "@/components/marca";
import { SUPORTE_EMAIL } from "@/lib/responsavel";

export const metadata: Metadata = { title: "Compra confirmada · Trilho" };

// Destino da Kiwify depois do pagamento (configurar como "página de obrigado" no produto).
export default function Obrigado() {
  const passos = [
    { n: "1", titulo: "Abra o app", texto: "Toque no botão abaixo ou acesse trilhoapp.com.br/entrar no celular." },
    { n: "2", titulo: "Use o mesmo e-mail da compra", texto: "Digite o e-mail que você usou na Kiwify e peça o link de acesso." },
    { n: "3", titulo: "Abra o link no celular", texto: "No primeiro acesso você cria a sua senha e vê como o app funciona." },
    { n: "4", titulo: "Instale na tela inicial", texto: "No Android: menu ⋮ → Instalar app. No iPhone: Compartilhar → Adicionar à Tela de Início." },
  ];
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col gap-8 px-6 pt-14 pb-12">
      <Marca />
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs tracking-[0.12em] text-accent">COMPRA CONFIRMADA</span>
        <h1 className="text-[32px] leading-[1.1] font-bold">Bem-vindo ao Trilho. Sua vaga está garantida.</h1>
        <p className="text-base leading-relaxed text-text-2">
          O seu acesso é liberado automaticamente assim que a Kiwify confirma o pagamento. No cartão e no Pix isso leva
          poucos minutos; no boleto, até 3 dias úteis.
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {passos.map((p) => (
          <li key={p.n} className="flex gap-4 rounded-xl border border-line bg-surface p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent font-mono font-bold text-on-accent">
              {p.n}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold">{p.titulo}</span>
              <span className="text-sm leading-relaxed text-text-2">{p.texto}</span>
            </span>
          </li>
        ))}
      </ol>
      <Link href="/entrar" className="flex h-14 items-center justify-center rounded-xl bg-accent text-base font-bold text-on-accent">
        Entrar no Trilho
      </Link>
      <p className="text-center text-sm leading-relaxed text-text-2">
        Entrou e apareceu &quot;nenhum módulo liberado&quot;? Confira se usou o mesmo e-mail da compra ou escreva pra{" "}
        <a href={`mailto:${SUPORTE_EMAIL}`} className="text-accent underline">
          {SUPORTE_EMAIL}
        </a>
        .
      </p>
    </main>
  );
}
