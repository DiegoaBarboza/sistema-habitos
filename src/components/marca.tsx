// Símbolo do Trilho desenhado em linha: os trilhos usam a cor do texto e o ponto usa o verde do tema,
// então a marca aparece certa no claro e no escuro (o icon.svg, com fundo grafite, sumia no escuro).
export function Marca() {
  const traco = { fill: "none", stroke: "currentColor" } as const;
  return (
    <svg viewBox="4 4 100 92" width={56} height={52} role="img" aria-label="Trilho" className="h-[52px] w-14 text-text">
      <path d="M16 90 V52 A36 36 0 0 1 52 16 H78" {...traco} strokeWidth={8} />
      <path d="M32 90 V52 A20 20 0 0 1 52 32 H78" {...traco} strokeWidth={8} />
      <line x1="10" y1="81" x2="38" y2="81" {...traco} strokeWidth={6.5} />
      <line x1="10" y1="60" x2="38" y2="60" {...traco} strokeWidth={6.5} />
      <line x1="39.48" y1="45.73" x2="14.45" y2="33.19" {...traco} strokeWidth={6.5} />
      <line x1="47.11" y1="38.88" x2="37.34" y2="12.64" {...traco} strokeWidth={6.5} />
      <line x1="63.02" y1="10" x2="63.02" y2="38" {...traco} strokeWidth={6.5} />
      <circle cx="91" cy="24" r="8.5" className="fill-accent" />
    </svg>
  );
}
