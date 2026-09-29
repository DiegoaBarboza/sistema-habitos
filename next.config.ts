import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A tela "Trilha" passou a se chamar "Semanas" (marca Trilho); links antigos continuam funcionando.
  async redirects() {
    return [{ source: "/trilha", destination: "/semanas", permanent: true }];
  },
};

export default nextConfig;
