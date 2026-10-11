/**
 * Файлы анимации: реальных .riv и .lottie в репозитории пока нет, поэтому у каждого стоит `available: false` —
 * интерфейс рисует запасной вариант (птица из logo.webp + CSS, конфетти из CSS). Когда файл положат
 * в public/animations/, достаточно поставить `true` (tests/anim-assets.test.ts проверяет, что флаг не врёт).
 * Договорённость об именах — в docs/animations.md.
 */
export interface AnimAsset {
  src: string;
  available: boolean;
}

export const ANIM_ASSETS = {
  /** Птица Парвоз: артборд `Parvoz`, state machine `Mascot`. */
  mascot: { src: "/animations/mascot.riv", available: true, artboard: "Parvoz", stateMachine: "Mascot" },
  /** Разовый салют для конца занятия и нового уровня. */
  confetti: { src: "/animations/confetti.lottie", available: false },
} as const satisfies Record<string, AnimAsset & Record<string, unknown>>;

/**
 * WASM-движки отдаём со своего домена (скрипт scripts/copy-anim-wasm.mjs кладёт их в public/vendor/):
 * по умолчанию обе библиотеки качают их с unpkg/jsDelivr — для детского сайта это лишние сторонние запросы,
 * и так не работает без интернета. Версия в адресе — чтобы кэш обновлялся вместе с пакетом.
 */
export const RIVE_RUNTIME_VERSION = "2.44.0";
export const DOTLOTTIE_WEB_VERSION = "0.81.0";
export const RIVE_WASM_URL = `/vendor/rive/rive.wasm?v=${RIVE_RUNTIME_VERSION}`;
export const DOTLOTTIE_WASM_URL = `/vendor/dotlottie/dotlottie-player.wasm?v=${DOTLOTTIE_WEB_VERSION}`;
