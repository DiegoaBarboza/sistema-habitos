import { TemaDoPerfil } from "@/components/tema-do-perfil";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TemaDoPerfil />
      {children}
    </>
  );
}
