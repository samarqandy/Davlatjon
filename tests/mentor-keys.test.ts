/** Доска тренера, клавиши и пульт для презентаций: сравнение по месту клавиши, а не по букве раскладки. */
import { describe, expect, it } from "vitest";
import { mentorKey, type KeyContext, type KeyInput, type KeyTarget } from "@/lib/mentor/keys";

const CTX: KeyContext = { present: false, promotionOpen: false, pending: false, curtain: false, sheetOpen: false };
const TARGETS: KeyTarget[] = ["text", "arrowsOwner", "button", "boardCursor", "other"];
const press = (code: string, over: Partial<KeyInput> = {}, ctx: Partial<KeyContext> = {}) =>
  mentorKey({ code, target: "other", ...over }, { ...CTX, ...ctx });

/** Все 32 сочетания флагов показа. */
const ALL_CTX: KeyContext[] = Array.from({ length: 32 }, (_, n) => ({
  present: !!(n & 1),
  promotionOpen: !!(n & 2),
  pending: !!(n & 4),
  curtain: !!(n & 8),
  sheetOpen: !!(n & 16),
}));

describe("пульт и листание", () => {
  it("PageDown — дальше, PageUp — назад, даже на доске с курсором и у ползунка", () => {
    for (const target of ["other", "button", "boardCursor", "arrowsOwner"] as const) {
      expect(press("PageDown", { target })).toBe("next");
      expect(press("PageUp", { target })).toBe("prev");
    }
  });

  it("стрелки ← → листают, но не в поле ввода, не у ползунка и не на доске с курсором", () => {
    expect(press("ArrowRight")).toBe("next");
    expect(press("ArrowLeft")).toBe("prev");
    expect(press("ArrowRight", { target: "button" })).toBe("next");
    for (const target of ["text", "arrowsOwner", "boardCursor"] as const) {
      expect(press("ArrowRight", { target })).toBeNull();
      expect(press("ArrowLeft", { target })).toBeNull();
    }
    // ↑ и ↓ — страница.
    expect(press("ArrowUp")).toBeNull();
    expect(press("ArrowDown")).toBeNull();
  });

  it("Home и End — только в показе и только когда стрелки свободны", () => {
    expect(press("Home")).toBeNull();
    expect(press("End")).toBeNull();
    expect(press("Home", {}, { present: true })).toBe("first");
    expect(press("End", {}, { present: true })).toBe("last");
    expect(press("Home", { target: "boardCursor" }, { present: true })).toBeNull();
    expect(press("End", { target: "arrowsOwner" }, { present: true })).toBeNull();
    expect(press("End", { target: "text" }, { present: true })).toBeNull();
  });

  it("шторка (B и точка) и показ (F) — и на русской раскладке", () => {
    expect(press("KeyB", { key: "b" })).toBe("curtain");
    expect(press("KeyB", { key: "и" })).toBe("curtain");
    expect(press("Period", { key: "ю" })).toBe("curtain");
    expect(press("KeyF", { key: "а" })).toBe("present");
    // Буква на месте другой клавиши не считается.
    expect(press("KeyX", { key: "b" })).toBeNull();
    expect(press("Comma", { key: "." })).toBeNull();
    // С Shift — это уже другие знаки.
    expect(press("KeyB", { shiftKey: true })).toBeNull();
    expect(press("Period", { shiftKey: true })).toBeNull();
    expect(press("KeyF", { shiftKey: true })).toBeNull();
  });

  it("F5 — во весь экран только в показе; иначе браузер обновит страницу", () => {
    expect(press("F5")).toBeNull();
    expect(press("F5", {}, { present: true })).toBe("fullscreen");
  });

  it("с Alt и с Ctrl листание не перехватывается (Alt+← — «назад» браузера, Ctrl+PageDown — вкладки)", () => {
    expect(press("ArrowLeft", { altKey: true })).toBeNull();
    expect(press("PageDown", { ctrlKey: true })).toBeNull();
    expect(press("PageUp", { metaKey: true })).toBeNull();
    expect(press("KeyB", { altKey: true })).toBeNull();
    expect(press("KeyF", { ctrlKey: true })).toBeNull();
  });
});

describe("отмена и повтор", () => {
  it("Ctrl+Z — отменить, Ctrl+Shift+Z и Ctrl+Y — повторить; на русской раскладке и с Cmd тоже", () => {
    expect(press("KeyZ", { key: "я", ctrlKey: true })).toBe("undo");
    expect(press("KeyZ", { key: "Я", ctrlKey: true, shiftKey: true })).toBe("redo");
    expect(press("KeyY", { key: "н", ctrlKey: true })).toBe("redo");
    expect(press("KeyZ", { metaKey: true })).toBe("undo");
    expect(press("KeyZ", { metaKey: true, shiftKey: true })).toBe("redo");
    expect(press("KeyY", { metaKey: true })).toBe("redo");
  });

  it("без модификатора, с Alt (AltGr) или Ctrl+Shift+Y — ничего", () => {
    expect(press("KeyZ")).toBeNull();
    expect(press("KeyY")).toBeNull();
    expect(press("KeyZ", { ctrlKey: true, altKey: true })).toBeNull();
    expect(press("KeyY", { ctrlKey: true, shiftKey: true })).toBeNull();
  });

  it("в поле ввода Ctrl+Z — отмена самого поля", () => {
    expect(press("KeyZ", { ctrlKey: true, target: "text" })).toBeNull();
    expect(press("KeyY", { metaKey: true, target: "text" })).toBeNull();
  });
});

describe("Escape, пробел и Enter", () => {
  it("пробел и Enter — никогда: ими нажимают кнопки", () => {
    for (const code of ["Space", "Enter", "NumpadEnter"]) {
      for (const target of TARGETS) {
        for (const ctx of ALL_CTX) {
          for (const mods of [{}, { ctrlKey: true }, { shiftKey: true }, { metaKey: true }, { altKey: true }]) {
            expect(mentorKey({ code, target, key: code === "Space" ? " " : "Enter", ...mods }, ctx)).toBeNull();
          }
        }
      }
    }
  });

  it("Escape: при выборе превращения — его окошку; иначе отмена выбора, шторка, панель — по порядку", () => {
    for (const target of TARGETS) {
      for (const ctx of ALL_CTX) {
        const want = ctx.promotionOpen
          ? null
          : ctx.pending
            ? "cancelPending"
            : ctx.curtain
              ? "closeCurtain"
              : ctx.sheetOpen
                ? "closeSheet"
                : null;
        expect(mentorKey({ code: "Escape", target }, ctx)).toBe(want);
      }
    }
  });

  it("в поле ввода буквы, стрелки и пульт печатают как обычно", () => {
    for (const code of ["KeyB", "KeyF", "Period", "ArrowLeft", "ArrowRight", "Home", "End", "F5", "KeyA"]) {
      for (const ctx of ALL_CTX) expect(mentorKey({ code, target: "text" }, ctx)).toBeNull();
    }
    // PageDown в поле ввода — тоже полю.
    expect(press("PageDown", { target: "text" }, { present: true })).toBeNull();
  });

  it("неизвестные клавиши — ничего", () => {
    for (const code of ["", "KeyA", "Digit1", "F1", "Tab", "Backspace", "Delete", "MediaPlayPause"]) {
      expect(press(code, {}, { present: true })).toBeNull();
    }
  });
});

describe("база партий в режиме класса закрывает доску", () => {
  it("пульт, стрелки, шторка и «отменить» не трогают доску, которой не видно; Escape закрывает базу", () => {
    const modal = { present: true, sheetOpen: true, sheetModal: true };
    const codes = ["PageDown", "PageUp", "ArrowRight", "ArrowLeft", "Home", "End", "Period", "KeyB", "KeyF", "F5"];
    for (const target of TARGETS) {
      for (const code of codes) expect(press(code, { target }, modal)).toBeNull();
      expect(press("KeyZ", { target, ctrlKey: true }, modal)).toBeNull();
      expect(press("Escape", { target }, modal)).toBe("closeSheet");
    }
  });

  it("без базы партий всё как раньше", () => {
    expect(press("PageDown", {}, { present: true, sheetOpen: true })).toBe("next");
    expect(press("PageDown", {}, { present: true, sheetOpen: true, sheetModal: false })).toBe("next");
  });
});
