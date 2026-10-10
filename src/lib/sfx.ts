"use client";

/**
 * Звуки доски: ход, взятие, рокировка, превращение, шах, «так нельзя».
 * Набор «Деревянные» — короткие записи (ElevenLabs Sound Effects, public/audio/sfx), набор «Мягкие» и запасной
 * вариант, пока записи не загрузились, — синтез Web Audio. Всё работает офлайн и не мешает диктору.
 * Браузеры (особенно iOS) дают звук только после первого касания: до него звуки просто пропускаются.
 */
import { getState } from "./store";

export type Sfx = "move" | "capture" | "castle" | "promote" | "collect" | "check" | "illegal";

/** Записанные звуки (набор «Деревянные»). У «collect» записи нет — он всегда синтезируется. */
const SAMPLES: Partial<Record<Sfx, string>> = {
  move: "/audio/sfx/move.mp3",
  capture: "/audio/sfx/capture.mp3",
  castle: "/audio/sfx/castle.mp3",
  promote: "/audio/sfx/promote.mp3",
  check: "/audio/sfx/check.mp3",
  illegal: "/audio/sfx/illegal.mp3",
};
const buffers: Partial<Record<Sfx, AudioBuffer>> = {};
/** Во сколько раз усилить запись, чтобы все звуки были одной громкости (illegal записан очень тихо). */
const boost: Partial<Record<Sfx, number>> = {};
const TARGET_PEAK: Partial<Record<Sfx, number>> = { check: 0.55, promote: 0.55, illegal: 0.5 };
let loading = false;

/** Один раз подгрузить и раскодировать записи; не вышло — звучит синтез. */
function loadSamples(c: AudioContext) {
  if (loading || typeof fetch === "undefined") return;
  loading = true;
  for (const [kind, url] of Object.entries(SAMPLES) as [Sfx, string][]) {
    void fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((data) => c.decodeAudioData(data))
      .then((buf) => {
        let peak = 0;
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
        boost[kind] = peak > 0.01 ? Math.min(8, (TARGET_PEAK[kind] ?? 0.8) / peak) : 1;
        buffers[kind] = buf;
      })
      .catch(() => undefined);
  }
}

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
  if (!c) return;
  if (c.state === "suspended") void c.resume().catch(() => undefined);
  loadSamples(c);
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

/** Сыграть запись; false — записи нет (ещё не загрузилась), тогда играет синтез. */
function sample(c: AudioContext, kind: Sfx, at: number): boolean {
  const buf = buffers[kind];
  if (!buf) return false;
  const src = c.createBufferSource();
  src.buffer = buf;
  // Лёгкая разница в высоте — чтобы подряд идущие ходы не звучали как копии.
  src.playbackRate.value = 0.97 + Math.random() * 0.06;
  const gain = c.createGain();
  gain.gain.value = boost[kind] ?? 1;
  src.connect(gain).connect(c.destination);
  src.start(at);
  return true;
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
  if (getState().settings.boardSoundSet !== "soft" && sample(c, kind, at)) return;
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

export type Reward = "win" | "level";

/** Колокольчик: чистый тон с обертоном, мягкий «звон» с долгим затуханием. */
function bell(c: AudioContext, at: number, freq: number, dur: number, vol: number) {
  tone(c, at, "sine", freq, freq, dur, vol);
  tone(c, at, "triangle", freq * 2, freq * 2, dur * 0.6, vol * 0.25);
}

/**
 * Награда за решение: «win» — короткий весёлый звон (два тона вверх), «level» — фанфара нового уровня.
 * Включается тем же переключателем, что и звуки доски; до первого касания (политика браузеров) молчит.
 */
export function playReward(kind: Reward) {
  if (!boardSoundsOn()) return;
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("reward-sfx", { detail: kind }));
  const c = context();
  if (!c || c.state !== "running" || !master) return;
  const at = c.currentTime + 0.05;
  if (kind === "win") {
    bell(c, at, 988, 0.22, 0.28);
    bell(c, at + 0.1, 1319, 0.4, 0.3);
    return;
  }
  // До-ми-соль-до-ми: восходящая фанфара, последний тон — долгий.
  [523, 659, 784, 1047].forEach((f, i) => bell(c, at + i * 0.11, f, 0.3, 0.3));
  bell(c, at + 0.5, 1319, 0.9, 0.34);
  bell(c, at + 0.5, 988, 0.9, 0.18);
}
