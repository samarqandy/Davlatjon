"use client";

/**
 * Звуки доски: ход, взятие, рокировка, превращение, шах, «так нельзя».
 * Синтезируются Web Audio — без файлов (не нужны лицензии, работают офлайн) и не мешают диктору.
 * Браузеры (особенно iOS) дают звук только после первого касания: до него звуки просто пропускаются.
 */
import { getState } from "./store";

export type Sfx = "move" | "capture" | "castle" | "promote" | "collect" | "check" | "illegal";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
    } catch {
      ctx = null;
      return null;
    }
  }
  return ctx;
}

/** Разрешить звук: вызывается при касании или нажатии клавиши. */
export function sfxUnlock() {
  const c = context();
  if (c && c.state === "suspended") void c.resume().catch(() => undefined);
}

if (typeof document !== "undefined") {
  const once = () => {
    sfxUnlock();
    document.removeEventListener("pointerdown", once, true);
    document.removeEventListener("keydown", once, true);
  };
  document.addEventListener("pointerdown", once, { capture: true, passive: true });
  document.addEventListener("keydown", once, { capture: true });
}

export function boardSoundsOn(): boolean {
  return getState().settings.boardSounds !== false;
}

/** Короткий тон с затуханием. */
function tone(c: AudioContext, at: number, type: OscillatorType, from: number, to: number, dur: number, vol: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + dur);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(master!);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

/** Деревянный щелчок: короткий шум через полосовой фильтр + низкий «тук». */
function knock(c: AudioContext, at: number, vol: number, pitch: number) {
  const len = Math.floor(c.sampleRate * 0.03);
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800 * pitch;
  filter.Q.value = 1.2;
  const gain = c.createGain();
  gain.gain.value = vol;
  noise.connect(filter).connect(gain).connect(master!);
  noise.start(at);
  tone(c, at, "sine", 220 * pitch, 140 * pitch, 0.06, vol * 0.8);
}

const PRIORITY: Record<Sfx, number> = { illegal: 6, promote: 5, castle: 4, capture: 3, collect: 2, move: 1, check: 0 };
let lastAt = 0;
let lastPriority = 0;

/** Сыграть звук доски (если звуки ходов включены). Два звука почти одновременно — остаётся более важный. */
export function playSfx(kind: Sfx) {
  if (!boardSoundsOn()) return;
  // Для проверок: какой звук доска хотела сыграть.
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("board-sfx", { detail: kind }));
  const c = context();
  if (!c || c.state !== "running" || !master) return;
  const now = c.currentTime;
  if (kind !== "check" && now - lastAt < 0.04 && PRIORITY[kind] <= lastPriority) return;
  if (kind !== "check") {
    lastAt = now;
    lastPriority = PRIORITY[kind];
  }
  const at = now + (kind === "check" ? 0.07 : 0);
  switch (kind) {
    case "move":
      knock(c, at, 0.9, 1);
      break;
    case "capture":
      knock(c, at, 1, 0.8);
      knock(c, at + 0.018, 0.7, 0.7);
      break;
    case "castle":
      knock(c, at, 0.9, 1);
      knock(c, at + 0.09, 0.9, 1.05);
      break;
    case "promote":
      [523, 659, 784].forEach((f, i) => tone(c, at + i * 0.08, "triangle", f, f, 0.16, 0.35));
      break;
    case "collect":
      tone(c, at, "sine", 1320, 1760, 0.12, 0.3);
      break;
    case "check":
      tone(c, at, "sine", 880, 880, 0.09, 0.25);
      tone(c, at + 0.1, "sine", 1175, 1175, 0.12, 0.25);
      break;
    case "illegal":
      tone(c, at, "triangle", 150, 110, 0.14, 0.4);
      break;
  }
}
