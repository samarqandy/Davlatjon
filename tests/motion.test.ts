import { describe, expect, it } from "vitest";
import { motionAllowed } from "@/lib/motion";
import { MOODS, feedbackMood, riveCommand } from "@/lib/anim/mood";
import { CONFETTI_COLORS, CONFETTI_COUNT, CONFETTI_LIFETIME_MS, confettiPieces } from "@/lib/anim/confetti";

describe("motionAllowed", () => {
  it("показывает анимации по умолчанию", () => {
    expect(motionAllowed(false, undefined)).toBe(true);
    expect(motionAllowed(false, true)).toBe(true);
  });
  it("выключает их, если об этом просит система или родитель", () => {
    expect(motionAllowed(true, undefined)).toBe(false);
    expect(motionAllowed(true, true)).toBe(false);
    expect(motionAllowed(false, false)).toBe(false);
  });
});

describe("настроения птицы", () => {
  it("шесть настроений, idle — нулевое", () => {
    expect(MOODS).toEqual(["idle", "happy", "thinking", "correct", "incorrect", "celebration"]);
    expect(riveCommand("idle")).toEqual({ mood: 0, trigger: null });
  });
  it("циклические настроения идут числом, разовые — триггером без залипания", () => {
    expect(riveCommand("happy")).toEqual({ mood: 1, trigger: null });
    expect(riveCommand("thinking")).toEqual({ mood: 2, trigger: null });
    expect(riveCommand("celebration")).toEqual({ mood: 5, trigger: null });
    expect(riveCommand("correct")).toEqual({ mood: 0, trigger: "correct" });
    expect(riveCommand("incorrect")).toEqual({ mood: 0, trigger: "incorrect" });
  });
  it("ответ → настроение: «неверно» не превращается в грусть", () => {
    expect(feedbackMood("success")).toBe("correct");
    expect(feedbackMood("retry")).toBe("incorrect");
    expect(feedbackMood("info")).toBe("thinking");
    for (const t of ["success", "retry", "info"] as const) expect(feedbackMood(t)).not.toBe("celebration");
  });
});

describe("конфетти", () => {
  it("детерминировано: одно зерно — одни и те же кусочки", () => {
    expect(confettiPieces(20, 3)).toEqual(confettiPieces(20, 3));
    expect(confettiPieces(20, 3)).not.toEqual(confettiPieces(20, 4));
  });
  it("укладывается в экран и в срок жизни", () => {
    const pieces = confettiPieces();
    expect(pieces).toHaveLength(CONFETTI_COUNT);
    for (const p of pieces) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(Math.abs(p.drift)).toBeLessThanOrEqual(18);
      expect(p.delay + p.duration).toBeLessThan(CONFETTI_LIFETIME_MS);
      expect(CONFETTI_COLORS).toContain(p.color);
    }
  });
  it("использует несколько цветов", () => {
    expect(new Set(confettiPieces().map((p) => p.color)).size).toBeGreaterThan(3);
  });
});
