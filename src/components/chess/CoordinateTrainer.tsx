"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, cn } from "@/components/ui";
import { legalTargets, pieceAt } from "@/lib/chess";
import {
  DRILL_SECONDS,
  randomSquare,
  readTask,
  readTaskSolved,
  squareColor,
  squareOptions,
  type DrillMode,
  type ReadTask,
} from "@/lib/drills";
import { useSan, useT, type T } from "@/lib/i18n";
import { random } from "@/lib/random";
import { chessDrillRecord, useHydrated, useStore } from "@/lib/store";
import { ChessBoard, type SquareMark } from "./ChessBoard";

const EMPTY = "8/8/8/8/8/8/8/8 w - - 0 1";

function modes(t: T): { id: DrillMode; emoji: string; title: string; about: string }[] {
  return [
    {
      id: "find",
      emoji: "🎯",
      title: t("Найди клетку", "Katakni top"),
      about: t("Показано имя клетки — нажми на неё на доске.", "Katakning nomi yozilgan — uni taxtadan topib bos."),
    },
    {
      id: "name",
      emoji: "🔤",
      title: t("Назови клетку", "Katakni nomla"),
      about: t("Клетка подсвечена — выбери её имя.", "Katak belgilangan — uning nomini tanla."),
    },
    {
      id: "color",
      emoji: "⚫⚪",
      title: t("Какого цвета?", "Qaysi rangda?"),
      about: t(
        "Без доски: светлая клетка или тёмная? Шаг к игре вслепую.",
        "Taxtasiz: katak oqmi yoki qorami? Taxtaga qaramay oʻynashga bir qadam.",
      ),
    },
    {
      id: "read",
      emoji: "📜",
      title: t("Прочитай ход", "Yurishni oʻqi"),
      about: t(
        "Запись вроде «Кf3» или «Сxc6» — сделай этот ход на доске.",
        "«♘f3» yoki «♗xc6» kabi yozuv — shu yurishni taxtada qil.",
      ),
    },
  ];
}

export function CoordinateTrainer() {
  const t = useT();
  const [mode, setMode] = useState<DrillMode | null>(null);
  const records = useStore((s) => s.chessDrills);
  const hydrated = useHydrated();
  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Тренажёр", "Trenajyor")}</p>
        <h1 className="text-3xl font-black">{t("Координаты и запись ходов", "Koordinatalar va yurishlar yozuvi")}</h1>
        <p className="mt-1 max-w-2xl text-muted">
          {t(
            "Сильные шахматисты видят доску с закрытыми глазами и читают партии из книг. Тренируйся по полминуты — и имена клеток и русская запись ходов станут родными.",
            "Kuchli shaxmatchilar taxtani koʻz yumib ham koʻra oladi va partiyalarni kitobdan oʻqiydi. Yarim daqiqadan mashq qilib tur — kataklarning nomlari va yurishlar yozuvi senga qadrdon boʻlib qoladi.",
          )}
        </p>
      </header>
      {mode ? (
        <Drill key={mode} mode={mode} onExit={() => setMode(null)} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {modes(t).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className="flex flex-col rounded-3xl bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5"
            >
              <span className="text-3xl" aria-hidden>
                {m.emoji}
              </span>
              <span className="mt-1 text-xl font-black">{m.title}</span>
              <span className="mt-1 flex-1 text-sm text-muted">{m.about}</span>
              <span className="mt-3 text-xs font-extrabold text-brand-dark">
                {t(`${DRILL_SECONDS[m.id]} секунд`, `${DRILL_SECONDS[m.id]} soniya`)}
                {hydrated && records[m.id] ? t(` · рекорд ${records[m.id]}`, ` · rekord: ${records[m.id]}`) : ""}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Round {
  target: string;
  options: string[];
  task: ReadTask | null;
}

function newRound(mode: DrillMode, prev?: string): Round {
  if (mode === "read") return { target: "", options: [], task: readTask(random) };
  const target = randomSquare(random, prev);
  return { target, options: mode === "name" ? squareOptions(target, random) : [], task: null };
}

function Drill({ mode, onExit }: { mode: DrillMode; onExit: () => void }) {
  const t = useT();
  const san = useSan();
  const meta = modes(t).find((m) => m.id === mode)!;
  const record = useStore((s) => s.chessDrills[mode] ?? 0);
  const [round, setRound] = useState<Round>(() => newRound(mode));
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [flash, setFlash] = useState<{ sq: string; ok: boolean } | null>(null);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [labels, setLabels] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const running = endsAt !== null && now < endsAt;
  const over = endsAt !== null && now >= endsAt;
  const left = endsAt === null ? DRILL_SECONDS[mode] : Math.max(0, Math.ceil((endsAt - now) / 1000));

  useEffect(() => {
    if (endsAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (over) chessDrillRecord(mode, score);
  }, [over, mode, score]);

  const start = () => {
    const at = Date.now();
    setNow(at);
    setEndsAt(at + DRILL_SECONDS[mode] * 1000);
    setScore(0);
    setWrong(0);
    setFlash(null);
    setSelected(null);
    setRound(newRound(mode));
  };

  const answer = (ok: boolean, sq?: string) => {
    if (!running) return;
    if (ok) {
      setScore((s) => s + 1);
      setRound((r) => newRound(mode, r.target));
      setSelected(null);
    } else setWrong((w) => w + 1);
    setFlash(sq ? { sq, ok } : null);
  };

  const tapFind = (sq: string) => answer(sq === round.target, sq);

  const tapRead = (sq: string) => {
    const task = round.task;
    if (!task || !running) return;
    const piece = pieceAt(task.fen, sq);
    const side = task.fen.split(" ")[1];
    if (piece && piece.color === side) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) answer(readTaskSolved(task, selected, sq), sq);
  };

  const marks: Record<string, SquareMark> = {};
  if (mode === "name") marks[round.target] = "selected";
  if (flash) marks[flash.sq] = flash.ok ? "good" : "bad";
  if (mode === "read" && selected && round.task) {
    marks[selected] = "selected";
    for (const sq of legalTargets(round.task.fen, selected)) marks[sq] = "target";
  }

  const prompt =
    mode === "find"
      ? round.target
      : mode === "color"
        ? round.target
        : mode === "read"
          ? round.task
            ? san(round.task.san)
            : ""
          : "?";

  return (
    <section className="space-y-4" aria-label={meta.title}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-black">
          {meta.emoji} {meta.title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onExit}>
          {t("← Другой режим", "← Boshqa rejim")}
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          {(mode === "find" || mode === "read" || mode === "name") && (
            <ChessBoard
              id={`drill-${mode}`}
              position={mode === "read" ? (round.task?.fen ?? EMPTY) : EMPTY}
              marks={marks}
              orientation={mode === "read" ? (round.task?.fen.split(" ")[1] === "b" ? "black" : "white") : orientation}
              notation={mode === "read" || mode === "name" ? true : labels}
              onSquare={mode === "find" ? tapFind : mode === "read" ? tapRead : undefined}
              draggable={mode === "read" && running}
              onDrop={
                mode === "read"
                  ? (from, to) => {
                      if (!round.task || !running) return false;
                      answer(readTaskSolved(round.task, from, to), to);
                      return false;
                    }
                  : undefined
              }
              rejectFeedback={false}
              maxWidth={480}
            />
          )}
          {mode === "color" && (
            <div className="rounded-3xl bg-white p-8 text-center shadow-card">
              <p className="text-sm font-extrabold text-muted">{t("Какого цвета клетка?", "Katak qaysi rangda?")}</p>
              <p className="mt-2 text-7xl font-black" aria-live="polite">
                {running ? round.target : "?"}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  disabled={!running}
                  onClick={() => answer(squareColor(round.target) === "light")}
                  className="h-20 w-32 rounded-2xl border-4 border-[#b58863] bg-[#f0d9b5] text-lg font-black text-[#7a4b00] disabled:opacity-50"
                >
                  {t("светлая", "oq")}
                </button>
                <button
                  type="button"
                  disabled={!running}
                  onClick={() => answer(squareColor(round.target) === "dark")}
                  className="h-20 w-32 rounded-2xl border-4 border-[#7c5a33] bg-[#b58863] text-lg font-black text-white disabled:opacity-50"
                >
                  {t("тёмная", "qora")}
                </button>
              </div>
            </div>
          )}
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-card">
            <p className="text-sm font-extrabold text-muted">
              {running ? t("Время", "Vaqt") : over ? t("Время вышло!", "Vaqt tugadi!") : t("Готов?", "Tayyormisan?")}
            </p>
            <p className={cn("text-5xl font-black tabular-nums", running && left <= 5 && "text-rose")}>{left}</p>
            {(mode === "find" || mode === "read") && running && (
              <p className="mt-3 text-sm font-extrabold text-muted">
                {mode === "find" ? t("Найди клетку", "Katakni top") : t("Сделай ход", "Yurishni qil")}
              </p>
            )}
            {(mode === "find" || mode === "read") && running && (
              <p className="text-5xl font-black text-brand-dark" aria-live="polite">
                {prompt}
              </p>
            )}
            {mode === "name" && running && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {round.options.map((o) => (
                  <Button key={o} variant="soft" size="lg" onClick={() => answer(o === round.target)}>
                    {o}
                  </Button>
                ))}
              </div>
            )}
            <p className="mt-3 text-lg font-black">
              {t("Верно", "Toʻgʻri")}: {score}
              {wrong > 0 && (
                <span className="text-sm font-bold text-muted">{t(` · промахов ${wrong}`, ` · xato: ${wrong}`)}</span>
              )}
            </p>
            <p className="text-sm text-muted">
              {t("Рекорд", "Rekord")}: {Math.max(record, over ? score : 0)}
            </p>
          </div>
          {!running && (
            <Button size="lg" className="w-full" onClick={start}>
              {over ? t("↺ Ещё раз", "↺ Yana bir marta") : t("▶ Старт", "▶ Boshlash")}
            </Button>
          )}
          {over && (
            <p className="rounded-2xl bg-sun-soft px-4 py-3 font-semibold">
              {score > record && record > 0
                ? t(`🏆 Новый рекорд: ${score}!`, `🏆 Yangi rekord: ${score}!`)
                : score >= 20
                  ? t("🔥 Отличная скорость!", "🔥 Ajoyib tezlik!")
                  : t("Каждая попытка делает глаз зорче.", "Har bir urinish koʻzingni oʻtkirroq qiladi.")}
            </p>
          )}
          {mode === "find" && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}
              >
                🔄{" "}
                {orientation === "white"
                  ? t("Смотреть за чёрных", "Qoralar tomonidan qarash")
                  : t("Смотреть за белых", "Oqlar tomonidan qarash")}
              </Button>
              <Button size="sm" variant={labels ? "success" : "secondary"} onClick={() => setLabels((l) => !l)}>
                {labels
                  ? t("✓ Буквы и цифры видны", "✓ Harf va raqamlar koʻrinib turibdi")
                  : t("Показать буквы и цифры", "Harf va raqamlarni koʻrsatish")}
              </Button>
            </div>
          )}
          {mode === "read" && (
            <p className="text-sm text-muted">
              {t(
                "Кр — король, Ф — ферзь, Л — ладья, С — слон, К — конь, у пешки буквы нет. «x» — взятие, «+» — шах, 0-0 — рокировка.",
                "♔ — shoh, ♕ — farzin, ♖ — rux, ♗ — fil, ♘ — ot, piyodaning belgisi yoʻq. «x» — urish, «+» — shoh berish, 0-0 — rokirovka.",
              )}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
