/* Офлайн-режим: страницы — сначала из сети, без сети — из кэша; картинки и файлы сборки — из кэша. */
const CACHE = "davlatjon-lab-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.status === 200) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.status === 200) cache.put(request, response.clone());
    return response;
  } catch {
    const hit = (await cache.match(request)) || (request.mode === "navigate" ? await cache.match("/") : undefined);
    return (
      hit ||
      new Response("Нет интернета, а эта страница ещё не открывалась на этом устройстве.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Звук браузер запрашивает кусками — его не кэшируем.
  if (url.pathname.endsWith(".mp3")) return;
  if (url.pathname.startsWith("/_next/static/") || /\.(webp|png|jpg|svg|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});
