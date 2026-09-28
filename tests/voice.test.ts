/** Озвучка: записи диктора на месте, текст для чтения вслух очищен от разметки. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { SECRETS } from "@/content/chess/secrets";
import { sanitize } from "@/lib/store";
import { LEGEND_LEVELS, SECRET_IDS, UZ_CLIPS, VOICE_CLIPS, speakable } from "@/lib/voice";

const file = (src: string) => path.join(process.cwd(), "public", src);

describe("озвучка", () => {
  it("у каждого уровня и каждой тайны есть запись, у похвалы и приветствия — файлы", () => {
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

  it("текст для чтения: без разметки, рокировка словами", () => {
    expect(speakable("**Шах** и `мат`")).toBe("Шах и мат");
    expect(speakable("Белые сделали 0-0, а чёрные 0-0-0.")).toBe(
      "Белые сделали короткая рокировка, а чёрные длинная рокировка.",
    );
    expect(speakable("Крg8")).toBe("король g8");
    expect(speakable("♘f3 и 0-0", "ru")).toBe("конь f3 и короткая рокировка");
    expect(speakable("♕xf7# — mot!", "uz")).toBe("farzin xf7# — mot!");
    expect(speakable("0-0-0", "uz")).toBe("uzun rokirovka");
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

  it("звук по умолчанию включён, выключение сохраняется", () => {
    expect(sanitize({}).settings.sound).toBe(true);
    expect(sanitize({ settings: { sound: false } }).settings.sound).toBe(false);
  });
});
