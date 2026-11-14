/**
 * Клавиши доски тренера — и пульт для презентаций. Пульт (Logitech, Targus и др.) шлёт PageDown / PageUp,
 * «затемнить экран» — точку или B, «показ» — F5. Сравниваем по e.code (месту клавиши), а не по букве: на русской
 * раскладке точка — это «ю», B — «и», F — «а», Z — «я».
 *
 * Пробел и Enter не трогаем никогда: ими нажимают кнопки с клавиатуры. Стрелки ↑ и ↓ — тоже: ими листают страницу.
 */
export type KeyTarget =
  /** Поле ввода: всё печатается как обычно. */
  | "text"
  /** Элемент, которому стрелки нужны самому (ползунок, выпадающий список). */
  | "arrowsOwner"
  | "button"
  /** Доска, и по ней ходит рамка-курсор клавиатуры. */
  | "boardCursor"
  | "other";

export type KeyAction =
  | "next"
  | "prev"
  | "first"
  | "last"
  | "curtain"
  | "present"
  | "fullscreen"
  | "undo"
  | "redo"
  | "cancelPending"
  | "closeCurtain"
  | "closeSheet";

export interface KeyInput {
  code: string;
  key?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  target: KeyTarget;
}

export interface KeyContext {
  present: boolean;
  promotionOpen: boolean;
  pending: boolean;
  curtain: boolean;
  sheetOpen: boolean;
}

export function mentorKey(e: KeyInput, ctx: KeyContext): KeyAction | null {
  const mod = !!(e.ctrlKey || e.metaKey);
  if (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter") return null;
  if (e.code === "Escape") {
    // Окошко превращения пешки закрывается своей клавишей Escape.
    if (ctx.promotionOpen) return null;
    if (ctx.pending) return "cancelPending";
    if (ctx.curtain) return "closeCurtain";
    if (ctx.sheetOpen) return "closeSheet";
    return null;
  }
  if (e.target === "text") return null;
  if (mod && !e.altKey) {
    if (e.code === "KeyZ") return e.shiftKey ? "redo" : "undo";
    if (e.code === "KeyY" && !e.shiftKey) return "redo";
    return null;
  }
  if (e.altKey || mod) return null;
  const arrowsFree = e.target !== "arrowsOwner" && e.target !== "boardCursor";
  switch (e.code) {
    case "PageDown":
      return "next";
    case "PageUp":
      return "prev";
    case "ArrowRight":
      return arrowsFree ? "next" : null;
    case "ArrowLeft":
      return arrowsFree ? "prev" : null;
    case "Home":
      return ctx.present && arrowsFree ? "first" : null;
    case "End":
      return ctx.present && arrowsFree ? "last" : null;
    case "Period":
    case "KeyB":
      return e.shiftKey ? null : "curtain";
    case "KeyF":
      return e.shiftKey ? null : "present";
    case "F5":
      return ctx.present ? "fullscreen" : null;
    default:
      return null;
  }
}

/** Что за элемент в фокусе — для mentorKey. */
export function keyTargetOf(el: EventTarget | null): KeyTarget {
  if (!(el instanceof HTMLElement)) return "other";
  if (el.isContentEditable) return "text";
  if (el instanceof HTMLTextAreaElement) return "text";
  if (el instanceof HTMLSelectElement) return "arrowsOwner";
  if (el instanceof HTMLInputElement) {
    if (["checkbox", "radio", "button", "submit", "reset"].includes(el.type))
      return el.type === "radio" ? "arrowsOwner" : "button";
    if (el.type === "range") return "arrowsOwner";
    return "text";
  }
  const role = el.getAttribute("role");
  if (role === "radio" || role === "slider" || role === "tab" || role === "listbox") return "arrowsOwner";
  if (el.closest("[data-board]")?.hasAttribute("data-cursor")) return "boardCursor";
  if (el instanceof HTMLButtonElement || role === "button") return "button";
  return "other";
}
