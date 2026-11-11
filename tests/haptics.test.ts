/** Вибрация-отклик: короткие рисунки, вызов браузерной функции и тихая работа там, где её нет. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { HAPTIC_PATTERNS, haptic, type Haptic } from "@/lib/haptics";

afterEach(() => vi.unstubAllGlobals());

describe("вибрация-отклик", () => {
  it("рисунки короткие: не дольше четверти секунды и заканчиваются вибрацией, а не паузой", () => {
    for (const [kind, pattern] of Object.entries(HAPTIC_PATTERNS)) {
      expect(pattern.length % 2, kind).toBe(1);
      expect(
        pattern.reduce((a, b) => a + b, 0),
        kind,
      ).toBeLessThanOrEqual(250);
    }
    // Ошибка не «громче» успеха: импульсы ошибки (чётные места — вибрация, нечётные — пауза) не длиннее импульса успеха.
    const pulses = (p: number[]) => p.filter((_, i) => i % 2 === 0);
    expect(Math.max(...pulses(HAPTIC_PATTERNS.retry))).toBeLessThanOrEqual(
      Math.max(...pulses(HAPTIC_PATTERNS.success)),
    );
  });

  it("на сервере и в браузере без вибрации (iPhone) ничего не делает и не падает", () => {
    expect(() => haptic("success")).not.toThrow();
    const dispatchEvent = vi.fn();
    vi.stubGlobal("window", { dispatchEvent });
    vi.stubGlobal("navigator", {});
    expect(() => haptic("retry")).not.toThrow();
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
  });

  it("вызывает вибрацию с нужным рисунком; запрет браузера не ломает страницу", () => {
    const vibrate = vi.fn((pattern: number[]) => pattern.length > 0);
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });
    vi.stubGlobal("navigator", { vibrate });
    for (const kind of Object.keys(HAPTIC_PATTERNS) as Haptic[]) haptic(kind);
    expect(vibrate.mock.calls.map((c) => c[0])).toEqual(Object.values(HAPTIC_PATTERNS));
    vi.stubGlobal("navigator", {
      vibrate: () => {
        throw new Error("blocked");
      },
    });
    expect(() => haptic("finish")).not.toThrow();
  });
});
