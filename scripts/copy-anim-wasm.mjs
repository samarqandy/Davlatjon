// Кладёт WASM-движки Rive и dotLottie в public/vendor/ — чтобы они грузились с нашего домена, а не с unpkg/jsDelivr
// (для детского сайта — без сторонних запросов, и работает без интернета). Запускается после `npm install`.
// Файлы в git не хранятся (public/vendor/ в .gitignore); версии проверяет tests/anim-assets.test.ts.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  ["node_modules/@rive-app/canvas-lite/rive.wasm", "public/vendor/rive/rive.wasm"],
  [
    "node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm",
    "public/vendor/dotlottie/dotlottie-player.wasm",
  ],
];

for (const [from, to] of FILES) {
  const src = join(root, from);
  if (!existsSync(src)) {
    // Пакета нет (например, поставили без devDependencies) — не роняем установку, анимации просто останутся запасными.
    console.warn(`copy-anim-wasm: пропускаю, нет ${from}`);
    continue;
  }
  mkdirSync(dirname(join(root, to)), { recursive: true });
  copyFileSync(src, join(root, to));
  console.log(`copy-anim-wasm: ${from} -> ${to}`);
}
