"use client";

/**
 * Озвучка — только записи диктора ElevenLabs: по-русски — голос «Svetlana — Children's Storyteller»
 * (public/audio; рассказы «Тайн и легенд», добавленные позже, — «Anna Zub»), по-узбекски — голос «Uzbekcha» (public/audio/uz). Голос браузера не используется:
 * где записи нет, там нет и кнопки «Послушать». Звук выключается в настройках родителя.
 */
import recorded from "@/content/voice-clips.json";
import type { IllegalReason } from "./chess";
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
  "caissa",
  "franklin",
  "timur",
  "abdusattorov",
  "samarkand",
  "polgar",
  "menchik",
  "capablanca",
  "tal",
  "lasker",
  "deep-blue",
  "alphazero",
  "world-game",
  "soyuz9",
  "lewis",
  "charlemagne",
  "blindfold",
] as const;

/**
 * Короткие реплики по ситуации. Реплика зависит от того, что случилось, а не просто «верно/неверно»:
 * у задач по математике и логике — свои подбадривания (по смыслу совпадают с подсказкой на экране),
 * у шахмат — свои (шах, взятие, угроза — «Посмотри на доску» уместно только там), похвала — за усилие и
 * внимательность, а не «ты умный». Внутри ситуации запись выбирается случайно.
 */
export const CUES = {
  "praise-first": ["praise-first-1", "praise-first-2"],
  "praise-persist": ["praise-persist-1", "praise-persist-2"],
  "praise-hint": ["praise-hint"],
  "praise-chess": ["praise-2", "praise-3"],
  mate: ["mate"],
  "retry-idea": ["retry-idea"],
  "retry-small": ["retry-small"],
  "retry-reread": ["retry-reread"],
  "retry-steps": ["retry-steps"],
  "retry-part": ["retry-part"],
  "retry-close": ["retry-close"],
  "retry-hint": ["retry-hint"],
  "retry-adult": ["retry-adult"],
  "retry-generic": ["retry-1"],
  "retry-chess": ["retry-2", "chess-checks", "chess-attack"],
  "chess-king-check": ["chess-king-check"],
  "chess-pinned": ["chess-pinned"],
  "chess-king-attacked": ["chess-king-attacked"],
} as const satisfies Record<string, readonly string[]>;

export type Cue = keyof typeof CUES;

/** Реплики-подсказки: к чему они относятся — в самих названиях (вопрос в «быстрых примерах», шаги знакомства и т. д.). */
export const QUICK_PROMPT_CLIPS = [
  "quick-how-many",
  "quick-missing",
  "quick-compare",
  "quick-next",
  "quick-count",
  "quick-more",
  "quick-pattern",
  "quick-odd",
  "quick-bigger",
] as const;

export const SHORT_CLIPS = [...QUICK_PROMPT_CLIPS, "welcome-age", "welcome-name", "day-finish", "rest-stop"] as const;

/**
 * Какие записи есть по-узбекски: приветствие, похвала, легенды всех уровней и все тайны.
 * Пока записи нет, по-узбекски ничего не звучит — русский диктор в узбекском интерфейсе был бы некстати.
 */
export const UZ_CLIPS: ReadonlySet<string> = new Set<string>([
  "welcome",
  ...Object.values(CUES).flat(),
  ...SHORT_CLIPS,
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

function recordedClip(
  lang: Lang,
  kind: "tasks" | "lessons" | "dyk" | "exercises",
  key: string,
  id: string,
): string | undefined {
  return RECORDED[lang][key] ? `/audio/${lang === "uz" ? "uz/" : ""}${kind}/${id}.mp3` : undefined;
}

export const VOICE_CLIPS = {
  task: (id: string, lang: Lang) => recordedClip(lang, "tasks", `task:${id}`, id),
  lesson: (levelId: string, index: number, lang: Lang) =>
    recordedClip(lang, "lessons", `lesson:${levelId}-${index}`, `${levelId}-${index}`),
  /** «Знаешь ли ты?»: part — вопрос (q) или ответ (a). */
  dyk: (index: number, part: "q" | "a", lang: Lang) =>
    recordedClip(lang, "dyk", `dyk:${index}-${part}`, `${index}-${part}`),
  /** Условие шахматного упражнения: название и задание. */
  exercise: (id: string, lang: Lang) => recordedClip(lang, "exercises", `exercise:${id}`, id),
  welcome: (lang: Lang) => clip(lang, "welcome"),
  /** Все записи одной реплики на языке интерфейса. */
  cue: (kind: Cue, lang: Lang) => clips(lang, [...CUES[kind]]),
  /** Короткая запись по названию («quick-next», «day-finish»…). */
  short: (name: (typeof SHORT_CLIPS)[number], lang: Lang) => clip(lang, name),
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

/** Сказать реплику по ситуации — если звук включён и запись есть на языке интерфейса. */
export function cue(kind: Cue) {
  if (!soundOn()) return;
  const lang: Lang = getState().settings.lang === "uz" ? "uz" : "ru";
  const list = VOICE_CLIPS.cue(kind, lang);
  if (list.length) playClip(list[Math.floor(random() * list.length)], `cue-${kind}`);
}

const ILLEGAL_CUES: Record<IllegalReason, Cue> = {
  "in-check": "chess-king-check",
  pinned: "chess-pinned",
  "king-attacked": "chess-king-attacked",
};
let lastIllegalAt = 0;

/** Голосом объяснить, почему ход нельзя сделать (король под шахом, фигура связана, поле под ударом) — не чаще раза в шесть секунд. */
export function sayIllegal(reason: IllegalReason) {
  const now = Date.now();
  if (now - lastIllegalAt < 6000) return;
  lastIllegalAt = now;
  cue(ILLEGAL_CUES[reason]);
}
