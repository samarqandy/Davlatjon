"use client";

/**
 * Озвучка — только записи диктора ElevenLabs: по-русски — голос «Svetlana — Children's Storyteller»
 * (public/audio), по-узбекски — голос «Uzbekcha» (public/audio/uz). Голос браузера не используется:
 * где записи нет, там нет и кнопки «Послушать». Звук выключается в настройках родителя.
 */
import recorded from "@/content/voice-clips.json";
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
 * Какие записи есть по-узбекски: приветствие, похвала, легенды всех уровней и все тайны.
 * Пока записи нет, по-узбекски ничего не звучит — русский диктор в узбекском интерфейсе был бы некстати.
 */
export const UZ_CLIPS: ReadonlySet<string> = new Set<string>([
  "welcome",
  "praise-1",
  "praise-2",
  "praise-3",
  "retry-1",
  "retry-2",
  "mate",
  ...LEGEND_LEVELS.map((id) => `legend-${id}`),
  ...SECRET_IDS.map((id) => `secret-${id}`),
]);

function clip(lang: Lang, name: string): string | undefined {
  if (lang === "ru") return `/audio/${name}.mp3`;
  return UZ_CLIPS.has(name) ? `/audio/uz/${name}.mp3` : undefined;
}

function clips(lang: Lang, names: string[]): string[] {
  return names.map((n) => clip(lang, n)).filter((x): x is string => !!x);
}

/**
 * Записанные условия задач, карточки уроков и вопросы «Знаешь ли ты?»: «вид:id» → отпечаток текста
 * (см. voiceText.ts). Записи нет — нет и кнопки.
 */
const RECORDED = recorded as Record<Lang, Record<string, string>>;

function recordedClip(lang: Lang, kind: "tasks" | "lessons" | "dyk", key: string, id: string): string | undefined {
  return RECORDED[lang][key] ? `/audio/${lang === "uz" ? "uz/" : ""}${kind}/${id}.mp3` : undefined;
}

export const VOICE_CLIPS = {
  task: (id: string, lang: Lang) => recordedClip(lang, "tasks", `task:${id}`, id),
  lesson: (levelId: string, index: number, lang: Lang) =>
    recordedClip(lang, "lessons", `lesson:${levelId}-${index}`, `${levelId}-${index}`),
  /** «Знаешь ли ты?»: part — вопрос (q) или ответ (a). */
  dyk: (index: number, part: "q" | "a", lang: Lang) =>
    recordedClip(lang, "dyk", `dyk:${index}-${part}`, `${index}-${part}`),
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
  emit(null);
}

/** Проиграть запись. id — чтобы кнопка знала, что сейчас звучит именно она. */
export function playClip(src: string, id: string = src) {
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
  });
}

/** Короткая похвала или подбадривание после ответа — если звук включён и запись есть на языке интерфейса. */
export function cheer(kind: "praise" | "retry" | "mate") {
  if (!soundOn()) return;
  const lang: Lang = getState().settings.lang === "uz" ? "uz" : "ru";
  const list = VOICE_CLIPS[kind](lang);
  if (list.length) playClip(list[Math.floor(random() * list.length)], `cheer-${kind}`);
}
