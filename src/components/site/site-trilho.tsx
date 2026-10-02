import Link from "next/link";
import { SUPORTE_EMAIL } from "@/lib/responsavel";
import type { OfertaAtual } from "@/lib/vendas/servidor";

// Site público do Trilho (trilhoapp.com.br). Usa os mesmos tokens de cor do app, nos dois temas.

const DORES = [
  { titulo: "Começa animado e para na segunda semana", texto: "Não é falta de força de vontade, é falta de método. O Trilho troca o \"vou tentar\" por um plano." },
  { titulo: "Não sabe pra onde o tempo vai", texto: "Quase metade do dia roda no automático. A primeira semana é justamente pra enxergar isso." },
  { titulo: "Quer ver progresso, não só sentir", texto: "Adesão, sequência e mapa dos últimos 14 dias mostram o que está funcionando e o que precisa de ajuste." },
];

const CICLO = [
  { n: "01", titulo: "Entenda", texto: "Uma lição curta com a ideia da semana, explicada com pesquisa e exemplos do dia a dia." },
  { n: "02", titulo: "Faça", texto: "Um exercício na tela, sem papel, que transforma a ideia em plano." },
  { n: "03", titulo: "Execute", texto: "Check-in diário rápido: feito, mínimo ou não feito." },
  { n: "04", titulo: "Meça", texto: "Seus números mostram a tendência e dizem o que ajustar." },
];

const RECURSOS = [
  { titulo: "Check-in diário", texto: "Um toque marca o hábito como feito. Segurou o dedo, aparecem as opções de mínimo ou não feito." },
  { titulo: "Regra do \"sem falha 2x\"", texto: "Falhar um dia é normal. O app te avisa quando é dia de não falhar a segunda vez." },
  { titulo: "Versão mínima", texto: "Cada hábito tem uma versão de 2 minutos pros dias ruins, pra sequência não quebrar." },
  { titulo: "Lembrete na hora certa", texto: "Uma notificação por dia, no horário que você escolher, só quando ainda falta algo." },
  { titulo: "Frase do dia", texto: "Uma frase por dia ligada à ferramenta da semana, pronta pra postar no status ou no feed." },
  { titulo: "Indicadores de progresso", texto: "Adesão por semana, recorde de sequência e dias salvos pelo mínimo, tudo calculado sozinho." },
];

const SEMANAS = [
  { n: 1, nome: "Inventário de hábitos", frase: "Você não melhora o que não enxerga" },
  { n: 2, nome: "Identidade-alvo", frase: "Meta diz o que você quer, identidade diz quem faz" },
  { n: 3, nome: "Plano de gatilho", frase: "\"Vou tentar\" não é plano" },
  { n: 4, nome: "Encadeamento", frase: "Pendure o novo no que já funciona" },
  { n: 5, nome: "Projeto de ambiente", frase: "O layout decide antes de você" },
  { n: 6, nome: "Versão mínima", frase: "Dia ruim também conta" },
  { n: 7, nome: "Rastreador e recuperação", frase: "Falhar uma vez é ruído, duas é tendência" },
  { n: 8, nome: "Compromisso e revisão", frase: "Todo processo tem ciclo de revisão" },
];

const CITACOES = [
  { antes: "Grande parte da vida nos escapa", destaque: "enquanto fazemos outra coisa.", autor: "Sêneca, Cartas a Lucílio" },
  { antes: "Primeiro diga a si mesmo quem você quer ser;", destaque: "depois, faça o que isso exige.", autor: "Epicteto, Discursos" },
  { antes: "Quando escorregar, não desanime:", destaque: "volte de novo.", autor: "Marco Aurélio, Meditações" },
];

const PERGUNTAS = [
  { p: "Preciso baixar na loja de aplicativos?", r: "Não. O Trilho abre no navegador do celular e você instala na tela inicial com dois toques, no Android e no iPhone." },
  { p: "Quanto tempo por dia eu vou gastar?", r: "O check-in leva uns 10 segundos. A lição da semana leva cerca de 10 minutos, uma vez por semana, no dia que for melhor pra você." },
  { p: "E se eu falhar um dia?", r: "Faz parte. O app foi pensado pra isso: em vez de zerar uma sequência, ele te ajuda a não falhar duas vezes seguidas." },
  { p: "Funciona pra qualquer hábito?", r: "Funciona pra hábitos que você quer construir e pra hábitos que você quer largar, do treino à leitura, do sono ao uso do celular. Você escolhe quais." },
  { p: "O Trilho substitui terapia ou acompanhamento profissional?", r: "Não. O Trilho é uma ferramenta de registro e organização da rotina e não substitui médico, psicólogo ou nutricionista." },
  { p: "E se eu não gostar?", r: "Você tem 7 dias depois da compra pra pedir o reembolso, como garante o Código de Defesa do Consumidor." },
];

export function SiteTrilho({ oferta }: { oferta: OfertaAtual }) {
  const fundador = oferta.vagasRestantes !== null;
  const preco = `R$\u00a0${oferta.preco}`; // espaço que não quebra: "R$" e o valor ficam juntos
  const cta = oferta.checkoutUrl
    ? { href: oferta.checkoutUrl, rotulo: fundador ? `Garantir minha vaga · ${preco}` : `Começar agora · ${preco}` }
    : { href: `mailto:${SUPORTE_EMAIL}?subject=${encodeURIComponent("Quero ser avisado quando o Trilho abrir")}`, rotulo: "Quero ser avisado" };
  const selo = fundador
    ? `Lote fundador · ${preco} pagamento único · restam ${oferta.vagasRestantes} de 100 vagas`
    : `${preco} pagamento único · acesso vitalício às 8 semanas`;

  return (
    <div className="min-h-dvh">
      {/* Topo bege de fora a fora, igual nos banners: o print do app é escuro e precisa de fundo claro.
          Cores fixas (não seguem o tema) pra o topo ficar igual em qualquer aparelho. */}
      <header className="sticky top-0 z-20 border-b border-[#1b2120]/10 bg-[#F4EEE2]/95 text-[#1b2120] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" aria-label="Trilho, início" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- logo em SVG */}
            <img src="/brand/trilho-horizontal-sobre-claro.svg" alt="" width={104} height={32} className="h-8 w-auto" />
          </Link>
          <nav aria-label="Seções" className="hidden gap-6 text-sm text-[#52605a] md:flex">
            <a href="#como-funciona" className="hover:text-[#1b2120]">Como funciona</a>
            <a href="#recursos" className="hover:text-[#1b2120]">Recursos</a>
            <a href="#semanas" className="hover:text-[#1b2120]">As 8 semanas</a>
            <a href="#perguntas" className="hover:text-[#1b2120]">Perguntas</a>
          </nav>
          <Link href="/entrar" className="flex h-10 items-center rounded-[10px] border border-[#1b2120]/25 px-4 text-sm font-semibold">
            Entrar
          </Link>
        </div>
      </header>

      <main>
        {/* Início */}
        <div className="overflow-hidden bg-[#F4EEE2] text-[#1b2120]">
          <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-14 pb-20 md:grid-cols-[1.1fr_0.9fr] md:pt-20">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs tracking-[0.12em] text-[#0e7444]">MÓDULO 1 · HÁBITOS</span>
              <h1 className="text-[40px] leading-[1.05] font-bold md:text-[60px]">
                Hábito é processo. <span className="text-[#0e7444]">Processo se mede.</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-[#52605a]">
                O Trilho é um app pra você construir hábitos de verdade em 8 semanas, com uma ferramenta nova por semana,
                check-in diário e indicadores que mostram o seu progresso.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={cta.href} className="flex h-14 items-center rounded-xl bg-[#0e7444] px-7 text-base font-bold text-white">
                  {cta.rotulo}
                </a>
                <a href="#como-funciona" className="flex h-14 items-center rounded-xl border border-[#1b2120]/25 px-7 text-base font-semibold">
                  Ver como funciona
                </a>
              </div>
              <p className="text-sm text-[#52605a]">
                {oferta.checkoutUrl ? <span className="font-semibold text-[#1b2120]">{selo}</span> : "Funciona no celular, sem baixar nada da loja."}
              </p>
            </div>
            <div className="flex justify-center gap-6 py-6">
              <Celular src="/site/app-hoje.jpg" alt="Tela Hoje do Trilho, com a frase do dia, indicadores e check-in" />
              <Celular src="/site/app-progresso.jpg" alt="Tela Progresso do Trilho, com adesão e sequência" className="mt-16 hidden sm:block" />
            </div>
          </section>
        </div>

        <div className="h-20" aria-hidden="true" />

        {/* Pra quem é */}
        <Secao id="pra-quem" rotulo="PRA QUEM É" titulo="Pra quem cansou de recomeçar toda segunda-feira">
          <div className="grid gap-4 md:grid-cols-3">
            {DORES.map((d) => (
              <Cartao key={d.titulo} titulo={d.titulo} texto={d.texto} />
            ))}
          </div>
        </Secao>

        {/* Como funciona */}
        <Secao
          id="como-funciona"
          rotulo="COMO FUNCIONA"
          titulo="8 semanas, uma ferramenta por semana"
          texto="Toda semana libera uma lição nova, e cada lição segue o mesmo ciclo. A próxima só abre quando você conclui a anterior e faz pelo menos 5 check-ins, pra ninguém pular etapa."
        >
          <ol className="grid gap-4 md:grid-cols-4">
            {CICLO.map((c) => (
              <li key={c.n} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6">
                <span className="font-mono text-2xl font-semibold text-accent">{c.n}</span>
                <span className="text-lg font-bold">{c.titulo}</span>
                <span className="text-[15px] leading-relaxed text-text-2">{c.texto}</span>
              </li>
            ))}
          </ol>
        </Secao>

        {/* Recursos */}
        <Secao id="recursos" rotulo="RECURSOS" titulo="Feito pra caber no seu dia, até no dia ruim">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RECURSOS.map((r) => (
              <Cartao key={r.titulo} titulo={r.titulo} texto={r.texto} />
            ))}
          </div>
        </Secao>

        {/* As 8 semanas */}
        <Secao id="semanas" rotulo="AS 8 SEMANAS" titulo="O que você aprende em cada semana">
          <ol className="grid gap-3 md:grid-cols-2">
            {SEMANAS.map((s) => (
              <li key={s.n} className="flex items-center gap-4 rounded-xl border border-line bg-surface px-5 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent font-mono font-bold text-on-accent">
                  {s.n}
                </span>
                <span className="flex flex-col">
                  <span className="font-bold">{s.nome}</span>
                  <span className="text-sm text-text-2">{s.frase}</span>
                </span>
              </li>
            ))}
          </ol>
        </Secao>

        {/* Ciência e estoicismo */}
        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-[0.12em] text-accent">CIÊNCIA E ESTOICISMO</span>
              <h2 className="text-3xl leading-tight font-bold md:text-4xl">Pesquisa de comportamento com 2 mil anos de prática</h2>
              <p className="text-lg leading-relaxed text-text-2">
                Cada lição junta o que a ciência descobriu sobre hábitos com as ideias de Sêneca, Epicteto e Marco Aurélio,
                filósofos que tratavam a vida como treino diário. Tudo explicado sem jargão e com exemplos do dia a dia.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              {CITACOES.map((c) => (
                <figure key={c.autor} className="flex flex-col gap-2 border-l-4 border-accent pl-5">
                  <blockquote className="text-xl leading-snug font-bold">
                    {c.antes} <span className="text-accent">{c.destaque}</span>
                  </blockquote>
                  <figcaption className="font-mono text-xs text-text-2">{c.autor}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Módulos */}
        <Secao
          id="modulos"
          rotulo="EM BREVE"
          titulo="Hábitos é só o começo"
          texto="O Trilho vai ganhar novos módulos com o mesmo jeito de trabalhar: medir, mostrar padrões e lembrar."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { titulo: "Procrastinação", texto: "Entender o que você faz no lugar da tarefa adiada e destravar o primeiro passo." },
              { titulo: "Sono", texto: "Acompanhar horários, qualidade e a rotina da noite que prepara o dia seguinte." },
            ].map((m) => (
              <div key={m.titulo} className="flex flex-col gap-2 rounded-2xl border border-dashed border-line p-6">
                <span className="font-mono text-[11px] tracking-[0.08em] text-text-2">EM BREVE</span>
                <span className="text-lg font-bold">{m.titulo}</span>
                <span className="text-[15px] leading-relaxed text-text-2">{m.texto}</span>
              </div>
            ))}
          </div>
        </Secao>

        {/* Perguntas */}
        <Secao id="perguntas" rotulo="PERGUNTAS" titulo="Perguntas frequentes">
          <div className="flex flex-col gap-3">
            {PERGUNTAS.map((q) => (
              <details key={q.p} className="group rounded-xl border border-line bg-surface px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q.p}
                  <span aria-hidden="true" className="text-xl text-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-text-2">{q.r}</p>
              </details>
            ))}
          </div>
        </Secao>

        {/* Chamada final */}
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="flex flex-col gap-8 rounded-3xl bg-accent px-7 py-12 text-on-accent md:px-14 md:py-16">
            <div className="flex max-w-3xl flex-col gap-4">
              <span className="font-mono text-xs font-semibold tracking-[0.12em] opacity-70">
                {fundador ? "LOTE FUNDADOR · VAGAS LIMITADAS" : "COMECE HOJE"}
              </span>
              <h2 className="text-[34px] leading-[1.05] font-bold md:text-[52px]">Os próximos 66 dias vão passar de qualquer jeito.</h2>
              <p className="text-lg leading-relaxed opacity-85 md:text-xl">
                A pesquisa mostra que esse é, em média, o tempo pra um hábito ficar automático. A pergunta é se esses dias vão
                passar no piloto automático ou construindo a pessoa que você decidiu ser.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <a href={cta.href} className="flex min-h-16 items-center justify-center rounded-xl bg-on-accent px-6 py-3 text-center text-lg font-bold text-accent">
                {cta.rotulo}
              </a>
              <span className="text-sm font-semibold opacity-80">
                {oferta.checkoutUrl ? selo : "Pagamento único · 7 dias de garantia"}
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-text-2 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Trilho · trilhoapp.com.br</span>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacidade" className="hover:text-text">Privacidade</Link>
            <Link href="/termos" className="hover:text-text">Termos de uso</Link>
            <a href={`mailto:${SUPORTE_EMAIL}`} className="hover:text-text">Contato</a>
            <Link href="/entrar" className="hover:text-text">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Secao({
  id,
  rotulo,
  titulo,
  texto,
  children,
}: {
  id: string;
  rotulo: string;
  titulo: string;
  texto?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-8 px-5 pb-20">
      <div className="flex max-w-2xl flex-col gap-3">
        <span className="font-mono text-xs tracking-[0.12em] text-accent">{rotulo}</span>
        <h2 className="text-3xl leading-tight font-bold md:text-4xl">{titulo}</h2>
        {texto && <p className="text-lg leading-relaxed text-text-2">{texto}</p>}
      </div>
      {children}
    </section>
  );
}

function Cartao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6">
      <span className="text-lg font-bold">{titulo}</span>
      <span className="text-[15px] leading-relaxed text-text-2">{texto}</span>
    </div>
  );
}

function Celular({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`w-[230px] shrink-0 rotate-[4deg] overflow-hidden rounded-[36px] border-[7px] border-[#0b0f0e] bg-[#0b0f0e] shadow-[0_24px_60px_rgba(27,33,32,0.35)] md:w-[250px] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- print estático do app */}
      <img src={src} alt={alt} width={780} height={1688} className="block h-auto w-full rounded-[29px]" />
    </div>
  );
}
