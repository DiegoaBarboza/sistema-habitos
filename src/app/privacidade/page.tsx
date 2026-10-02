import type { Metadata } from "next";
import { Documento } from "@/components/documento";
import { RESPONSAVEL, SUPORTE_EMAIL } from "@/lib/responsavel";

export const metadata: Metadata = { title: "Privacidade · Trilho" };

export default function Privacidade() {
  return (
    <Documento titulo="Política de Privacidade">
      <p>
        Esta política explica quais dados o Trilho guarda sobre você, pra que eles servem e como você pode pedir pra ver,
        corrigir ou apagar tudo. O responsável pelo tratamento dos dados é {RESPONSAVEL}, e o contato é{" "}
        <a href={`mailto:${SUPORTE_EMAIL}`}>{SUPORTE_EMAIL}</a>.
      </p>

      <h2>Quais dados guardamos</h2>
      <ul>
        <li>Seu e-mail, usado pra entrar no app e liberar os módulos que você comprou.</li>
        <li>O nome que você escolhe, o seu fuso horário, o tema do app e o horário do lembrete.</li>
        <li>O que você escreve nas lições e nos exercícios.</li>
        <li>Os seus hábitos, os check-ins de cada dia e as revisões mensais.</li>
        <li>As frases do dia que você já viu.</li>
        <li>Se você ligar o lembrete, um identificador do seu aparelho pra enviar a notificação.</li>
        <li>Dados da compra que a Kiwify nos envia: e-mail, produto e situação do pagamento.</li>
      </ul>
      <p>Não pedimos CPF, endereço, telefone nem dados de cartão. O pagamento acontece inteiro na Kiwify.</p>

      <h2>Pra que usamos</h2>
      <p>
        Usamos esses dados só pra fazer o app funcionar: mostrar as suas lições, calcular os seus indicadores, mandar o
        lembrete que você pediu e liberar o acesso que você comprou. A base legal é a execução do contrato com você
        (artigo 7º, inciso V, da LGPD). Não vendemos, não alugamos e não usamos os seus dados pra publicidade.
      </p>

      <h2>Com quem os dados ficam</h2>
      <p>O app usa serviços de terceiros que guardam ou processam dados em nosso nome:</p>
      <ul>
        <li>Supabase, onde fica o banco de dados.</li>
        <li>Vercel, onde o app roda.</li>
        <li>Resend, que envia os e-mails de acesso.</li>
        <li>Kiwify, que processa a compra.</li>
        <li>Os serviços de notificação do Google e da Apple, quando o lembrete está ligado.</li>
      </ul>
      <p>Alguns desses serviços ficam fora do Brasil, com as garantias previstas na LGPD pra transferência internacional.</p>

      <h2>Por quanto tempo</h2>
      <p>
        Os dados ficam guardados enquanto a sua conta existir. Se você pedir a exclusão, apagamos tudo em até 15 dias,
        com exceção do que a lei obriga a manter, como o registro da compra.
      </p>

      <h2>Os seus direitos</h2>
      <p>
        Você pode ver, corrigir, levar ou apagar os seus dados quando quiser. Pra baixar uma cópia de tudo, use
        Perfil → Exportar meus dados. Pra corrigir ou apagar a conta, escreva pra{" "}
        <a href={`mailto:${SUPORTE_EMAIL}`}>{SUPORTE_EMAIL}</a>, e a resposta vem em até 15 dias.
      </p>

      <h2>Segurança</h2>
      <p>
        O acesso aos dados é protegido por login, e cada pessoa só enxerga os próprios registros. A conexão com o app é
        sempre criptografada.
      </p>

      <h2>Mudanças nesta política</h2>
      <p>
        Se esta política mudar, a data no topo da página muda junto, e avisamos no app quando a mudança for importante.
      </p>
    </Documento>
  );
}
