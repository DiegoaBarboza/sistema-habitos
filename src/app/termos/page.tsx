import type { Metadata } from "next";
import Link from "next/link";
import { Documento } from "@/components/documento";
import { RESPONSAVEL, SUPORTE_EMAIL } from "@/lib/responsavel";

export const metadata: Metadata = { title: "Termos de Uso · Trilho" };

export default function Termos() {
  return (
    <Documento titulo="Termos de Uso">
      <p>
        Estes termos valem pra quem usa o Trilho, um app de desenvolvimento pessoal oferecido por {RESPONSAVEL}. Ao
        entrar no app, você concorda com eles.
      </p>

      <h2>O que o Trilho é</h2>
      <p>
        O Trilho é uma ferramenta de registro e acompanhamento de hábitos, com lições, exercícios, check-in diário e
        indicadores. Ele ajuda você a se observar e a organizar a sua rotina, mas não é tratamento médico, psicológico ou
        nutricional e não substitui um profissional dessas áreas.
      </p>

      <h2>Sua conta</h2>
      <p>
        A conta é pessoal e está ligada ao seu e-mail. Você é responsável por manter o acesso ao seu e-mail e a sua senha
        em segurança. O conteúdo que você escreve no app é seu.
      </p>

      <h2>Compra e acesso</h2>
      <p>
        Os módulos são vendidos pela Kiwify, e o acesso é liberado pro mesmo e-mail usado na compra. Pelo Código de Defesa
        do Consumidor, você pode desistir da compra em até 7 dias e receber o valor de volta, pedindo o reembolso pela
        própria Kiwify. Se a compra for reembolsada ou contestada, o acesso ao módulo é encerrado.
      </p>

      <h2>Uso permitido</h2>
      <p>
        O conteúdo das lições é protegido por direitos autorais. Você pode usar à vontade pra você, e pode compartilhar as
        frases do dia como quiser, mas não pode copiar, revender ou distribuir as lições.
      </p>

      <h2>Disponibilidade</h2>
      <p>
        Trabalhamos pra manter o app no ar e funcionando, mas ele pode ficar fora do ar por manutenção ou por falhas dos
        serviços que usamos. Também podemos melhorar ou mudar funções ao longo do tempo.
      </p>

      <h2>Privacidade</h2>
      <p>
        Como tratamos os seus dados está explicado na <Link href="/privacidade">Política de Privacidade</Link>.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas, sugestões ou pedidos: <a href={`mailto:${SUPORTE_EMAIL}`}>{SUPORTE_EMAIL}</a>.
      </p>
    </Documento>
  );
}
