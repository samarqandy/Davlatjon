"use client";

import { Chess } from "chess.js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, cn } from "@/components/ui";
import { illegalReason, isPromotionMove, legalTargets, pieceAt, playMove, type PieceType } from "@/lib/chess";
import { evaluatePosition, winChance, type PositionEval } from "@/lib/engine/analysis";
import { MATE } from "@/lib/engine/search";
import { useSan, useT, type T } from "@/lib/i18n";
import { useHash } from "@/lib/useHash";
import { ChessBoard, type PromotionPiece, type SquareMark } from "./ChessBoard";
import { illegalText, usePromotion } from "./useMoveInput";
import { sayIllegal } from "@/lib/voice";

const START = new Chess().fen();

interface Ply {
  san: string;
  uci: string;
  fen: string;
}

/** Позиция из адреса: «#fen=…» (из разбора партии или задачи). */
function fenFromHash(hash: string): string | null {
  const m = hash.match(/fen=([^&]+)/);
  if (!m) return null;
  const fen = decodeURIComponent(m[1]).replace(/_/g, " ");
  try {
    new Chess(fen);
    return fen;
  } catch {
    return null;
  }
}

/** Разобрать вставленный текст: FEN или партия в PGN. */
export function parseSetup(text: string): { start: string; plies: Ply[] } | null {
  const s = text.trim();
  if (!s) return null;
  try {
    const c = new Chess(s);
    return { start: c.fen(), plies: [] };
  } catch {
    // не FEN — пробуем PGN
  }
  try {
    const game = new Chess();
    game.loadPgn(s);
    const history = game.history({ verbose: true });
    const header = game.getHeaders();
    const start = header.FEN ?? START;
    const replay = new Chess(start);
    const plies = history.map((m) => {
      const played = replay.move({ from: m.from, to: m.to, promotion: m.promotion });
      return { san: played.san, uci: `${played.from}${played.to}${played.promotion ?? ""}`, fen: replay.fen() };
    });
    return { start, plies };
  } catch {
    return null;
  }
}

function evalText(e: PositionEval, t: T): string {
  const a = Math.abs(e.score);
  if (a > MATE - 1000) {
    const n = Math.ceil((MATE - a) / 2);
    return e.score > 0
      ? t(`Белые ставят мат в ${n}`, `Oqlar ${n} yurishda mot qiladi`)
      : t(`Чёрные ставят мат в ${n}`, `Qoralar ${n} yurishda mot qiladi`);
  }
  const p = (e.score / 100).toFixed(1);
  if (Math.abs(e.score) < 40) return t(`Примерно равно (${p})`, `Taxminan teng (${p})`);
  return e.score > 0
    ? t(`Лучше у белых: +${p}`, `Oqlarning ahvoli yaxshiroq: +${p}`)
    : t(`Лучше у чёрных: ${p}`, `Qoralarning ahvoli yaxshiroq: ${p}`);
}

/**
 * Доска анализа: ходи за обе стороны, возвращайся назад, пробуй другие ходы.
 * Робот-подсказчик оценивает позицию и показывает стрелкой лучший ход.
 */
export function AnalysisBoard() {
  const t = useT();
  const san = useSan();
  const hash = useHash();
  const fromHash = fenFromHash(hash);
  const [setup, setSetup] = useState<{ start: string; plies: Ply[] } | null>(null);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [engineOn, setEngineOn] = useState(true);
  const [evals, setEvals] = useState<Record<string, PositionEval>>({});
  const [pasteOpen, setPasteOpen] = useState(false);
  const [paste, setPaste] = useState("");
  const [pasteError, setPasteError] = useState(false);
  const [copied, setCopied] = useState(false);

  const start = setup?.start ?? fromHash ?? START;
  const plies = setup?.plies ?? [];
  const fen = cursor === 0 ? start : plies[cursor - 1].fen;
  const game = new Chess(fen);
  const turn = game.turn();
  const promo = usePromotion(fen);
  const [illegal, setIllegal] = useState<string | null>(null);
  const current = evals[fen];
  const isOver = game.isGameOver();

  // Оценка позиции — не сразу, а после паузы, чтобы доска успела обновиться.
  useEffect(() => {
    if (!engineOn || current || isOver) return;
    const id = setTimeout(() => {
      const e = evaluatePosition(fen, 450, 4);
      setEvals((all) => ({ ...all, [fen]: e }));
    }, 60);
    return () => clearTimeout(id);
  }, [engineOn, fen, current, isOver]);

  // Стрелки клавиатуры — назад и вперёд по ходам.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") setCursor((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCursor((c) => Math.min(plies.length, c + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [plies.length]);

  const tryMove = (from: string, to: string, promotion?: PromotionPiece): boolean => {
    if (!promotion && isPromotionMove(fen, from, to)) {
      promo.ask(to, turn, (piece) => tryMove(from, to, piece));
      return true;
    }
    const played = playMove(fen, from, to, promotion ?? "q");
    if (!played) {
      const reason = illegalReason(fen, from, to);
      setIllegal(reason ? illegalText(reason, t) : null);
      if (reason) sayIllegal(reason);
      return false;
    }
    setIllegal(null);
    setSelected(null);
    // Тот же ход, что дальше в партии, — просто идём вперёд; другой — новая ветка вместо старой.
    if (plies[cursor]?.uci === played.uci) {
      setCursor(cursor + 1);
      return true;
    }
    setSetup({ start, plies: [...plies.slice(0, cursor), { san: played.san, uci: played.uci, fen: played.fen }] });
    setCursor(cursor + 1);
    return true;
  };

  const tap = (sq: string): boolean | void => {
    const p = pieceAt(fen, sq);
    if (p && p.color === turn) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (!selected || tryMove(selected, sq)) return;
    setSelected(null);
    if (illegalReason(fen, selected, sq)) return false;
  };

  const load = (next: { start: string; plies: Ply[] }, at = 0) => {
    setSetup(next);
    setCursor(at);
    setSelected(null);
  };

  const applyPaste = () => {
    const parsed = parseSetup(paste);
    if (!parsed) {
      setPasteError(true);
      return;
    }
    setPasteError(false);
    setPasteOpen(false);
    setPaste("");
    load(parsed, parsed.plies.length);
  };

  const copyFen = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const marks: Record<string, SquareMark> = {};
  const last = plies[cursor - 1];
  if (last) {
    marks[last.uci.slice(0, 2)] = "last";
    marks[last.uci.slice(2, 4)] = "last";
  }
  if (game.inCheck()) {
    const king = game
      .board()
      .flat()
      .find((p) => p && p.type === "k" && p.color === turn);
    if (king) marks[king.square] = "check";
  }
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(fen, selected)) marks[sq] = pieceAt(fen, sq) ? "capture" : "target";
  }
  const arrows =
    engineOn && current?.best
      ? [{ from: current.best.slice(0, 2), to: current.best.slice(2, 4), color: "rgba(16, 185, 129, 0.8)" }]
      : [];
  const whiteChance = current ? winChance(current.score) : 50;
  const bestSan = current?.best
    ? (playMove(
        fen,
        current.best.slice(0, 2),
        current.best.slice(2, 4),
        (current.best[4] as PieceType | undefined) ?? "q",
      )?.san ?? null)
    : null;

  const over = game.isCheckmate()
    ? turn === "w"
      ? t("Мат! Победили чёрные.", "Mot! Qoralar yutdi.")
      : t("Мат! Победили белые.", "Mot! Oqlar yutdi.")
    : game.isStalemate()
      ? t("Пат — ничья.", "Pat — durang.")
      : game.isDraw()
        ? t("Ничья.", "Durang.")
        : null;

  return (
    <div className="space-y-5">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← {t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Анализ", "Tahlil")}</p>
        <h1 className="text-3xl font-black">{t("Доска анализа", "Tahlil taxtasi")}</h1>
        <p className="mt-1 max-w-2xl text-muted">
          {t(
            "Ходи за обе стороны, возвращайся назад и пробуй другие ходы. Робот-подсказчик оценит позицию и покажет стрелкой лучший ход.",
            "Ikkala tomon uchun ham yur, orqaga qayt va boshqa yurishlarni sinab koʻr. Yordamchi robot holatni baholaydi va eng yaxshi yurishni strelka bilan koʻrsatadi.",
          )}
        </p>
      </header>

      <div className="gap-5 lg:flex lg:items-start">
        <div className="flex gap-2 lg:w-[520px]">
          {engineOn && (
            <div
              className="relative w-4 shrink-0 overflow-hidden rounded-full bg-[#1f2937] ring-1 ring-line"
              role="img"
              aria-label={t(
                `Шансы белых: ${Math.round(whiteChance)}%`,
                `Oqlarning imkoniyati: ${Math.round(whiteChance)}%`,
              )}
            >
              <div
                className="absolute inset-x-0 bg-white transition-all duration-500"
                style={flipped ? { top: 0, height: `${whiteChance}%` } : { bottom: 0, height: `${whiteChance}%` }}
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <ChessBoard
              id="analysis"
              position={fen}
              marks={marks}
              arrows={arrows}
              onSquare={tap}
              onDrop={tryMove}
              draggable
              promotion={promo.request}
              orientation={flipped ? "black" : "white"}
              maxWidth={500}
              label={t("Доска анализа", "Tahlil taxtasi")}
            />
            {illegal && (
              <p
                role="status"
                data-illegal
                className="mt-2 rounded-2xl bg-rose/10 px-4 py-2 text-sm font-bold text-rose"
              >
                {illegal}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 min-w-0 flex-1 space-y-4 lg:mt-0">
          <div className="rounded-3xl bg-white p-4 shadow-card">
            <p className="text-sm font-extrabold text-muted">
              {over ?? (turn === "w" ? t("Ход белых", "Oqlar yuradi") : t("Ход чёрных", "Qoralar yuradi"))}
            </p>
            {engineOn && !over && (
              <p className="mt-1 text-lg font-black" aria-live="polite">
                {current ? evalText(current, t) : t("Робот думает…", "Robot oʻylayapti…")}
              </p>
            )}
            {engineOn && !over && bestSan && (
              <p className="text-sm text-muted">
                {t("Лучший ход по мнению робота:", "Robot fikricha eng yaxshi yurish:")}{" "}
                <b className="text-ink">{san(bestSan)}</b>
              </p>
            )}
            <label className="mt-3 flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={engineOn} onChange={(e) => setEngineOn(e.target.checked)} />
              {t("Робот-подсказчик", "Yordamchi robot")}
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCursor(0)}
              disabled={cursor === 0}
              aria-label={t("В начало", "Boshiga")}
            >
              ⏮
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCursor(Math.max(0, cursor - 1))}
              disabled={cursor === 0}
              aria-label={t("Назад", "Orqaga")}
            >
              ◀
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCursor(Math.min(plies.length, cursor + 1))}
              disabled={cursor >= plies.length}
              aria-label={t("Вперёд", "Oldinga")}
            >
              ▶
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCursor(plies.length)}
              disabled={cursor >= plies.length}
              aria-label={t("В конец", "Oxiriga")}
            >
              ⏭
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setFlipped((f) => !f)}>
              🔄 {t("Перевернуть", "Aylantirish")}
            </Button>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-card">
            <p className="mb-2 text-sm font-extrabold text-muted">{t("Ходы", "Yurishlar")}</p>
            {plies.length === 0 ? (
              <p className="text-sm text-muted">{t("Сделай первый ход на доске.", "Taxtada birinchi yurishni qil.")}</p>
            ) : (
              <ol className="flex flex-wrap gap-1 text-sm">
                {plies.map((p, i) => {
                  const white = new Chess(i === 0 ? start : plies[i - 1].fen).turn() === "w";
                  const n = Math.floor(i / 2) + 1;
                  return (
                    <li key={`${i}-${p.uci}`}>
                      <button
                        type="button"
                        onClick={() => setCursor(i + 1)}
                        className={cn(
                          "rounded-lg px-1.5 py-0.5 font-bold tabular-nums hover:bg-brand-soft",
                          cursor === i + 1 && "bg-brand text-white hover:bg-brand",
                        )}
                      >
                        {white || i === 0 ? `${n}.${white ? "" : ".."} ` : ""}
                        {san(p.san)}
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => load({ start: START, plies: [] })}>
              ♟ {t("Начальная позиция", "Boshlangʻich holat")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPasteOpen((o) => !o)} aria-expanded={pasteOpen}>
              📋 {t("Вставить FEN или PGN", "FEN yoki PGN qoʻyish")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void copyFen()}>
              {copied ? `✓ ${t("Скопировано", "Nusxalandi")}` : `📄 ${t("Скопировать FEN", "FEN nusxasini olish")}`}
            </Button>
          </div>
          {pasteOpen && (
            <div className="space-y-2 rounded-3xl bg-white p-4 shadow-card">
              <label htmlFor="analysis-paste" className="text-sm font-bold">
                {t("Позиция (FEN) или партия (PGN):", "Holat (FEN) yoki partiya (PGN):")}
              </label>
              <textarea
                id="analysis-paste"
                value={paste}
                onChange={(e) => {
                  setPaste(e.target.value);
                  setPasteError(false);
                }}
                rows={4}
                className="w-full rounded-xl border-2 border-line p-2 font-mono text-sm"
                placeholder="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
              />
              {pasteError && (
                <p role="alert" className="text-sm font-bold text-[#b42318]">
                  {t("Не получилось прочитать — проверь запись.", "Oʻqib boʻlmadi — yozuvni tekshirib koʻr.")}
                </p>
              )}
              <Button size="sm" onClick={applyPaste}>
                {t("Открыть на доске", "Taxtada ochish")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
