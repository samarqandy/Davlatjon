"use client";

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ellipsis,
  Eraser,
  EyeOff,
  LayoutGrid,
  LogOut,
  Maximize,
  Move,
  PenLine,
  Presentation,
  Redo2,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { CLASS_BOARD_THEME } from "@/lib/boardLook";
import { checkedKing, isPromotionMove, legalTargets, pieceAt, withTurn } from "@/lib/chess";
import { useSan, useT } from "@/lib/i18n";
import { keyTargetOf, mentorKey, type KeyAction } from "@/lib/mentor/keys";
import {
  START_FEN,
  apply,
  currentBoard,
  fensOf,
  persistable,
  shapesAt,
  startHistory,
  type Action,
  type History,
  type MentorLesson,
  type ShapeColor,
  type SignKind,
} from "@/lib/mentor/model";
import {
  DEFAULT_PREFS,
  browserStorage,
  openLesson,
  readPrefs,
  readSaved,
  writeLesson,
  writePrefs,
  type MentorMode,
  type MentorPrefs,
  type SaveResult,
} from "@/lib/mentor/store";
import { replaceHash, setHash, useHash } from "@/lib/useHash";
import { useFullscreen } from "@/lib/useFullscreen";
import { useWakeLock } from "@/lib/useWakeLock";
import { ChessBoard, PieceIcon, type PromotionPiece, type SquareMark } from "../ChessBoard";
import { TurnMark } from "../TurnMark";
import { usePromotion } from "../useMoveInput";
import { MentorDeck, MentorMoves, MentorSettings, PRESETS } from "./MentorPanels";
import { MentorOverlay } from "./MentorOverlay";
import { ColorGlyph, MentorButton, MentorRow, SignGlyph } from "./MentorTools";

/** Урок до загрузки из хранилища (и на сервере): одна доска с начальной позицией. */
const INITIAL: MentorLesson = {
  version: 1,
  id: "l0",
  title: "",
  createdAt: 0,
  updatedAt: 0,
  boards: [{ id: "b0", task: "", start: START_FEN, line: [], shapes: {}, orientation: "white" }],
};

/** Отметки клеток на большом экране: тёмная рамка с белой каймой видна и на светлой, и на тёмной клетке. */
const PRESENT_MARKS: Partial<Record<SquareMark, CSSProperties>> = {
  last: {
    backgroundColor: "rgba(250, 204, 21, 0.5)",
    boxShadow: "inset 0 0 0 max(3px, 0.45vmin) #1d2140, inset 0 0 0 max(6px, 0.9vmin) #fff",
  },
  selected: {
    backgroundColor: "rgba(251, 191, 36, 0.6)",
    boxShadow: "inset 0 0 0 max(4px, 0.6vmin) #1d2140, inset 0 0 0 max(8px, 1.2vmin) #fff",
  },
  target: { background: "radial-gradient(circle, #1d2140 17%, #fff 18%, #fff 24%, transparent 25%)" },
  capture: {
    background:
      "radial-gradient(circle, transparent 50%, #fff 51%, #fff 55%, #1d2140 56%, #1d2140 64%, transparent 65%)",
  },
};

const COLORS: { c: ShapeColor; ru: string; uz: string }[] = [
  { c: "G", ru: "Хорошо", uz: "Yaxshi" },
  { c: "R", ru: "Опасно", uz: "Xavfli" },
  { c: "B", ru: "Идея", uz: "Gʻoya" },
  { c: "Y", ru: "План", uz: "Reja" },
];
const SIGNS: { kind: SignKind; ru: string; uz: string }[] = [
  { kind: "tick", ru: "Верно", uz: "Toʻgʻri" },
  { kind: "cross", ru: "Ошибка", uz: "Xato" },
  { kind: "ask", ru: "Вопрос", uz: "Savol" },
];
const PALETTE = ["wK", "wQ", "wR", "wB", "wN", "wP", "bK", "bQ", "bR", "bB", "bN", "bP"];
const PIECE_NAMES: Record<string, [ru: string, uz: string]> = {
  wK: ["Белый король", "Oq shoh"],
  wQ: ["Белый ферзь", "Oq farzin"],
  wR: ["Белая ладья", "Oq rux"],
  wB: ["Белый слон", "Oq fil"],
  wN: ["Белый конь", "Oq ot"],
  wP: ["Белая пешка", "Oq piyoda"],
  bK: ["Чёрный король", "Qora shoh"],
  bQ: ["Чёрный ферзь", "Qora farzin"],
  bR: ["Чёрная ладья", "Qora rux"],
  bB: ["Чёрный слон", "Qora fil"],
  bN: ["Чёрный конь", "Qora ot"],
  bP: ["Чёрная пешка", "Qora piyoda"],
};

type Tool = "arrow" | SignKind;
type Sheet = null | "more" | "presets";

/**
 * Доска тренера: показать классу позицию и ход мысли. Три режима — ходить, рисовать (стрелки, кружки, знаки),
 * расставлять; урок из нескольких досок; режим класса для интерактивной панели и проектора (#present):
 * доска во всю высоту, крупные кнопки сбоку, пульт для презентаций листает ходы.
 */
export function MentorBoard() {
  const t = useT();
  const san = useSan();
  const hash = useHash();
  const present = hash === "#present";
  const rootRef = useRef<HTMLElement>(null);
  const fs = useFullscreen(rootRef);
  const wake = useWakeLock(present);

  const [hist, setHist] = useState<History>(() => startHistory(INITIAL));
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState<MentorPrefs>(DEFAULT_PREFS);
  const [tool, setTool] = useState<Tool>("arrow");
  const [palette, setPalette] = useState<string | null>(null);
  // Выбор клетки живёт только в той позиции, где его сделали.
  const [picked, setPicked] = useState<{ sq: string; key: string } | null>(null);
  const [pendingAt, setPendingAt] = useState<{ sq: string; key: string } | null>(null);
  const [curtain, setCurtain] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [saveState, setSaveState] = useState<SaveResult>("ok");
  const pushed = useRef(false);

  const doc = hist.doc;
  const board = currentBoard(doc);
  const fens = fensOf(board.start, board.line);
  const total = fens.length - 1;
  const ply = Math.min(doc.ply, total);
  const info = fens[ply];
  const fen = info.fen;
  const turn = fen.split(" ")[1] === "b" ? "b" : "w";
  const shapes = shapesAt(board, ply);
  const posKey = `${board.id}|${ply}|${fen}`;
  const selected = picked?.key === posKey ? picked.sq : null;
  const pending = pendingAt?.key === posKey ? pendingAt.sq : null;
  const mode = prefs.mode;
  const promo = usePromotion(fen);

  // Действие всегда применяется к последней истории (а не к той, что была при отрисовке): обработчик,
  // запомненный раньше (выбор фигуры превращения, перетаскивание), не откатит правки, сделанные после него.
  const histRef = useRef(hist);
  const commit = (next: History) => {
    histRef.current = next;
    setHist(next);
  };
  const run = (a: Action): boolean => {
    // Любая другая правка закрывает окошко превращения: выбор в нём относился к прежнему состоянию.
    if (a.t !== "play") promo.request?.onCancel();
    const cur = histRef.current;
    const r = apply(cur, a);
    if (r.history !== cur) commit(r.history);
    return !r.rejected && !r.refused;
  };

  const setPref = (patch: Partial<MentorPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    writePrefs(browserStorage(), next);
  };

  // Урок и настройки — из хранилища браузера, один раз после оживления страницы.
  const loaded = useRef<{ lesson: MentorLesson; board: number } | null>(null);
  useEffect(() => {
    const storage = browserStorage();
    const { lesson, board: at } = openLesson(readSaved(storage), t("Урок 1", "1-dars"));
    loaded.current = { lesson, board: at };
    /* eslint-disable react-hooks/set-state-in-effect -- данные браузера читаются только после оживления */
    commit(startHistory(lesson, at));
    setPrefs(readPrefs(storage));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- только при первом показе
  }, []);

  // Сохраняем через 400 мс после последней правки; если раньше уходят со страницы (закрыли вкладку, перешли
  // по ссылке) — сразу. Только то, что изменилось: открытая, но нетронутая вкладка не перепишет урок,
  // изменённый в другой вкладке.
  const lessonToSave = ready ? doc.lesson : null;
  const trialToSave = doc.trial;
  const boardToSave = doc.board;
  const pendingSave = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (!lessonToSave) return;
    const first = loaded.current;
    if (first && first.lesson === lessonToSave && first.board === boardToSave && !trialToSave) return;
    loaded.current = null;
    let pending = true;
    const save = () => {
      if (!pending) return;
      pending = false;
      pendingSave.current = null;
      const lesson = {
        ...persistable({ lesson: lessonToSave, board: boardToSave, ply: 0, trial: trialToSave }),
        updatedAt: Date.now(),
      };
      setSaveState(writeLesson(browserStorage(), lesson, boardToSave));
    };
    pendingSave.current = save;
    const id = setTimeout(save, 400);
    window.addEventListener("pagehide", save);
    return () => {
      clearTimeout(id);
      window.removeEventListener("pagehide", save);
    };
  }, [lessonToSave, trialToSave, boardToSave]);
  // Ушли со страницы внутри сайта раньше, чем сработало сохранение, — сохраняем сейчас.
  useEffect(() => () => pendingSave.current?.(), []);

  // Вышли из режима класса любым путём (кнопка «Выход», «Назад» браузера или пульта) — шторка и панель «Ещё»
  // закрываются, полный экран снимается.
  const [wasPresent, setWasPresent] = useState(present);
  if (wasPresent !== present) {
    setWasPresent(present);
    if (!present) {
      setCurtain(false);
      setSheet(null);
    }
  }
  const { exit: fsExit } = fs;
  useEffect(() => {
    if (present) return;
    pushed.current = false;
    fsExit();
  }, [present, fsExit]);

  // Фокус не должен теряться, когда кнопка, на которой он стоял, исчезает (вход в режим класса и выход из него,
  // закрытие панели «Ещё»): переводим его на кнопку, которая теперь на том же месте по смыслу.
  const focusLater = (selector: string) =>
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active && active !== document.body && rootRef.current?.contains(active)) return;
      rootRef.current?.querySelector<HTMLElement>(selector)?.focus();
    });
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetOpener = useRef<string | null>(null);
  const toggleSheet = (which: Exclude<Sheet, null>) => {
    if (sheet === which) return closeSheet();
    sheetOpener.current = which === "more" ? "[data-mentor-more]" : "[data-mentor-presets-button]";
    setSheet(which);
    // В режиме класса панель — диалог рядом с доской: фокус переходит в неё (иначе до неё — вся колонка кнопок).
    if (present) requestAnimationFrame(() => sheetRef.current?.focus());
  };
  const closeSheet = () => {
    setSheet(null);
    if (sheetOpener.current) focusLater(sheetOpener.current);
  };

  const enterPresent = () => {
    fs.enter();
    setSheet(null);
    setHash("#present", { keepScroll: true });
    pushed.current = true;
    focusLater("[data-mentor-exit]");
  };
  const exitPresent = () => {
    focusLater("[data-mentor-present-button]");
    fs.exit();
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else replaceHash("");
  };

  const doKey = (k: KeyAction) => {
    switch (k) {
      case "next":
      case "prev":
      case "first":
      case "last":
      case "undo":
      case "redo":
        run({ t: k });
        return;
      case "curtain":
        setCurtain((c) => !c);
        return;
      case "present":
        if (present) exitPresent();
        else enterPresent();
        return;
      case "fullscreen":
        fs.enter();
        return;
      case "cancelPending":
        setPendingAt(null);
        return;
      case "closeCurtain":
        setCurtain(false);
        return;
      case "closeSheet":
        closeSheet();
        return;
    }
  };
  const onKey = (e: KeyboardEvent) => {
    const k = mentorKey(
      {
        code: e.code,
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        target: keyTargetOf(e.target),
      },
      {
        present,
        promotionOpen: !!promo.request,
        pending: !!pending,
        curtain,
        sheetOpen: !!sheet,
      },
    );
    if (!k) return;
    e.preventDefault();
    // Доска в фокусе не должна сама двигать свой курсор на PageUp / PageDown / Home / End.
    e.stopPropagation();
    doKey(k);
  };
  const latestKey = useRef(onKey);
  useEffect(() => {
    latestKey.current = onKey;
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => latestKey.current(e);
    window.addEventListener("keydown", h, { capture: true });
    return () => window.removeEventListener("keydown", h, { capture: true });
  }, []);

  // ─── Нажатия на клетки ────────────────────────────────────────────────────

  const pick = (sq: string | null) => setPicked(sq ? { sq, key: posKey } : null);

  const tryMove = (from: string, to: string, promotion?: PromotionPiece): boolean => {
    pick(null);
    if (!promotion && isPromotionMove(fen, from, to)) {
      promo.ask(to, turn, (piece) => void latestTryMove.current(from, to, piece));
      return true;
    }
    return run({ t: "play", uci: `${from}${to}${promotion ?? ""}` });
  };
  const latestTryMove = useRef(tryMove);
  useEffect(() => {
    latestTryMove.current = tryMove;
  });

  // В самом начале (ходов ещё нет) первым может пойти любой цвет: тренер начинает показ с той стороны, с какой нужно.
  const canSwitchSide = ply === 0 && board.line.length === 0;

  const tapMove = (sq: string): boolean | void => {
    const p = pieceAt(fen, sq);
    if (p && p.color === turn) return pick(sq === selected ? null : sq);
    if (selected && legalTargets(fen, selected).includes(sq)) return tryMove(selected, sq);
    if (p && canSwitchSide) {
      run({ t: "setTurn", turn: p.color });
      setPicked({ sq, key: `${board.id}|0|${withTurn(fen, p.color)}` });
      return;
    }
    if (selected) {
      pick(null);
      return false;
    }
    if (p) return false;
  };

  const tapDraw = (sq: string): boolean | void => {
    if (tool !== "arrow") return run({ t: "sign", sq, kind: tool });
    if (!pending) return void setPendingAt({ sq, key: posKey });
    setPendingAt(null);
    if (pending === sq) return run({ t: "ring", sq, c: prefs.color });
    return run({ t: "arrow", from: pending, to: sq, c: prefs.color });
  };

  const tapSetup = (sq: string): boolean | void => {
    if (palette === "erase") return run({ t: "place", sq, piece: null });
    if (palette) return run({ t: "place", sq, piece: palette });
    if (selected) {
      pick(null);
      if (selected === sq) return;
      return run({ t: "freeMove", from: selected, to: sq });
    }
    if (pieceAt(fen, sq)) pick(sq);
  };

  // Под шторкой доска ничего не делает: ни нажатием, ни клавиатурой.
  const onSquare = curtain ? () => undefined : mode === "move" ? tapMove : mode === "draw" ? tapDraw : tapSetup;
  const onDrop = curtain
    ? undefined
    : mode === "move"
      ? (from: string, to: string) => tryMove(from, to)
      : mode === "setup"
        ? (from: string, to: string) => {
            pick(null);
            return run({ t: "freeMove", from, to });
          }
        : undefined;

  const setMode = (m: MentorMode) => {
    setPendingAt(null);
    pick(null);
    setPref({ mode: m });
  };

  // ─── Отметки ─────────────────────────────────────────────────────────────

  const marks: Record<string, SquareMark> = {};
  if (info.uci) {
    marks[info.uci.slice(0, 2)] = "last";
    marks[info.uci.slice(2, 4)] = "last";
  }
  const king = info.check ? checkedKing(fen) : null;
  if (king) marks[king] = "check";
  if (selected) {
    marks[selected] = "selected";
    if (mode === "move")
      for (const sq of legalTargets(fen, selected)) marks[sq] = pieceAt(fen, sq) ? "capture" : "target";
  }

  // ─── Подписи ─────────────────────────────────────────────────────────────

  const turnText = info.mate
    ? turn === "w"
      ? t("Мат! Победили чёрные", "Mot! Qoralar yutdi")
      : t("Мат! Победили белые", "Mot! Oqlar yutdi")
    : info.stalemate
      ? t("Пат — ничья", "Pat — durang")
      : turn === "w"
        ? t("Ходят белые", "Oqlar yuradi")
        : t("Ходят чёрные", "Qoralar yuradi");
  const prevFen = ply > 0 ? fens[ply - 1].fen : null;
  const lastMove =
    info.san && prevFen
      ? `${prevFen.split(" ")[5] ?? "1"}${prevFen.split(" ")[1] === "w" ? "." : "…"} ${san(info.san)}`
      : null;
  const modeName = { move: t("ходить", "yurish"), draw: t("рисовать", "chizish"), setup: t("расставлять", "joylash") }[
    mode
  ];
  const nArrows = shapes.arrows.length;
  const nRings = shapes.rings.length;
  const nSigns = Object.keys(shapes.signs).length;

  // ─── Кнопки ──────────────────────────────────────────────────────────────

  const P = present;
  const navFirst = (
    <MentorButton
      icon={ChevronsLeft}
      label={t("Начало", "Boshi")}
      name={t("Начало партии", "Boshi, partiya boshi")}
      onClick={() => run({ t: "first" })}
      disabled={ply === 0}
    />
  );
  const navLast = (
    <MentorButton
      icon={ChevronsRight}
      label={t("Конец", "Oxiri")}
      name={t("Конец партии", "Oxiri, partiya oxiri")}
      onClick={() => run({ t: "last" })}
      disabled={ply >= total}
    />
  );
  const atEnd = ply >= total && doc.board >= doc.lesson.boards.length - 1;
  const navPrev = (
    <MentorButton
      icon={ChevronLeft}
      label={t("Назад", "Orqaga")}
      hot
      data-mentor-prev
      onClick={() => run({ t: "prev" })}
      disabled={ply === 0 && doc.board === 0}
    />
  );
  const navNext = (
    <MentorButton
      icon={ChevronRight}
      label={t("Дальше", "Oldinga")}
      hot
      primary
      wide={P}
      data-mentor-next
      onClick={() => run({ t: "next" })}
      disabled={atEnd}
    />
  );
  const flip = (
    <MentorButton
      icon={ArrowUpDown}
      label={t("Поворот", "Aylantir")}
      name={t("Поворот доски", "Aylantir, taxtani aylantirish")}
      onClick={() => run({ t: "flip" })}
    />
  );
  const undo = (
    <MentorButton
      icon={Undo2}
      label={t("Отменить", "Qaytar")}
      hot
      data-mentor-undo
      onClick={() => run({ t: "undo" })}
      disabled={!hist.past.length}
    />
  );
  const redo = (
    <MentorButton
      icon={Redo2}
      label={t("Вернуть", "Takrorla")}
      hot
      data-mentor-redo
      onClick={() => run({ t: "redo" })}
      disabled={!hist.future.length}
    />
  );
  const curtainBtn = (
    <MentorButton
      icon={EyeOff}
      label={t("Шторка", "Parda")}
      name={t("Шторка: закрыть доску на время раздумья", "Parda: oʻylash vaqtida taxtani yopish")}
      hot
      pressed={curtain}
      data-mentor-curtain-button
      onClick={() => setCurtain((c) => !c)}
    />
  );
  const modeButtons = (
    [
      ["move", Move, t("Ходить", "Yurish")],
      ["draw", PenLine, t("Рисовать", "Chizish")],
      ["setup", LayoutGrid, t("Позиция", "Joylash")],
    ] as const
  ).map(([m, icon, label]) => (
    <MentorButton
      key={m}
      icon={icon}
      label={label}
      hot
      pressed={mode === m}
      data-mentor-mode-button={m}
      onClick={() => setMode(m)}
    />
  ));
  const colorButtons = COLORS.map((c) => (
    <MentorButton
      key={c.c}
      glyph={<ColorGlyph c={c.c} />}
      label={t(c.ru, c.uz)}
      pressed={tool === "arrow" && prefs.color === c.c}
      data-mentor-color={c.c}
      onClick={() => {
        setTool("arrow");
        setPref({ color: c.c });
      }}
    />
  ));
  const signButtons = SIGNS.map((s) => (
    <MentorButton
      key={s.kind}
      glyph={<SignGlyph kind={s.kind} />}
      label={t(s.ru, s.uz)}
      pressed={tool === s.kind}
      data-mentor-tool={s.kind}
      onClick={() => {
        setPendingAt(null);
        setTool(s.kind);
      }}
    />
  ));
  const clearBtn = (
    <MentorButton
      icon={Eraser}
      label={t("Стереть", "Tozala")}
      name={t("Стереть стрелки и знаки", "Tozala, strelka va belgilarni oʻchirish")}
      data-mentor-clear
      onClick={() => {
        setPendingAt(null);
        run({ t: "clearShapes" });
      }}
      disabled={!nArrows && !nRings && !nSigns}
    />
  );
  const pieceButtons = PALETTE.map((code) => {
    const [ru, uz] = PIECE_NAMES[code];
    return (
      <MentorButton
        key={code}
        glyph={<PieceIcon piece={code} className="h-full w-full" />}
        name={t(ru, uz)}
        pressed={palette === code}
        data-mentor-palette-piece={code}
        className="mentor-piece"
        onClick={() => {
          pick(null);
          setPalette(palette === code ? null : code);
        }}
      />
    );
  });
  const eraseBtn = (
    <MentorButton
      icon={Eraser}
      label={t("Ластик", "Oʻchir")}
      name={t("Ластик: убрать фигуру", "Oʻchir: donani olib tashlash")}
      pressed={palette === "erase"}
      data-mentor-palette-piece="erase"
      onClick={() => {
        pick(null);
        setPalette(palette === "erase" ? null : "erase");
      }}
    />
  );
  const turnBtn = (
    <MentorButton
      glyph={<TurnMark side={turn} className="text-[1.1rem]" />}
      label={turn === "w" ? t("Белые", "Oqlar") : t("Чёрные", "Qoralar")}
      name={
        turn === "w"
          ? t("Белые, сейчас ход белых: нажать — ход чёрных", "Oqlar, hozir oqlar yuradi: bosilsa — qoralar")
          : t("Чёрные, сейчас ход чёрных: нажать — ход белых", "Qoralar, hozir qoralar yuradi: bosilsa — oqlar")
      }
      data-mentor-turn-button={turn}
      onClick={() => run({ t: "setTurn", turn: turn === "w" ? "b" : "w" })}
    />
  );
  const emptyBtn = (
    <MentorButton
      icon={LayoutGrid}
      label={t("Пустая", "Boʻsh")}
      name={t("Пустая доска", "Boʻsh, boʻsh taxta")}
      data-mentor-empty
      onClick={() => {
        pick(null);
        run({ t: "setPosition", fen: "8/8/8/8/8/8/8/8 w - - 0 1" });
      }}
    />
  );
  const presetsBtn = (
    <MentorButton
      icon={Ellipsis}
      label={t("Готовые", "Tayyor")}
      name={t("Готовые позиции", "Tayyor pozitsiyalar")}
      pressed={sheet === "presets"}
      aria-expanded={sheet === "presets"}
      data-mentor-presets-button
      onClick={() => toggleSheet("presets")}
    />
  );
  const trialBtn = doc.trial && (
    <MentorButton
      icon={Undo2}
      label={t("К партии", "Partiya")}
      name={t("К партии: вернуться к показанной партии", "Partiya: koʻrsatilgan partiyaga qaytish")}
      hot
      data-mentor-return
      onClick={() => run({ t: "returnToLine" })}
    />
  );

  const loadPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    pick(null);
    run({ t: "setPosition", fen: p.fen, task: p.task ? t(p.task[0], p.task[1]) : undefined });
    closeSheet();
  };

  // В режиме класса кнопки режима — сетка в колонке: по три в ряд, а если колонка широкая (панель с плотным
  // экраном, где колонка стоит над доской сбоку), — по четыре, пять или шесть (globals.css, .mentor-grid-*).
  const paletteRows =
    mode === "move" ? (
      P ? (
        <div role="group" aria-label={t("Партия", "Partiya")} className="mentor-grid mentor-grid-4">
          {flip}
          {navFirst}
          {navLast}
          {trialBtn}
        </div>
      ) : null
    ) : mode === "draw" ? (
      P ? (
        <div role="group" aria-label={t("Рисование", "Chizish")} className="mentor-grid mentor-grid-4">
          {colorButtons}
          {signButtons}
          {clearBtn}
        </div>
      ) : (
        <>
          <MentorRow present={false} label={t("Цвет стрелки", "Strelka rangi")}>
            {colorButtons}
          </MentorRow>
          <MentorRow present={false} label={t("Знаки", "Belgilar")}>
            {signButtons}
            {clearBtn}
          </MentorRow>
        </>
      )
    ) : P ? (
      <>
        <div role="group" aria-label={t("Белые фигуры", "Oq donalar")} className="mentor-grid mentor-grid-6">
          {pieceButtons.slice(0, 6)}
        </div>
        <div role="group" aria-label={t("Чёрные фигуры", "Qora donalar")} className="mentor-grid mentor-grid-6">
          {pieceButtons.slice(6)}
        </div>
        <div role="group" aria-label={t("Расстановка", "Joylash")} className="mentor-grid mentor-grid-5">
          {eraseBtn}
          {turnBtn}
          {emptyBtn}
          {presetsBtn}
          {flip}
        </div>
      </>
    ) : (
      <>
        <MentorRow present={false} label={t("Белые фигуры", "Oq donalar")}>
          {pieceButtons.slice(0, 6)}
        </MentorRow>
        <MentorRow present={false} label={t("Чёрные фигуры", "Qora donalar")}>
          {pieceButtons.slice(6)}
        </MentorRow>
        <MentorRow present={false} label={t("Расстановка", "Joylash")}>
          {eraseBtn}
          {turnBtn}
          {emptyBtn}
          {presetsBtn}
          {flip}
        </MentorRow>
      </>
    );

  const hint =
    mode === "draw"
      ? tool === "arrow"
        ? pending
          ? t(
              "Теперь нажмите, куда идёт стрелка. Та же клетка — кружок.",
              "Endi strelka boradigan katakni bosing. Oʻsha katak — doira.",
            )
          : t(
              "Нажмите две клетки — стрелка. Одну клетку дважды — кружок.",
              "Ikki katakni bosing — strelka. Bitta katakni ikki marta — doira.",
            )
        : t("Нажмите на клетку — знак появится или исчезнет.", "Katakni bosing — belgi paydo boʻladi yoki yoʻqoladi.")
      : mode === "setup"
        ? palette
          ? palette === "erase"
            ? t("Нажимайте на фигуры, которые нужно убрать.", "Olib tashlanadigan donalarni bosing.")
            : t(
                "Нажимайте на клетки — фигура встанет. Ещё раз — уберётся.",
                "Kataklarni bosing — dona qoʻyiladi. Yana bosilsa — olinadi.",
              )
          : t(
              "Выберите фигуру в наборе или переставьте фигуру на доске: нажмите на неё, потом на клетку.",
              "Toʻplamdan dona tanlang yoki taxtadagi donani surib qoʻying: avval donani, keyin katakni bosing.",
            )
        : null;

  const settings = (
    <MentorSettings
      prefs={prefs}
      setPref={setPref}
      present={P}
      wake={wake}
      onPaste={(setup) => {
        pick(null);
        return run({ t: "setPosition", fen: setup.start, line: setup.line });
      }}
      onExit={P ? exitPresent : undefined}
    />
  );

  const presetsList = (
    <div className="space-y-2" data-mentor-presets>
      <p className="text-sm font-extrabold text-muted">{t("Готовые позиции", "Tayyor pozitsiyalar")}</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button key={p.id} variant="soft" size="sm" data-mentor-preset={p.id} onClick={() => loadPreset(p.id)}>
            {t(p.ru, p.uz)}
          </Button>
        ))}
      </div>
    </div>
  );

  const infoBlock = (
    <div data-mentor-part="info" className={cn(!P && "rounded-3xl bg-surface p-4 shadow-card")}>
      <div aria-live="polite">
        <p className="mentor-turn flex items-center gap-2 font-black" data-mentor-turn={turn}>
          {!info.mate && !info.stalemate && <TurnMark side={turn} />}
          <span>
            {turnText}
            {info.check && !info.mate ? ` · ${t("Шах!", "Shoh!")}` : ""}
          </span>
        </p>
        {(!P || mode !== "setup") && (
          <>
            {lastMove && (
              <p className="mentor-last font-black tabular-nums" data-mentor-last>
                {lastMove}
              </p>
            )}
          </>
        )}
      </div>
      {/* Задание — вне «живой» области: пока тренер его печатает, диктор не повторяет его на каждую букву. */}
      {(!P || mode !== "setup") && board.task && (
        <p className="mentor-task font-bold" data-mentor-task>
          {board.task}
        </p>
      )}
      <div aria-live="polite">
        {(!P || mode !== "setup") && (
          <>
            <p className="mentor-count font-bold text-muted tabular-nums">
              {doc.lesson.boards.length > 1 && (
                <span className="mr-3">
                  {t(
                    `Доска ${doc.board + 1} / ${doc.lesson.boards.length}`,
                    `Taxta ${doc.board + 1} / ${doc.lesson.boards.length}`,
                  )}
                </span>
              )}
              {total > 0 && <span>{t(`Ход ${ply} из ${total}`, `${total} tadan ${ply}-yurish`)}</span>}
            </p>
          </>
        )}
        <p className="sr-only">
          {t(
            `Стрелок: ${nArrows}, кружков: ${nRings}, знаков: ${nSigns}`,
            `Strelkalar: ${nArrows}, doiralar: ${nRings}, belgilar: ${nSigns}`,
          )}
        </p>
      </div>
      {doc.trial && !P && (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl bg-sun-soft p-2" data-mentor-trial-bar>
          <span className="px-1 text-sm font-bold">{t("Пробный вариант", "Sinov varianti")}</span>
          <Button size="sm" variant="primary" data-mentor-return onClick={() => run({ t: "returnToLine" })}>
            {t("Вернуться к партии", "Partiyaga qaytish")}
          </Button>
          <Button size="sm" variant="ghost" data-mentor-keep onClick={() => run({ t: "keepTrial" })}>
            {t("Оставить вариант", "Variantni qoldirish")}
          </Button>
        </div>
      )}
      {P && prefs.showMoves && <MentorMoves fens={fens} ply={ply} onGoto={(i) => run({ t: "goto", ply: i })} compact />}
    </div>
  );

  // Касание двумя пальцами или ладонью — не ход и не нажатие. Палец, коснувшийся вторым, и всё, что он делает
  // (движение, отпускание), до доски не доходят: иначе ладонь во время перетаскивания роняла фигуру.
  // Слушаем окно в фазе перехвата — раньше, чем библиотека перетаскивания (она слушает документ).
  const multi = useRef(false);
  useEffect(() => {
    const guard = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !e.isPrimary) e.stopImmediatePropagation();
    };
    const types = ["pointerdown", "pointermove", "pointerup", "pointercancel"] as const;
    for (const type of types) window.addEventListener(type, guard, { capture: true });
    return () => {
      for (const type of types) window.removeEventListener(type, guard, { capture: true });
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-mentor
      data-mentor-ready={ready ? "" : undefined}
      data-mentor-mode={mode}
      data-mentor-ply={ply}
      data-mentor-total={total}
      data-mentor-board={doc.board}
      data-mentor-boards={doc.lesson.boards.length}
      data-mentor-fen={fen}
      data-mentor-trial={doc.trial ? "" : undefined}
      data-mentor-arrows={nArrows}
      data-mentor-rings={nRings}
      data-mentor-signs={nSigns}
      data-mentor-curtain={curtain ? "" : undefined}
      data-mentor-saved={saveState}
      data-present={P ? "" : undefined}
      data-mentor-side={prefs.side}
      data-mentor-low={P && prefs.low ? "" : undefined}
      aria-labelledby="mentor-title"
      className={P ? "light-island" : "board-stage board-wide board-top space-y-5"}
      onContextMenu={
        P
          ? (e) => {
              // В поле ввода меню нужно: на панели без клавиатуры через него вставляют текст.
              if (!(e.target as HTMLElement).closest("input, textarea, select, [contenteditable='true']"))
                e.preventDefault();
            }
          : undefined
      }
      // Панель класса: касание двумя пальцами или ладонью — не ход и не нажатие.
      onTouchStartCapture={(e) => {
        // Новое касание одним пальцем — новый жест; второй палец делает жест «многопальцевым» до конца.
        multi.current = e.touches.length > 1;
      }}
      onTouchEndCapture={(e) => {
        if (!multi.current) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.touches.length === 0) multi.current = false;
      }}
      onTouchCancelCapture={(e) => {
        if (e.touches.length === 0) multi.current = false;
      }}
    >
      {!P && (
        <Link
          href="/chess"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
        >
          ← {t("Шахматная школа", "Shaxmat maktabi")}
        </Link>
      )}
      <header className={cn(P && "sr-only")}>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
          {t("Для учителя", "Oʻqituvchi uchun")}
        </p>
        <h1 id="mentor-title" className="text-3xl font-black">
          {t("Доска тренера", "Murabbiy taxtasi")}
        </h1>
        <p className="mt-1 max-w-2xl text-muted">
          {t(
            "Показывайте классу позицию и ход мысли: стрелки и знаки пальцем, расстановка за секунды, урок из нескольких досок. Для интерактивной панели и проектора — «На большой экран».",
            "Sinfga pozitsiya va fikr yoʻlini koʻrsating: barmoq bilan strelka va belgilar, bir zumda joylash, bir nechta taxtadan iborat dars. Interaktiv panel va proyektor uchun — «Katta ekranga».",
          )}
        </p>
        {!P && (
          <Button variant="sun" className="mt-3" data-mentor-present-button onClick={enterPresent}>
            <Icon icon={Presentation} /> {t("На большой экран", "Katta ekranga")}
          </Button>
        )}
      </header>

      <ChessBoard
        key={`${board.id}${P ? ":p" : ""}`}
        id="mentor"
        position={fen}
        marks={marks}
        onSquare={onSquare}
        onDrop={onDrop}
        draggable={mode !== "draw" && !curtain}
        canDrag={mode === "setup" ? () => true : undefined}
        onDropOff={mode === "setup" ? (from) => void run({ t: "place", sq: from, piece: null }) : undefined}
        promotion={promo.request}
        orientation={board.orientation}
        maxWidth={P ? 2400 : 560}
        notation={P ? prefs.coords : "auto"}
        animationMs={P && prefs.speed === "slow" ? 450 : 180}
        theme={P && prefs.look === "class" ? CLASS_BOARD_THEME : undefined}
        markStyles={P ? PRESENT_MARKS : undefined}
        fingerDrag={P}
        label={`${t("Доска тренера", "Murabbiy taxtasi")}, ${t("режим", "rejim")}: ${modeName}`}
        className="mentor-board"
        overlay={
          <MentorOverlay
            shapes={shapes}
            orientation={board.orientation}
            pending={pending ? { sq: pending, c: prefs.color } : null}
            present={P}
            curtain={curtain}
            onCloseCurtain={() => setCurtain(false)}
          />
        }
      />

      {infoBlock}

      {P ? (
        <div data-mentor-part="rail" className="mentor-rail">
          <MentorRow present label={t("Показ", "Koʻrsatish")} className="mentor-top">
            <MentorButton
              icon={LogOut}
              label={t("Выход", "Chiqish")}
              name={t("Выход из режима класса", "Chiqish, sinf rejimidan chiqish")}
              data-mentor-exit
              onClick={exitPresent}
            />
            {fs.supported && !fs.active ? (
              <MentorButton
                icon={Maximize}
                label={t("Экран", "Ekran")}
                name={t("Экран: во весь экран", "Ekran: toʻliq ekran")}
                data-mentor-fullscreen
                onClick={fs.enter}
              />
            ) : (
              <span aria-hidden />
            )}
            <MentorButton
              icon={Ellipsis}
              label={t("Ещё", "Yana")}
              name={t("Ещё: настройки показа", "Yana: koʻrsatish sozlamalari")}
              pressed={sheet === "more"}
              aria-expanded={sheet === "more"}
              data-mentor-more
              onClick={() => toggleSheet("more")}
            />
          </MentorRow>
          <div className="mentor-stack">
            {/* На невысоком экране набор кнопок режима листается, а режимы, правка и «Дальше» всегда на виду. */}
            {paletteRows && <div className="mentor-palette">{paletteRows}</div>}
            <MentorRow present label={t("Режим доски", "Taxta rejimi")}>
              {modeButtons}
            </MentorRow>
            <MentorRow present label={t("Правка", "Tahrir")}>
              {undo}
              {curtainBtn}
              {redo}
            </MentorRow>
            <MentorRow present label={t("Ходы", "Yurishlar")}>
              {navPrev}
              {navNext}
            </MentorRow>
          </div>
        </div>
      ) : (
        <div className="min-w-0 space-y-3" data-mentor-part="tools">
          <MentorRow present={false} label={t("Режим доски", "Taxta rejimi")}>
            {modeButtons}
          </MentorRow>
          {paletteRows}
          {hint && (
            <p className="text-sm font-bold text-muted" data-mentor-hint>
              {hint}
            </p>
          )}
          {sheet === "presets" && <div className="rounded-3xl bg-surface p-4 shadow-card">{presetsList}</div>}
          <MentorRow present={false} label={t("Просмотр ходов", "Yurishlarni koʻrish")}>
            {navFirst}
            {navPrev}
            {navNext}
            {navLast}
          </MentorRow>
          <MentorRow present={false} label={t("Правка", "Tahrir")}>
            {undo}
            {redo}
            {mode === "move" && flip}
            {curtainBtn}
          </MentorRow>
          {!doc.trial && ply < total && (
            <Button size="sm" variant="ghost" data-mentor-truncate onClick={() => run({ t: "truncate" })}>
              {t("Удалить ходы дальше", "Keyingi yurishlarni oʻchirish")}
            </Button>
          )}
          <MentorMoves fens={fens} ply={ply} onGoto={(i) => run({ t: "goto", ply: i })} />
          <MentorDeck
            lesson={doc.lesson}
            current={doc.board}
            fen={fen}
            run={run}
            onSelect={(i) => {
              pick(null);
              setPendingAt(null);
              run({ t: "selectBoard", i });
            }}
          />
          {saveState !== "ok" && (
            <p
              role="alert"
              className="rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning-ink"
              data-mentor-save-error
            >
              {saveState === "full"
                ? t(
                    "Место в браузере закончилось — урок не сохраняется. Удалите лишние доски.",
                    "Brauzerda joy qolmadi — dars saqlanmayapti. Ortiqcha taxtalarni oʻchiring.",
                  )
                : t(
                    "Браузер не даёт сохранить урок (например, в приватном окне) — после закрытия вкладки он пропадёт.",
                    "Brauzer darsni saqlashga ruxsat bermayapti (masalan, maxfiy oynada) — varaq yopilgach u yoʻqoladi.",
                  )}
            </p>
          )}
          <details className="rounded-3xl bg-surface p-4 shadow-card" data-mentor-settings>
            <summary className="min-h-11 cursor-pointer py-2 font-extrabold">
              {t("Настройки показа", "Koʻrsatish sozlamalari")}
            </summary>
            <div className="mt-2">{settings}</div>
          </details>
        </div>
      )}

      {P && sheet && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-label={
            sheet === "presets"
              ? t("Готовые позиции", "Tayyor pozitsiyalar")
              : t("Настройки показа", "Koʻrsatish sozlamalari")
          }
          tabIndex={-1}
          data-mentor-part="sheet"
          className="mentor-sheet rounded-3xl bg-surface p-4 shadow-lift outline-none"
          data-mentor-sheet={sheet}
        >
          {sheet === "presets" ? presetsList : settings}
        </div>
      )}
    </section>
  );
}
