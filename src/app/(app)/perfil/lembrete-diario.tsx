"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { inscreverPush, salvarLembrete } from "./acoes-lembrete";

type Suporte = "carregando" | "sim" | "ios-sem-instalar" | "nao";

function chaveParaBytes(base64: string) {
  const b = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(b), (c) => c.charCodeAt(0));
}

function detectarSuporte(): Suporte {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const instalado =
    window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
  if (ios && !instalado) return "ios-sem-instalar";
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window ? "sim" : "nao";
}

// Sem rede com o serviço de push do navegador, o subscribe pode nunca responder.
const PRAZO_INSCRICAO_MS = 20_000;
function comPrazo<T>(promessa: Promise<T>) {
  return Promise.race([
    promessa,
    new Promise<never>((_, rejeitar) => setTimeout(() => rejeitar(new Error("prazo")), PRAZO_INSCRICAO_MS)),
  ]);
}

async function registroDoSW() {
  return (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register("/sw.js", { scope: "/" }));
}

export function LembreteDiario({
  ativoNoPerfil,
  horaInicial,
  chavePublica,
}: {
  ativoNoPerfil: boolean;
  horaInicial: string;
  chavePublica: string | null;
}) {
  // Depende do navegador: no servidor fica "carregando" e o cliente corrige sem erro de hidratação.
  const suporte = useSyncExternalStore<Suporte>(
    () => () => {},
    detectarSuporte,
    () => "carregando",
  );
  const [ligado, setLigado] = useState(false);
  const [hora, setHora] = useState(horaInicial.slice(0, 5));
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, iniciar] = useTransition();

  // O interruptor só aparece ligado se o perfil quer lembrete E este aparelho está inscrito.
  useEffect(() => {
    if (suporte !== "sim" || !ativoNoPerfil) return;
    navigator.serviceWorker
      .getRegistration()
      .then((r) => r?.pushManager.getSubscription())
      .then((inscricao) => setLigado(Boolean(inscricao) && Notification.permission === "granted"))
      .catch(() => {});
  }, [suporte, ativoNoPerfil]);

  function alternar() {
    setAviso(null);
    iniciar(async () => {
      try {
        if (ligado) {
          await salvarLembrete({ ativo: false, hora });
          setLigado(false);
          return;
        }
        if (!chavePublica) throw new Error("sem-chave");
        const permissao = await Notification.requestPermission();
        if (permissao !== "granted") {
          setAviso("As notificações estão bloqueadas para este site. Libere nas configurações do navegador.");
          return;
        }
        const registro = await registroDoSW();
        await navigator.serviceWorker.ready;
        const inscricao =
          (await registro.pushManager.getSubscription()) ??
          (await comPrazo(
            registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: chaveParaBytes(chavePublica) }),
          ));
        await inscreverPush(JSON.parse(JSON.stringify(inscricao)));
        await salvarLembrete({ ativo: true, hora });
        setLigado(true);
      } catch {
        setAviso("Não foi possível ligar o lembrete neste aparelho. Tente de novo.");
      }
    });
  }

  function mudarHora(nova: string) {
    setHora(nova);
    if (!/^\d{2}:\d{2}$/.test(nova)) return;
    iniciar(async () => {
      await salvarLembrete({ ativo: ligado, hora: nova }).catch(() => setAviso("Não foi possível salvar o horário."));
    });
  }

  return (
    <section aria-labelledby="rotulo-lembrete" className="flex flex-col gap-2.5">
      <h2 id="rotulo-lembrete" className="rotulo">
        Lembrete diário
      </h2>
      <div className="flex flex-col rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="flex flex-col">
            <span id="rotulo-interruptor" className="text-[15px] font-semibold">
              Lembrete de check-in
            </span>
            <span className="text-[13px] text-text-2">notificação no celular</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={ligado}
            aria-labelledby="rotulo-interruptor"
            disabled={ocupado || suporte === "carregando" || suporte === "nao" || suporte === "ios-sem-instalar"}
            onClick={alternar}
            className={`flex h-8 w-[52px] shrink-0 cursor-pointer rounded-2xl p-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${
              ligado ? "justify-end bg-accent" : "justify-start bg-track"
            }`}
          >
            <span className="size-[26px] rounded-full bg-white" />
          </button>
        </div>
        <label className="flex items-center justify-between px-4 py-3">
          <span className="text-[15px] font-semibold">Horário</span>
          <input
            type="time"
            value={hora}
            step={900}
            onChange={(e) => mudarHora(e.target.value)}
            className="min-h-11 bg-transparent text-right font-mono text-[15px] text-accent outline-none"
          />
        </label>
      </div>
      {suporte === "ios-sem-instalar" && (
        <p className="text-[13px] leading-normal text-text-2">
          Instale na tela de início para receber lembretes: toque em Compartilhar e depois em “Adicionar à Tela de Início”.
        </p>
      )}
      {suporte === "nao" && (
        <p className="text-[13px] leading-normal text-text-2">Este navegador não recebe notificações.</p>
      )}
      {aviso && (
        <p role="alert" className="text-[13px] leading-normal text-warn">
          {aviso}
        </p>
      )}
    </section>
  );
}

