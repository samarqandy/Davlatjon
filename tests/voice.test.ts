/** Озвучка: только записи диктора, и все они на месте; голоса браузера нет. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { SECRETS } from "@/content/chess/secrets";
import { sanitize } from "@/lib/store";
import { LEGEND_LEVELS, SECRET_IDS, UZ_CLIPS, VOICE_CLIPS } from "@/lib/voice";
import recorded from "@/content/voice-clips.json";
import { chessContent } from "@/content/chess/content";
import { allDays } from "@/content/program";
import { localizeDay } from "@/content/uz";
import type { Lang } from "@/lib/lang";
import { lessonVoiceText, taskVoiceText, textHash } from "@/lib/voiceText";

const file = (src: string) => path.join(process.cwd(), "public", src);

describe("озвучка", () => {
  it("у приветствия, каждого уровня и каждой тайны есть запись, у похвалы — файлы", () => {
    expect([...LEGEND_LEVELS].sort()).toEqual(CHESS_LEVELS.map((l) => l.id).sort());
    expect([...SECRET_IDS].sort()).toEqual(SECRETS.map((s) => s.id).sort());
    const all = [
      VOICE_CLIPS.welcome("ru"),
      ...VOICE_CLIPS.mate("ru"),
      ...VOICE_CLIPS.praise("ru"),
      ...VOICE_CLIPS.retry("ru"),
      ...LEGEND_LEVELS.map((id) => VOICE_CLIPS.legend(id, "ru")),
      ...SECRET_IDS.map((id) => VOICE_CLIPS.secret(id, "ru")),
      ...[...UZ_CLIPS].map((name) => `/audio/uz/${name}.mp3`),
    ];
    expect(all.every(Boolean)).toBe(true);
    for (const src of all as string[]) {
      expect(fs.existsSync(file(src)), src).toBe(true);
      const head = fs.readFileSync(file(src)).subarray(0, 3).toString("latin1");
      expect(head === "ID3" || head.charCodeAt(0) === 0xff, src).toBe(true);
    }
  });

  it("по-узбекски звучат только готовые узбекские записи, русский диктор не подменяет их", () => {
    const uz = [
      VOICE_CLIPS.welcome("uz"),
      ...VOICE_CLIPS.praise("uz"),
      ...VOICE_CLIPS.retry("uz"),
      ...VOICE_CLIPS.mate("uz"),
      ...LEGEND_LEVELS.map((id) => VOICE_CLIPS.legend(id, "uz")),
      ...SECRET_IDS.map((id) => VOICE_CLIPS.secret(id, "uz")),
    ].filter(Boolean);
    expect(uz.length).toBe(UZ_CLIPS.size);
    for (const src of uz) expect(src).toMatch(/^\/audio\/uz\//);
  });

  it("голос браузера не используется: только записи ElevenLabs", () => {
    const files = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? files(p) : /\.(ts|tsx)$/.test(e.name) ? [p] : [];
      });
    const found = files(path.join(process.cwd(), "src")).filter((f) =>
      /speechSynthesis|SpeechSynthesisUtterance/.test(fs.readFileSync(f, "utf8")),
    );
    expect(found).toEqual([]);
  });

  it("звук по умолчанию включён, выключение сохраняется", () => {
    expect(sanitize({}).settings.sound).toBe(true);
    expect(sanitize({ settings: { sound: false } }).settings.sound).toBe(false);
  });
});

/** Всё, что можно озвучить кнопкой «Послушать»: «вид:id» → нынешний текст. */
function voiceTexts(lang: Lang): Record<string, string> {
  const out: Record<string, string> = {};
  for (const d of allDays())
    for (const t of (lang === "uz" ? localizeDay(d, "uz") : d).tasks) out[`task:${t.id}`] = taskVoiceText(t.body);
  const c = chessContent(lang);
  for (const l of c.levels) l.lesson.forEach((card, i) => (out[`lesson:${l.id}-${i}`] = lessonVoiceText(card)));
  c.didYouKnow.forEach((x, i) => {
    out[`dyk:${i}-q`] = x.q;
    out[`dyk:${i}-a`] = x.a;
  });
  return out;
}

const DIRS: Record<string, string> = { task: "tasks", lesson: "lessons", dyk: "dyk" };
const clipFile = (lang: Lang, key: string) => {
  const [kind, id] = key.split(":");
  return file(`/audio/${lang === "uz" ? "uz/" : ""}${DIRS[kind]}/${id}.mp3`);
};

describe("записи условий задач, уроков и «Знаешь ли ты?»", () => {
  // WRITE_VOICE_MANIFEST=1 npx vitest run tests/voice.test.ts — после записи новых файлов: оглавление по тому, что лежит в public/audio.
  it.runIf(!!process.env.WRITE_VOICE_MANIFEST)("оглавление записей переписано", () => {
    const manifest: Record<string, Record<string, string>> = {};
    for (const lang of ["ru", "uz"] as const) {
      manifest[lang] = {};
      for (const [key, text] of Object.entries(voiceTexts(lang)))
        if (fs.existsSync(clipFile(lang, key))) manifest[lang][key] = textHash(text);
    }
    fs.writeFileSync(
      path.join(process.cwd(), "src/content/voice-clips.json"),
      JSON.stringify(manifest, null, 2) + "\n",
    );
  });

  it("каждая запись на месте, это MP3, и записана с нынешнего текста", () => {
    const problems: string[] = [];
    for (const lang of ["ru", "uz"] as const) {
      const texts = voiceTexts(lang);
      for (const [key, hash] of Object.entries((recorded as Record<Lang, Record<string, string>>)[lang])) {
        const f = clipFile(lang, key);
        if (!fs.existsSync(f)) problems.push(`${lang} ${key}: нет файла`);
        else if (!/^(ID3|\xff)/.test(fs.readFileSync(f).subarray(0, 3).toString("latin1")))
          problems.push(`${lang} ${key}: не MP3`);
        if (texts[key] === undefined) problems.push(`${lang} ${key}: такого текста больше нет`);
        else if (textHash(texts[key]) !== hash) problems.push(`${lang} ${key}: текст изменился — перезапишите`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("кнопка ведёт к записи, только если она есть", () => {
    const ru = recorded as Record<Lang, Record<string, string>>;
    const someTask = Object.keys(ru.ru).find((k) => k.startsWith("task:"));
    if (someTask) expect(VOICE_CLIPS.task(someTask.slice(5), "ru")).toBe(`/audio/tasks/${someTask.slice(5)}.mp3`);
    expect(VOICE_CLIPS.task("нет-такой", "ru")).toBeUndefined();
    expect(VOICE_CLIPS.dyk(9999, "q", "uz")).toBeUndefined();
  });
});
