import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import type { ConteudoLicao } from "@/lib/conteudo/ler-licoes";
import { FORMATOS, palavrasDaFrase, type FormatoArte, type TemaArte } from "@/lib/frase-arte";
import { criarClienteServidor } from "@/lib/supabase/server";

// Arte da frase do dia: /api/frase/imagem?licao=habitos-s1&indice=0&formato=status&tema=grafite&dia=3
const CORES: Record<TemaArte, { fundo: string; texto: string; destaque: string; apoio: string; logo: string }> = {
  grafite: { fundo: "#151a19", texto: "#f0f4f2", destaque: "#3ad48c", apoio: "#9daba6", logo: "trilho-horizontal-sobre-escuro.svg" },
  claro: { fundo: "#EEF2EC", texto: "#131a17", destaque: "#0e7444", apoio: "#52605a", logo: "trilho-horizontal-sobre-claro.svg" },
};

const ASSETS = join(process.cwd(), "assets");
const arquivo = (nome: string) => readFile(join(ASSETS, nome));

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const formato: FormatoArte = p.get("formato") === "feed" ? "feed" : "status";
  const tema: TemaArte = p.get("tema") === "claro" ? "claro" : "grafite";
  const indice = Number(p.get("indice"));
  const dia = Number(p.get("dia"));

  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("licoes").select("conteudo").eq("id", p.get("licao") ?? "").maybeSingle();
  const frase = (data?.conteudo as ConteudoLicao | undefined)?.frases?.[indice];
  if (!frase) return new Response("Frase não encontrada", { status: 404 });

  const [cond, mono, sans, logo] = await Promise.all([
    arquivo("fontes/plex-sans-condensed-700.ttf"),
    arquivo("fontes/plex-mono-500.ttf"),
    arquivo("fontes/plex-sans-500.ttf"),
    arquivo(CORES[tema].logo),
  ]);

  const { largura, altura } = FORMATOS[formato];
  const story = formato === "status";
  const c = CORES[tema];
  const palavras = palavrasDaFrase(frase.texto);
  // Frases longas ganham letra menor para caber sem apertar.
  const caracteres = frase.texto.replace(/\*\*/g, "").length;
  const tamanho = (story ? 118 : 104) * (caracteres > 60 ? 0.82 : 1);
  const margem = story ? 200 : 110;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: c.fundo, color: c.texto, position: "relative" }}>
        <div style={{ position: "absolute", left: 96, top: 0, bottom: 0, width: 6, background: c.destaque, display: "flex" }} />
        <div
          style={{
            position: "absolute",
            left: 87,
            top: story ? 640 : 300,
            width: 24,
            height: 24,
            borderRadius: 12,
            background: c.destaque,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 160,
            right: 96,
            top: margem,
            bottom: margem,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 30, letterSpacing: 4, color: c.destaque }}>
            {Number.isFinite(dia) && dia > 0 ? `DIA ${dia}` : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "Cond", fontSize: tamanho, lineHeight: 1.02 }}>
              {palavras.map((p, i) => (
                <span key={i} style={{ color: p.destaque ? c.destaque : c.texto, marginRight: tamanho * 0.24 }}>
                  {p.palavra}
                </span>
              ))}
            </div>
            {frase.autor && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: story ? 56 : 40 }}>
                <span style={{ fontFamily: "Sans", fontSize: 40, color: c.texto }}>{frase.autor}</span>
                {frase.fonte && <span style={{ fontFamily: "Mono", fontSize: 32, color: c.apoio, marginTop: 6 }}>{frase.fonte}</span>}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- dentro do ImageResponse não existe next/image */}
            <img
              src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
              width={story ? 246 : 214}
              height={story ? 76 : 66}
              alt=""
            />
            <span style={{ fontFamily: "Mono", fontSize: 30, color: c.apoio }}>trilhoapp.com.br</span>
          </div>
        </div>
      </div>
    ),
    {
      width: largura,
      height: altura,
      fonts: [
        { name: "Cond", data: cond, weight: 700 },
        { name: "Mono", data: mono, weight: 500 },
        { name: "Sans", data: sans, weight: 500 },
      ],
      headers: { "Cache-Control": "private, max-age=86400" },
    },
  );
}
