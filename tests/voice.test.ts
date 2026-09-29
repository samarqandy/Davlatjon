/** Озвучка: только записи диктора, и все они на месте; голоса браузера нет. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { SECRETS } from "@/content/chess/secrets";
import { sanitize } from "@/lib/store";
import { LEGEND_LEVELS, SECRET_IDS, UZ_CLIPS, VOICE_CLIPS } from "@/lib/voice";

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
