/** Озвучка: записи диктора на месте, текст для чтения вслух очищен от разметки. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { sanitize } from "@/lib/store";
import { LEGEND_LEVELS, VOICE_CLIPS, speakable } from "@/lib/voice";

const file = (src: string) => path.join(process.cwd(), "public", src);

describe("озвучка", () => {
  it("у каждого уровня есть запись легенды, у похвалы и приветствия — файлы", () => {
    expect([...LEGEND_LEVELS].sort()).toEqual(CHESS_LEVELS.map((l) => l.id).sort());
    const all = [
      VOICE_CLIPS.welcome,
      VOICE_CLIPS.mate,
      ...VOICE_CLIPS.praise,
      ...VOICE_CLIPS.retry,
      ...LEGEND_LEVELS.map((id) => VOICE_CLIPS.legend(id)),
    ];
    for (const src of all) {
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
  });

  it("звук по умолчанию включён, выключение сохраняется", () => {
    expect(sanitize({}).settings.sound).toBe(true);
    expect(sanitize({ settings: { sound: false } }).settings.sound).toBe(false);
  });
});
