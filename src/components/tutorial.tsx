// Conteúdo do tutorial: aparece no primeiro acesso e em Perfil → Como funciona.
// Prints em public/tutorial (780 px de largura, um por tema), gerados com dados de demonstração.

const CICLO = [
  { n: "01", titulo: "Entenda", texto: "a ideia, com exemplos do dia a dia" },
  { n: "02", titulo: "Faça", texto: "o exercício na tela, sem papel" },
  { n: "03", titulo: "Execute", texto: "check-in diário de 10 segundos" },
  { n: "04", titulo: "Meça", texto: "adesão, sequência e tendência" },
];

const TELAS = [
  { img: "hoje", altura: 394, titulo: "Hoje", texto: "Toque no hábito para marcar feito. Segure para marcar mínimo ou não feito." },
  {
    img: "nao-falhar",
    altura: 228,
    titulo: "Não falhar 2x",
    texto: "Falhou ontem? O hábito aparece em destaque. Pode falhar, só não duas vezes seguidas.",
  },
  {
    img: "semanas",
    altura: 596,
    titulo: "Semanas",
    texto: "Uma lição por semana. A próxima libera quando você conclui a anterior e faz 5 check-ins.",
  },
  { img: "progresso", altura: 512, titulo: "Progresso", texto: "Adesão, sequência sem falha 2x e o mapa dos últimos 14 dias." },
];

export function ComoFuncionaSistema({ Titulo = "h1" }: { Titulo?: "h1" | "h2" }) {
  return (
    <>
      <Titulo className="text-[30px] leading-[1.15] font-bold">Como o sistema funciona</Titulo>
      <p className="text-base leading-[1.55] text-text-2">8 semanas, uma ferramenta por semana. Toda lição segue o mesmo ciclo:</p>
      <ol className="flex flex-col gap-2.5">
        {CICLO.map((c) => (
          <li key={c.n} className="flex items-center gap-3.5 rounded-xl border border-line bg-surface px-4 py-3.5">
            <span className="w-[30px] font-mono text-xl font-semibold text-accent">{c.n}</span>
            <span className="flex flex-col">
              <span className="font-semibold">{c.titulo}</span>
              <span className="text-sm text-text-2">{c.texto}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

export function ComoUsarApp({ Titulo = "h1" }: { Titulo?: "h1" | "h2" }) {
  return (
    <>
      <Titulo className="text-[30px] leading-[1.15] font-bold">Como usar o app</Titulo>
      <ol className="flex flex-col gap-3.5">
        {TELAS.map((t) => (
          <li key={t.img} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element -- print estático, já no tamanho certo */}
            <img src={`/tutorial/${t.img}-escuro.jpg`} alt="" width={780} height={t.altura} loading="lazy" className="so-escuro h-auto w-full border-b border-line" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/tutorial/${t.img}-claro.jpg`} alt="" width={780} height={t.altura} loading="lazy" className="so-claro h-auto w-full border-b border-line" />
            <span className="flex flex-col gap-0.5 px-4 py-3">
              <span className="font-semibold">{t.titulo}</span>
              <span className="text-sm leading-normal text-text-2">{t.texto}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
