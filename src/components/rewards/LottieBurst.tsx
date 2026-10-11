"use client";

import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import { ANIM_ASSETS, DOTLOTTIE_WASM_URL } from "@/lib/anim/assets";

// WASM — со своего домена (scripts/copy-anim-wasm.mjs), а не с CDN.
setWasmUrl(DOTLOTTIE_WASM_URL);

/** Разовый салют из файла confetti.lottie на весь экран; убирается по окончании. Грузится лениво и только если файл есть. */
export default function LottieBurst({ onDone }: { onDone: () => void }) {
  return (
    <DotLottieReact
      src={ANIM_ASSETS.confetti.src}
      autoplay
      loop={false}
      renderConfig={{ devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2), freezeOnOffscreen: true }}
      dotLottieRefCallback={(dl) => dl?.addEventListener("complete", onDone)}
      className="h-full w-full"
      aria-hidden
    />
  );
}
