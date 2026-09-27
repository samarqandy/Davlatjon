/**
 * Скачивает свободные изображения для шахматной энциклопедии с Wikimedia Commons
 * и записывает манифест с авторами и лицензиями (src/content/chess/images.json).
 *
 * Берутся только изображения в общественном достоянии или под лицензиями CC0 / CC BY / CC BY-SA:
 * для каждой статьи Википедии запрашивается её свободная заглавная картинка (pilicense=free),
 * затем у Commons — лицензия и автор файла. Всё остальное отбрасывается.
 *
 * Запуск: node scripts/fetch-chess-images.mjs [--only id1,id2]
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UA = "DavlatjonLab/1.0 (educational chess project; https://github.com/samarqandy/Davlatjon)";
const OUT_DIR = "public/images/chess";
const MANIFEST = "src/content/chess/images.json";
const CACHE_DIR = "node_modules/.cache/chess-images";
const MAX_SIDE = 960;
const THUMB = 240;

/** id → статья английской Википедии (или конкретный файл Commons). */
const ENTRIES = [
  // Люди и места знаменитых партий
  { id: "morphy", wiki: "Paul Morphy" },
  { id: "anderssen", wiki: "Adolf Anderssen" },
  { id: "kieseritzky", wiki: "Lionel Kieseritzky" },
  { id: "dufresne", wiki: "Jean Dufresne" },
  { id: "reti", wiki: "Richard Réti" },
  { id: "tartakower", wiki: "Savielly Tartakower" },
  { id: "fischer", wiki: "Bobby Fischer" },
  { id: "philidor", wiki: "François-André Danican Philidor" },
  { id: "brunswick", wiki: "Charles II, Duke of Brunswick" },
  { id: "cafe-regence", wiki: "Café de la Régence" },
  { id: "salle-ventadour", wiki: "Salle Ventadour" },
  { id: "crystal-palace", wiki: "The Crystal Palace" },
  { id: "great-exhibition", wiki: "Great Exhibition" },
  { id: "marshall-club", wiki: "Marshall Chess Club", file: "File:Marshall Chess Club Second Floor Playing Room.jpg" },
  { id: "space-chess", wiki: "Chess in space", file: "File:Expedition 65 Preflight (NHQ202104030013).jpg" },
  // История
  { id: "chaturanga", wiki: "Chaturanga" },
  { id: "shatranj", wiki: "Shatranj" },
  { id: "afrasiab", wiki: "Afrasiab (Samarkand)", file: "File:Chessmen from Samarkhand.jpg" },
  { id: "suli", wiki: "Abu Bakr al-Suli" },
  { id: "biruni", wiki: "Al-Biruni" },
  { id: "timur", wiki: "Timur", file: "File:Toshkent shahridagi Amir Temur haykali.jpg" },
  { id: "lewis", wiki: "Lewis chessmen" },
  { id: "ruy-lopez", wiki: "Ruy López de Segura" },
  { id: "greco", wiki: "Gioachino Greco" },
  { id: "deep-blue", wiki: "Deep Blue (chess computer)" },
  // Чемпионы мира
  { id: "steinitz", wiki: "Wilhelm Steinitz" },
  { id: "lasker", wiki: "Emanuel Lasker" },
  { id: "capablanca", wiki: "José Raúl Capablanca" },
  { id: "alekhine", wiki: "Alexander Alekhine" },
  { id: "euwe", wiki: "Max Euwe" },
  { id: "botvinnik", wiki: "Mikhail Botvinnik" },
  { id: "smyslov", wiki: "Vasily Smyslov" },
  { id: "tal", wiki: "Mikhail Tal" },
  { id: "petrosian", wiki: "Tigran Petrosian" },
  { id: "spassky", wiki: "Boris Spassky" },
  { id: "karpov", wiki: "Anatoly Karpov" },
  { id: "kasparov", wiki: "Garry Kasparov" },
  { id: "kramnik", wiki: "Vladimir Kramnik" },
  { id: "anand", wiki: "Viswanathan Anand" },
  { id: "carlsen", wiki: "Magnus Carlsen" },
  { id: "ding", wiki: "Ding Liren" },
  { id: "gukesh", wiki: "Gukesh Dommaraju" },
  // Чемпионки и легенды
  { id: "menchik", wiki: "Vera Menchik" },
  { id: "gaprindashvili", wiki: "Nona Gaprindashvili" },
  { id: "chiburdanidze", wiki: "Maia Chiburdanidze" },
  { id: "hou-yifan", wiki: "Hou Yifan" },
  { id: "ju-wenjun", wiki: "Ju Wenjun" },
  { id: "polgar", wiki: "Judit Polgár" },
  // Узбекистан
  { id: "kasimdzhanov", wiki: "Rustam Kasimdzhanov" },
  { id: "abdusattorov", wiki: "Nodirbek Abdusattorov" },
  { id: "sindarov", wiki: "Javokhir Sindarov" },
];

const ALLOWED_LICENSE = /^(pd|cc0|cc-by(-sa)?)(-|$)/i;
const RASTER = new Set(["image/jpeg", "image/png", "image/webp", "image/tiff", "image/gif"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, tries = 7) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" } });
    if (res.ok) return res;
    if (res.status === 429 || res.status >= 500) {
      const wait = Math.max(Number(res.headers.get("retry-after")) || 0, 15) * 1000;
      console.log(`  ${res.status} — ждём ${wait / 1000} с: ${url.slice(0, 80)}…`);
      await sleep(wait);
      continue;
    }
    throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`Не удалось скачать ${url}`);
}

async function api(host, params) {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", ...params });
  const res = await fetchWithRetry(url);
  return res.json();
}

const chunks = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
const norm = (t) => t.replace(/_/g, " ").trim();
const ENTITIES = { amp: "&", quot: '"', lt: "<", gt: ">", nbsp: " ", "#039": "'", "#39": "'" };
const stripHtml = (s) =>
  String(s ?? "")
    .replace(/<style[^>]*>.*?<\/style>/gs, "")
    .replace(/<span[^>]*display:\s*none[^>]*>.*?<\/span>/gs, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|quot|lt|gt|nbsp|#039|#39);/g, (_, e) => ENTITIES[e])
    .replace(/\[\[|\]\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Авторы, чьи подписи на Commons двуязычны или содержат лишнее. */
const AUTHOR_OVERRIDES = {
  polgar: "Przemysław Jahr",
  capablanca: "Keystone-France",
  biruni: "Почта СССР, 1973",
  dufresne: "Неизвестный художник",
};

/** Заглавные свободные картинки статей Википедии: заголовок статьи → имя файла. */
async function pageImages(titles) {
  const out = new Map();
  for (const batch of chunks(titles, 50)) {
    const data = await api("en.wikipedia.org", {
      action: "query",
      prop: "pageimages",
      piprop: "name",
      pilicense: "free",
      redirects: "1",
      titles: batch.join("|"),
    });
    const alias = new Map();
    for (const r of [...(data.query.normalized ?? []), ...(data.query.redirects ?? [])]) {
      alias.set(r.to, alias.get(r.from) ?? r.from);
    }
    for (const p of data.query.pages) {
      const original = alias.get(p.title) ?? p.title;
      if (p.pageimage) out.set(original, `File:${p.pageimage}`);
      else console.log(`  нет свободной картинки: ${p.title}${p.missing ? " (статьи нет)" : ""}`);
    }
    await sleep(1000);
  }
  return out;
}

/** Лицензии, авторы и адреса файлов на Commons. */
async function imageInfo(files) {
  const out = new Map();
  for (const batch of chunks(files, 50)) {
    const data = await api("commons.wikimedia.org", {
      action: "query",
      prop: "imageinfo",
      iiprop: "url|extmetadata|size|mime",
      iiurlwidth: String(MAX_SIDE * 1.25),
      iiextmetadatafilter:
        "LicenseShortName|LicenseUrl|License|Artist|Credit|AttributionRequired|ObjectName|DateTimeOriginal",
      titles: batch.join("|"),
    });
    for (const p of data.query.pages) {
      if (p.missing || !p.imageinfo?.length) continue;
      out.set(norm(p.title), { title: p.title, ...p.imageinfo[0] });
    }
    await sleep(1000);
  }
  return out;
}

async function main() {
  const only = process.argv.includes("--only")
    ? new Set(process.argv[process.argv.indexOf("--only") + 1].split(","))
    : null;
  const entries = only ? ENTRIES.filter((e) => only.has(e.id)) : ENTRIES;
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(CACHE_DIR, { recursive: true });

  console.log("1. Заглавные картинки статей…");
  const byWiki = await pageImages(entries.filter((e) => e.wiki && !e.file).map((e) => e.wiki));
  const wanted = entries.map((e) => ({ ...e, file: e.file ?? byWiki.get(e.wiki) })).filter((e) => e.file);

  console.log("2. Лицензии на Commons…");
  const info = await imageInfo([...new Set(wanted.map((e) => e.file))]);

  console.log("3. Скачивание и уменьшение…");
  const images = [];
  const rejected = [];
  for (const e of wanted) {
    const ii = info.get(norm(e.file));
    if (!ii) {
      rejected.push(`${e.id}: файла ${e.file} нет на Commons`);
      continue;
    }
    const meta = Object.fromEntries(Object.entries(ii.extmetadata ?? {}).map(([k, v]) => [k, v.value]));
    const code = String(meta.License ?? "").toLowerCase();
    if (!ALLOWED_LICENSE.test(code) || !RASTER.has(ii.mime)) {
      rejected.push(`${e.id}: ${ii.title} — лицензия «${meta.LicenseShortName ?? code}», ${ii.mime}`);
      continue;
    }
    const src = ii.thumburl ?? ii.url;
    const cached = path.join(CACHE_DIR, `${e.id}${path.extname(new URL(src).pathname) || ".jpg"}`);
    let buf;
    try {
      buf = await fs.readFile(cached);
    } catch {
      const res = await fetchWithRetry(src);
      buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(cached, buf);
      await sleep(400);
    }
    const main = await sharp(buf)
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(path.join(OUT_DIR, `${e.id}.webp`), main.data);
    const thumb = await sharp(buf)
      .rotate()
      .resize({ width: THUMB, height: THUMB, fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 78 })
      .toBuffer();
    await fs.writeFile(path.join(OUT_DIR, `${e.id}-thumb.webp`), thumb);

    const artist = AUTHOR_OVERRIDES[e.id] ?? stripHtml(meta.Artist);
    images.push({
      id: e.id,
      file: `/images/chess/${e.id}.webp`,
      thumb: `/images/chess/${e.id}-thumb.webp`,
      width: main.info.width,
      height: main.info.height,
      title: stripHtml(meta.ObjectName) || e.wiki || ii.title,
      wiki: e.wiki ? `https://en.wikipedia.org/wiki/${encodeURIComponent(e.wiki.replace(/ /g, "_"))}` : undefined,
      commons: ii.title,
      source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(ii.title.replace(/ /g, "_"))}`,
      author: artist,
      credit: stripHtml(meta.Credit),
      license: stripHtml(meta.LicenseShortName) || code,
      licenseCode: code,
      licenseUrl: meta.LicenseUrl ? String(meta.LicenseUrl).replace(/^http:\/\//, "https://") : undefined,
      attributionRequired: String(meta.AttributionRequired).toLowerCase() === "true",
    });
    console.log(`  ✓ ${e.id.padEnd(16)} ${images.at(-1).license.padEnd(16)} ${artist.slice(0, 40)}`);
  }

  images.sort((a, b) => a.id.localeCompare(b.id));
  let previous = [];
  if (only) {
    try {
      previous = JSON.parse(await fs.readFile(MANIFEST, "utf8")).images.filter((i) => !only.has(i.id));
    } catch {}
  }
  const all = [...previous, ...images].sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(
    MANIFEST,
    JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), images: all }, null, 2) + "\n",
  );
  console.log(`\nГотово: ${images.length} изображений → ${OUT_DIR}, манифест ${MANIFEST}`);
  if (rejected.length) console.log("Отклонено:\n  " + rejected.join("\n  "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
