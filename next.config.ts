import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A tela "Trilha" passou a se chamar "Semanas" (marca Trilho); links antigos continuam funcionando.
  async redirects() {
    return [{ source: "/trilha", destination: "/semanas", permanent: true }];
  },
  // O navegador precisa sempre buscar a versão nova do service worker.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
