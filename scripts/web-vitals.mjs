// Замер скорости страницы на «среднем телефоне»: сеть 1,6 Мбит/с с задержкой 150 мс, процессор в 4 раза медленнее.
// Показывает LCP, FCP, CLS, время блокировки и вес скриптов — медиану из нескольких загрузок.
//
//   npm run build && npm run start -- -p 3100
//   node scripts/web-vitals.mjs /  /chess            # новичок (пустой прогресс)
//   node scripts/web-vitals.mjs --state '{"version":1,"welcomed":true,"settings":{"age":7}}' /
//
// Числа сравнимы только между собой (один компьютер, одна сборка): это не Lighthouse и не данные с телефонов.
import { chromium, devices } from "@playwright/test";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i < 0 ? fallback : args.splice(i, 2)[1];
};
const base = flag("--base", "http://localhost:3100");
const runs = Number(flag("--runs", "3"));
const state = flag("--state", "");
const paths = args.length ? args : ["/"];

/** Наблюдатели ставятся до загрузки страницы: значения копятся в window.__vitals. */
function observe() {
  const v = (window.__vitals = { lcp: 0, element: "", cls: 0, shifts: [], fcp: 0, blocked: 0 });
  const name = (el) =>
    el && el.nodeType === 1
      ? `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""} «${(el.textContent || "").trim().slice(0, 40)}»`
      : "?";
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      v.lcp = e.startTime;
      v.element = name(e.element);
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      v.cls += e.value;
      v.shifts.push({
        value: e.value,
        at: Math.round(e.startTime),
        nodes: (e.sources || []).slice(0, 2).map((s) => name(s.node)),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (e.name === "first-contentful-paint") v.fcp = e.startTime;
  }).observe({ type: "paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) v.blocked += Math.max(0, e.duration - 50);
  }).observe({ type: "longtask", buffered: true });
}

/**
 * Все скрипты первого визита: из HTML страницы, догруженные ею и скрипты соседних страниц, которые Next.js
 * скачивает заранее по ссылкам. Без замедления сети и без service worker — иначе часть запросов не видна.
 */
async function allScripts(path) {
  const context = await browser.newContext({ ...devices["Pixel 7"], serviceWorkers: "block" });
  const page = await context.newPage();
  if (state) await page.addInitScript((s) => localStorage.setItem("davlatjon-lab:v1", s), state);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  const scripts = new Set();
  let bytes = 0;
  cdp.on("Network.responseReceived", (e) => e.type === "Script" && scripts.add(e.requestId));
  cdp.on("Network.loadingFinished", (e) => scripts.has(e.requestId) && (bytes += e.encodedDataLength));
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  await context.close();
  return bytes;
}

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined });
for (const path of paths) {
  const rows = [];
  for (let i = 0; i < runs; i++) {
    const context = await browser.newContext({ ...devices["Pixel 7"] });
    const page = await context.newPage();
    if (state) await page.addInitScript((s) => localStorage.setItem("davlatjon-lab:v1", s), state);
    await page.addInitScript(observe);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    // Скрипты из HTML страницы: они запрошены до того, как включится service worker, поэтому число устойчиво.
    // Остальные запросы он перехватывает, и браузер показывает их вес нулём — их считает отдельный проход ниже.
    const scripts = new Set();
    let js = 0;
    cdp.on(
      "Network.requestWillBeSent",
      (e) => e.type === "Script" && e.initiator.type === "parser" && scripts.add(e.requestId),
    );
    cdp.on("Network.loadingFinished", (e) => scripts.has(e.requestId) && (js += e.encodedDataLength));
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2500);
    rows.push({ ...(await page.evaluate(() => window.__vitals)), js });
    await context.close();
  }
  const total = await allScripts(path);
  rows.sort((a, b) => a.lcp - b.lcp);
  const m = rows[Math.floor(rows.length / 2)];
  const sec = (ms) => (ms / 1000).toFixed(2);
  console.log(`${path}${state ? "  (свой прогресс)" : "  (новичок)"}`);
  console.log(
    `  LCP ${sec(m.lcp)} с (все: ${rows.map((r) => sec(r.lcp)).join(", ")}) · FCP ${sec(m.fcp)} с · CLS ${m.cls.toFixed(3)} · блокировка ${Math.round(m.blocked)} мс · скрипты страницы ${Math.round(m.js / 1024)} КиБ, с догрузкой и соседними страницами ${Math.round(total / 1024)} КиБ`,
  );
  console.log(`  самый большой элемент: ${m.element}`);
  for (const s of m.shifts.filter((x) => x.value >= 0.005))
    console.log(`  сдвиг ${s.value.toFixed(3)} на ${s.at} мс: ${s.nodes.join(" | ")}`);
}
await browser.close();
