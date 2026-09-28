"use client";

/**
 * Озвучка. Главные истории и похвала записаны диктором (ElevenLabs, голос «Svetlana — Children's Storyteller»,
 * файлы в public/audio). Любой другой текст читает голос браузера (Web Speech API) — бесплатно и без интернета.
 * Звук выключается в настройках родителя.
 */
import { random } from "./random";
import { getState } from "./store";

export const VOICE_CLIPS = {
  welcome: "/audio/welcome.mp3",
  mate: "/audio/mate.mp3",
  praise: ["/audio/praise-1.mp3", "/audio/praise-2.mp3", "/audio/praise-3.mp3"],
  retry: ["/audio/retry-1.mp3", "/audio/retry-2.mp3"],
  legend: (levelId: string) => `/audio/legend-${levelId}.mp3`,
} as const;

export const LEGEND_LEVELS = ["pawn", "knight", "bishop", "rook", "queen", "king"] as const;

type Listener = (playing: string | null) => void;
const listeners = new Set<Listener>();
let current: string | null = null;
let audio: HTMLAudioElement | null = null;

function emit(id: string | null) {
  current = id;
  for (const l of listeners) l(id);
}

export function onVoiceChange(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function playingId(): string | null {
  return current;
}

export function soundOn(): boolean {
  return getState().settings.sound !== false;
}

export function stopVoice() {
  if (audio) {
    audio.pause();
    audio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  emit(null);
}

/** Проиграть запись. id — чтобы кнопка знала, что сейчас звучит именно она. */
export function playClip(src: string, id: string = src, onFail?: () => void) {
  if (typeof window === "undefined") return;
  stopVoice();
  const a = new Audio(src);
  audio = a;
  emit(id);
  a.onended = () => {
    if (audio === a) {
      audio = null;
      emit(null);
    }
  };
  a.play().catch(() => {
    if (audio === a) {
      audio = null;
      emit(null);
    }
    onFail?.();
  });
}

/** Текст для чтения вслух: без разметки, шахматная запись — словами. */
export function speakable(text: string): string {
  return text
    .replace(/\*\*|`/g, "")
    .replace(/(?<![А-Яа-яЁё])Кр(?=[a-h])/g, "король ")
    .replace(/\b0-0-0\b/g, "длинная рокировка")
    .replace(/\b0-0\b/g, "короткая рокировка")
    .replace(/\s+/g, " ")
    .trim();
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Прочитать текст голосом браузера (по-русски). */
export function speak(text: string, id: string = text) {
  if (!canSpeak()) return;
  stopVoice();
  const u = new SpeechSynthesisUtterance(speakable(text));
  u.lang = "ru-RU";
  u.rate = 0.95;
  const ru = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("ru"));
  if (ru) u.voice = ru;
  u.onend = () => {
    if (current === id) emit(null);
  };
  u.onerror = () => {
    if (current === id) emit(null);
  };
  emit(id);
  window.speechSynthesis.speak(u);
}

/** Короткая похвала или подбадривание после ответа — если звук включён. */
export function cheer(kind: "praise" | "retry" | "mate") {
  if (!soundOn()) return;
  const list = kind === "mate" ? [VOICE_CLIPS.mate] : VOICE_CLIPS[kind];
  playClip(list[Math.floor(random() * list.length)], `cheer-${kind}`);
}
