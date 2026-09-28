"use client";

/**
 * Озвучка. Главные истории и похвала записаны диктором: по-русски — голос «Svetlana — Children's Storyteller»
 * (ElevenLabs, файлы в public/audio), по-узбекски — голос «Uzbekcha» (public/audio/uz). Любой другой текст
 * читает голос браузера (Web Speech API) — бесплатно и без интернета, если в системе есть голос нужного языка.
 * Звук выключается в настройках родителя.
 */
import type { Lang } from "./lang";
import { random } from "./random";
import { getState } from "./store";

export const LEGEND_LEVELS = ["pawn", "knight", "bishop", "rook", "queen", "king"] as const;

export const SECRET_IDS = [
  "sissa",
  "envoy",
  "gav-talhand",
  "khwarizmi",
  "biruni",
  "mamun",
  "suli",
  "dilaram",
  "khayyam",
  "ibn-sina",
  "turk",
  "adli",
  "mad-queen",
  "alfonso",
  "sages",
] as const;

/**
 * Какие записи уже есть по-узбекски. Пока записи нет, по-узбекски ничего не звучит —
 * русский диктор в узбекском интерфейсе был бы некстати.
 */
export const UZ_CLIPS: ReadonlySet<string> = new Set<string>([]);

function clip(lang: Lang, name: string): string | undefined {
  if (lang === "ru") return `/audio/${name}.mp3`;
  return UZ_CLIPS.has(name) ? `/audio/uz/${name}.mp3` : undefined;
}

function clips(lang: Lang, names: string[]): string[] {
  return names.map((n) => clip(lang, n)).filter((x): x is string => !!x);
}

export const VOICE_CLIPS = {
  welcome: (lang: Lang) => clip(lang, "welcome"),
  mate: (lang: Lang) => clips(lang, ["mate"]),
  praise: (lang: Lang) => clips(lang, ["praise-1", "praise-2", "praise-3"]),
  retry: (lang: Lang) => clips(lang, ["retry-1", "retry-2"]),
  legend: (levelId: string, lang: Lang) => clip(lang, `legend-${levelId}`),
  secret: (id: string, lang: Lang) => clip(lang, `secret-${id}`),
};

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

const FIGURE_WORDS: Record<Lang, Record<string, string>> = {
  ru: { "♔": "король ", "♕": "ферзь ", "♖": "ладья ", "♗": "слон ", "♘": "конь " },
  uz: { "♔": "shoh ", "♕": "farzin ", "♖": "rux ", "♗": "fil ", "♘": "ot " },
};

/** Текст для чтения вслух: без разметки, шахматная запись — словами. */
export function speakable(text: string, lang: Lang = "ru"): string {
  const long = lang === "uz" ? "uzun rokirovka" : "длинная рокировка";
  const short = lang === "uz" ? "qisqa rokirovka" : "короткая рокировка";
  return text
    .replace(/\*\*|`/g, "")
    .replace(/(?<![А-Яа-яЁё])Кр(?=[a-h])/g, "король ")
    .replace(/[♔♕♖♗♘]/g, (f) => FIGURE_WORDS[lang][f])
    .replace(/\b0-0-0\b/g, long)
    .replace(/\b0-0\b/g, short)
    .replace(/\s+/g, " ")
    .trim();
}

const SPEECH_LANG: Record<Lang, string> = { ru: "ru-RU", uz: "uz-UZ" };

function voiceFor(lang: Lang): SpeechSynthesisVoice | undefined {
  return window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
}

/**
 * Можно ли прочитать текст голосом браузера. По-русски — всегда, когда есть синтез речи;
 * по-узбекски — только если в системе есть узбекский голос (иначе чужой голос исковеркает текст).
 */
export function canSpeak(lang: Lang = "ru"): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  return lang === "ru" || !!voiceFor(lang);
}

/** Сообщить, когда браузер загрузит список голосов (он приходит не сразу). */
export function onVoicesChanged(cb: () => void): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", cb);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", cb);
}

/** Прочитать текст голосом браузера на нужном языке. */
export function speak(text: string, id: string = text, lang: Lang = "ru") {
  if (!canSpeak(lang)) return;
  stopVoice();
  const u = new SpeechSynthesisUtterance(speakable(text, lang));
  u.lang = SPEECH_LANG[lang];
  u.rate = 0.95;
  const voice = voiceFor(lang);
  if (voice) u.voice = voice;
  u.onend = () => {
    if (current === id) emit(null);
  };
  u.onerror = () => {
    if (current === id) emit(null);
  };
  emit(id);
  window.speechSynthesis.speak(u);
}

/** Короткая похвала или подбадривание после ответа — если звук включён и запись есть на языке интерфейса. */
export function cheer(kind: "praise" | "retry" | "mate") {
  if (!soundOn()) return;
  const lang: Lang = getState().settings.lang === "uz" ? "uz" : "ru";
  const list = VOICE_CLIPS[kind](lang);
  if (list.length) playClip(list[Math.floor(random() * list.length)], `cheer-${kind}`);
}
