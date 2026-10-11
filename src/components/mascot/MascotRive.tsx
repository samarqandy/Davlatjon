"use client";

import { useEffect } from "react";
import { Alignment, Fit, Layout, RuntimeLoader, useRive } from "@rive-app/react-canvas-lite";
import { ANIM_ASSETS, RIVE_WASM_URL } from "@/lib/anim/assets";
import { riveCommand, type Mood } from "@/lib/anim/mood";

// WASM — со своего домена, без запасного адреса на сторонний CDN (скрипт scripts/copy-anim-wasm.mjs кладёт файл в public/vendor).
RuntimeLoader.setWasmUrl(RIVE_WASM_URL);
RuntimeLoader.setWasmFallbackUrl(null);

const LAYOUT = new Layout({ fit: Fit.Contain, alignment: Alignment.Center });
const { src, artboard, stateMachine } = ANIM_ASSETS.mascot;

/** Птица в Rive. Грузится лениво (MascotLive) и только когда файл mascot.riv действительно есть. */
export default function MascotRive({ mood, onReady, onFail }: { mood: Mood; onReady: () => void; onFail: () => void }) {
  const { rive, RiveComponent } = useRive(
    {
      src,
      artboard,
      stateMachines: stateMachine,
      autoplay: true,
      layout: LAYOUT,
      onLoad: onReady,
      onLoadError: onFail,
    },
    { shouldUseIntersectionObserver: true },
  );

  useEffect(() => {
    if (!rive) return;
    const inputs = rive.stateMachineInputs(stateMachine) ?? [];
    const cmd = riveCommand(mood);
    const num = inputs.find((i) => i.name === "mood");
    if (num) num.value = cmd.mood;
    if (cmd.trigger) inputs.find((i) => i.name === cmd.trigger)?.fire();
  }, [rive, mood]);

  return <RiveComponent className="absolute inset-0 h-full w-full" aria-hidden />;
}
