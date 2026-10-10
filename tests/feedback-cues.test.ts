/** Голос после ответа зависит от ситуации: математика и шахматы не путаются, совет совпадает с надписью, похвала — за усилие. */
import { describe, expect, it } from "vitest";
import { isCloseMiss } from "@/lib/checks";
import { praiseCue, retryCue, retryTitle, retrySub } from "@/lib/feedback";
import { CUES, type Cue } from "@/lib/voice";
import type { Field } from "@/content/types";

const CHESS_ONLY: Cue[] = ["retry-chess", "praise-chess", "chess-king-check", "chess-pinned", "chess-king-attacked"];

describe("реплика после неверной проверки", () => {
  for (const lang of ["ru", "uz"] as const)
    it(`${lang}: по надписи на экране выбирается совпадающая реплика, шахматных среди них нет`, () => {
      const seen = new Set<Cue>();
      for (let n = 0; n < 12; n++) {
        for (const hintsLeft of [true, false]) {
          const cue = retryCue(retryTitle(n, lang), retrySub(n, hintsLeft, lang), lang, n + 1);
          expect(CHESS_ONLY).not.toContain(cue);
          seen.add(cue);
        }
      }
      // Все четыре стратегии, предложение подсказки и предложение позвать взрослого.
      for (const c of [
        "retry-idea",
        "retry-small",
        "retry-reread",
        "retry-steps",
        "retry-hint",
        "retry-adult",
      ] as Cue[])
        expect(seen.has(c), c).toBe(true);
    });

  it("стратегия по номеру попытки; на каждой третьей — предложение подсказки (или взрослого, если подсказок нет)", () => {
    const cue = (n: number, hintsLeft = true) =>
      retryCue(retryTitle(n, "ru"), retrySub(n, hintsLeft, "ru"), "ru", n + 1);
    expect(cue(0)).toBe("retry-idea");
    expect(cue(1)).toBe("retry-small");
    expect(cue(2)).toBe("retry-hint");
    expect(cue(2, false)).toBe("retry-adult");
    expect(cue(3)).toBe("retry-steps");
    expect(cue(4)).toBe("retry-idea");
    expect(cue(5)).toBe("retry-hint");
  });

  it("часть ответа верна — отдельная реплика; неизвестный текст — общая", () => {
    expect(retryCue("Часть ответа сходится ✓ — проверь остальное.", "что-то", "ru", 1)).toBe("retry-part");
    expect(retryCue("Javobning bir qismi toʻgʻri ✓ — qolganini tekshirib koʻr.", undefined, "uz", 1)).toBe(
      "retry-part",
    );
    expect(retryCue("Что-то другое", undefined, "ru", 1)).toBe("retry-generic");
  });
});

describe("похвала за усилие", () => {
  it("были ошибки — упорство; без ошибок и без подсказок — внимательность; с подсказкой — умение просить помощь", () => {
    expect(praiseCue(2, 0)).toBe("praise-persist");
    expect(praiseCue(1, 3)).toBe("praise-persist");
    expect(praiseCue(0, 0)).toBe("praise-first");
    expect(praiseCue(0, 2)).toBe("praise-hint");
  });

  it("у каждой реплики есть записи, а шахматные имена не попадают в математические", () => {
    for (const [name, clips] of Object.entries(CUES)) expect(clips.length, name).toBeGreaterThan(0);
    const mathClips = (Object.keys(CUES) as Cue[])
      .filter((k) => !CHESS_ONLY.includes(k) && k !== "mate")
      .flatMap((k) => CUES[k] as readonly string[]);
    for (const clip of CUES["retry-chess"]) expect(mathClips).not.toContain(clip);
  });
});

describe("«почти»", () => {
  const fields: Field[] = [{ type: "number", id: "a", label: "a", answer: 57 }];
  const check = (v: string) => isCloseMiss(fields, { a: v }, { a: Number(v) === 57 });
  it("число рядом с верным (на 1 или в пределах 10%) — почти; далёкое и не число — нет", () => {
    expect(check("58")).toBe(true);
    expect(check("56")).toBe(true);
    expect(check("60")).toBe(true);
    expect(check("75")).toBe(false);
    expect(check("abc")).toBe(false);
    expect(check("57")).toBe(false);
  });
  it("текстовые поля никогда не «почти»", () => {
    const f: Field[] = [{ type: "text", id: "t", label: "t", answer: "кот" }];
    expect(isCloseMiss(f, { t: "кит" }, { t: false })).toBe(false);
  });
});
