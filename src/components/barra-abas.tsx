"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ABAS = [
  {
    href: "/hoje",
    rotulo: "Hoje",
    icone: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.7 2.7L16 10" />
      </>
    ),
  },
  {
    href: "/trilha",
    rotulo: "Trilha",
    icone: (
      <>
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
      </>
    ),
  },
  {
    href: "/progresso",
    rotulo: "Progresso",
    icone: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  },
  {
    href: "/perfil",
    rotulo: "Perfil",
    icone: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  },
];

export function BarraAbas() {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[480px] border-t border-line bg-nav pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid h-[76px] grid-cols-4">
        {ABAS.map((aba) => {
          const ativa = caminho === aba.href || caminho.startsWith(aba.href + "/");
          return (
            <li key={aba.href}>
              <Link
                href={aba.href}
                aria-current={ativa ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] ${
                  ativa ? "font-semibold text-accent" : "font-medium text-text-2"
                }`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {aba.icone}
                </svg>
                {aba.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
