// Peças visuais compartilhadas pelos exercícios.

export const classeCampo =
  "h-12 w-full min-w-0 rounded-[10px] border border-line bg-input px-3 text-[15px] outline-none placeholder:text-text-2/70 focus:border-accent";

export function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  placeholder,
  max,
  tipo = "text",
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  placeholder?: string;
  max?: number;
  tipo?: "text" | "time";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => aoMudar(e.target.value)}
        className={classeCampo}
      />
    </div>
  );
}

export function Cartao({ children, titulo }: { children: React.ReactNode; titulo?: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
      {titulo && <h3 className="text-[15px] font-bold">{titulo}</h3>}
      {children}
    </div>
  );
}

export function Marcador({
  marcado,
  aoMudar,
  children,
}: {
  marcado: boolean;
  aoMudar: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={marcado}
        onChange={(e) => aoMudar(e.target.checked)}
        className="size-5 shrink-0 accent-[var(--accent)]"
      />
      <span>{children}</span>
    </label>
  );
}

export function Opcao({
  ativa,
  aoEscolher,
  children,
}: {
  ativa: boolean;
  aoEscolher: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativa}
      onClick={aoEscolher}
      className={`flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-xl border bg-surface px-3.5 py-2.5 text-left text-[15px] font-medium ${
        ativa ? "border-accent" : "border-line"
      }`}
    >
      <span
        className={`size-5 shrink-0 rounded-full ${ativa ? "border-[6px] border-accent" : "border-2 border-text-2"}`}
        aria-hidden="true"
      />
      <span className="grow">{children}</span>
    </button>
  );
}

export function Chip({ ativo, aoAlternar, children }: { ativo: boolean; aoAlternar: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={aoAlternar}
      className={`min-h-11 cursor-pointer rounded-[10px] border px-3 py-2 text-left text-sm font-medium ${
        ativo ? "border-accent bg-accent text-on-accent" : "border-line bg-surface text-text"
      }`}
    >
      {children}
    </button>
  );
}

export function minuscula(s: string) {
  const t = s.trim();
  return t ? t[0].toLowerCase() + t.slice(1) : t;
}
