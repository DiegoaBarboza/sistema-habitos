// Service worker do Trilho: cache do app para abrir sem conexão e recebimento do lembrete (push).
const VERSAO = "trilho-v1";
const CACHE_PAGINAS = `${VERSAO}-paginas`;
const CACHE_ESTATICOS = `${VERSAO}-estaticos`;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((n) => !n.startsWith(VERSAO)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Arquivos do build têm hash no nome: cache primeiro.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/brand/")) {
    evento.respondWith(
      caches.match(request).then(
        (salvo) =>
          salvo ||
          fetch(request).then((resposta) => {
            if (resposta.ok) {
              const copia = resposta.clone();
              caches.open(CACHE_ESTATICOS).then((c) => c.put(request, copia));
            }
            return resposta;
          }),
      ),
    );
    return;
  }

  // Páginas: rede primeiro; sem conexão, a última versão salva.
  if (request.mode === "navigate") {
    evento.respondWith(
      fetch(request)
        .then((resposta) => {
          if (resposta.ok && !resposta.redirected) {
            const copia = resposta.clone();
            caches.open(CACHE_PAGINAS).then((c) => c.put(url.pathname, copia));
          }
          return resposta;
        })
        .catch(() =>
          caches
            .match(url.pathname)
            .then((salvo) => salvo || caches.match("/hoje"))
            .then(
              (salvo) =>
                salvo ||
                new Response("<h1>Sem conexão</h1><p>Abra o Trilho de novo quando a internet voltar.</p>", {
                  headers: { "Content-Type": "text/html; charset=utf-8" },
                }),
            ),
        ),
    );
  }
});

// Ao sair da conta, a página pede para apagar o que ficou salvo deste usuário.
self.addEventListener("message", (evento) => {
  if (evento.data === "limpar") {
    evento.waitUntil(caches.keys().then((nomes) => Promise.all(nomes.map((n) => caches.delete(n)))));
  }
});

self.addEventListener("push", (evento) => {
  const dados = evento.data ? evento.data.json() : {};
  evento.waitUntil(
    self.registration.showNotification(dados.titulo || "Trilho", {
      body: dados.corpo || "",
      icon: "/brand/icon-192.png",
      badge: "/brand/icon-192.png",
      data: { url: dados.url || "/hoje" },
      tag: "lembrete-diario",
    }),
  );
});

self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const destino = evento.notification.data?.url || "/hoje";
  evento.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((janelas) => {
      const aberta = janelas.find((j) => new URL(j.url).origin === self.location.origin);
      if (aberta) return aberta.focus().then((j) => j.navigate(destino));
      return self.clients.openWindow(destino);
    }),
  );
});
