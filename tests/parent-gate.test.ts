/** Замок раздела родителя: пауза после неверных PIN-кодов и сброс забытого PIN-кода только через сутки. */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  RESET_DELAY_MS,
  confirmPinReset,
  createPin,
  hasPin,
  pinResetAt,
  pinWaitMs,
  requestPinReset,
  unlockWithPin,
  waitAfterFails,
} from "@/lib/parentGate";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

beforeEach(() => {
  vi.stubGlobal("window", { localStorage: memoryStorage(), sessionStorage: memoryStorage() });
});
afterEach(() => vi.unstubAllGlobals());

const T0 = 1_000_000_000_000;

describe("замок раздела родителя", () => {
  it("верный PIN-код открывает, неверный — нет", async () => {
    await createPin("2468");
    expect(hasPin()).toBe(true);
    expect(await unlockWithPin("1111", T0)).toBe("wrong");
    expect(await unlockWithPin("2468", T0)).toBe("ok");
  });

  it("паузы: три неверных подряд — минута, шесть — пять минут; верный PIN-код обнуляет счёт", async () => {
    expect([1, 2, 3, 4, 5, 6, 9].map(waitAfterFails)).toEqual([0, 0, 60_000, 0, 0, 300_000, 300_000]);
    await createPin("2468");
    expect(await unlockWithPin("0000", T0)).toBe("wrong");
    expect(await unlockWithPin("0000", T0)).toBe("wrong");
    expect(await unlockWithPin("0000", T0)).toBe("wait");
    expect(pinWaitMs(T0)).toBe(60_000);
    // Пока идёт пауза, даже верный PIN-код не принимается.
    expect(await unlockWithPin("2468", T0 + 30_000)).toBe("wait");
    expect(pinWaitMs(T0 + 61_000)).toBe(0);
    expect(await unlockWithPin("2468", T0 + 61_000)).toBe("ok");
    // Счёт обнулился: снова три «свободные» попытки.
    expect(await unlockWithPin("0000", T0 + 62_000)).toBe("wrong");
  });

  it("сброс забытого PIN-кода: не раньше чем через сутки; повторный запрос срок не продлевает", async () => {
    await createPin("2468");
    expect(pinResetAt()).toBeNull();
    requestPinReset(T0);
    expect(pinResetAt()).toBe(T0 + RESET_DELAY_MS);
    requestPinReset(T0 + 3_600_000);
    expect(pinResetAt()).toBe(T0 + RESET_DELAY_MS);
    expect(confirmPinReset(T0 + RESET_DELAY_MS - 1)).toBe(false);
    expect(hasPin()).toBe(true);
    expect(confirmPinReset(T0 + RESET_DELAY_MS)).toBe(true);
    expect(hasPin()).toBe(false);
    expect(pinResetAt()).toBeNull();
  });

  it("верный PIN-код отменяет запрос на сброс", async () => {
    await createPin("2468");
    requestPinReset(T0);
    expect(await unlockWithPin("2468", T0 + 1000)).toBe("ok");
    expect(pinResetAt()).toBeNull();
    expect(confirmPinReset(T0 + RESET_DELAY_MS + 1)).toBe(false);
    expect(hasPin()).toBe(true);
  });
});
