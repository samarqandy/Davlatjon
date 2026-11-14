"use client";

import { ClipboardPaste, Copy, LogOut, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { useSan, useT } from "@/lib/i18n";
import {
  EMPTY_FEN,
  START_FEN,
  parseMentorSetup,
  LIMITS,
  type Action,
  type MentorLesson,
  type PlyInfo,
} from "@/lib/mentor/model";
import type { MentorPrefs } from "@/lib/mentor/store";
import type { WakeLockStatus } from "@/lib/useWakeLock";
import { BoardThumb, PieceSprite } from "../BoardThumb";

/** Готовые позиции для урока — их ставят чаще всего: с них начинаются учебные игры на демонстрационной доске. */
export const PRESETS: { id: string; ru: string; uz: string; fen: string; task?: [ru: string, uz: string] }[] = [
  { id: "start", ru: "Начальная", uz: "Boshlangʻich", fen: START_FEN },
  { id: "empty", ru: "Пустая доска", uz: "Boʻsh taxta", fen: EMPTY_FEN },
  { id: "kings", ru: "Только короли", uz: "Faqat shohlar", fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1" },
  {
    id: "pawns",
    ru: "Пешечный бой",
    uz: "Piyodalar jangi",
    fen: "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1",
    task: ["Проведите пешку в ферзи первыми", "Piyodani birinchi boʻlib farzinga aylantiring"],
  },
  {
    id: "queen",
    ru: "Ферзь против 8 пешек",
    uz: "Farzin 8 ta piyodaga qarshi",
    fen: "8/pppppppp/8/8/8/8/8/3Q4 w - - 0 1",
    task: [
      "Ферзь: съешьте все пешки, пока ни одна не стала ферзём",
      "Farzin: piyodalar farzin boʻlguncha hammasini oling",
    ],
  },
  {
    id: "rook",
    ru: "Ладья против 5 пешек",
    uz: "Rux 5 ta piyodaga qarshi",
    fen: "8/1ppppp2/8/8/8/8/8/R7 w - - 0 1",
    task: ["Ладья: остановите все пешки", "Rux: hamma piyodalarni toʻxtating"],
  },
];

/** Запись ходов: каждый ход — кнопка, текущий выделен. */
export function MentorMoves({
  fens,
  ply,
  onGoto,
  compact,
}: {
  fens: PlyInfo[];
  ply: number;
  onGoto: (ply: number) => void;
  compact?: boolean;
}) {
  const t = useT();
  const san = useSan();
  if (fens.length <= 1) {
    if (compact) return null;
    return (
      <div className="rounded-3xl bg-surface p-4 shadow-card">
        <p className="text-sm text-muted">
          {t("Ходов пока нет — сделайте ход на доске.", "Hozircha yurish yoʻq — taxtada yurish qiling.")}
        </p>
      </div>
    );
  }
  return (
    <div className={cn(!compact && "rounded-3xl bg-surface p-4 shadow-card")} data-mentor-moves>
      {!compact && <p className="mb-2 text-sm font-extrabold text-muted">{t("Ходы", "Yurishlar")}</p>}
      <ol className={cn("flex flex-wrap gap-1", compact ? "mentor-moves" : "text-sm")}>
        {fens.slice(1).map((p, i) => {
          const before = fens[i].fen.split(" ");
          const white = before[1] === "w";
          return (
            <li key={`${i}-${p.uci}`}>
              <button
                type="button"
                onClick={() => onGoto(i + 1)}
                aria-current={ply === i + 1 ? "step" : undefined}
                className={cn(
                  "min-h-11 min-w-11 rounded-lg px-1.5 py-0.5 font-bold tabular-nums hover:bg-brand-soft",
                  ply === i + 1 && "bg-brand text-white hover:bg-brand",
                )}
              >
                {white || i === 0 ? `${before[5] ?? 1}.${white ? "" : ".."} ` : ""}
                {san(p.san ?? "")}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Урок: название, задание для класса и доски урока картинками. */
export function MentorDeck({
  lesson,
  current,
  fen,
  run,
  onSelect,
}: {
  lesson: MentorLesson;
  current: number;
  fen: string;
  run: (a: Action) => boolean;
  onSelect: (i: number) => void;
}) {
  const t = useT();
  const board = lesson.boards[current];
  const full = lesson.boards.length >= LIMITS.boards;
  return (
    <div className="space-y-3 rounded-3xl bg-surface p-4 shadow-card" data-mentor-deck>
      <PieceSprite />
      <label className="block">
        <span className="text-sm font-extrabold text-muted">{t("Название урока", "Dars nomi")}</span>
        <input
          value={lesson.title}
          maxLength={LIMITS.title}
          onChange={(e) => run({ t: "setLessonTitle", text: e.target.value })}
          className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-3 font-bold"
          data-mentor-lesson-title
        />
      </label>
      <label className="block">
        <span className="text-sm font-extrabold text-muted">
          {t("Задание для класса на этой доске", "Ushbu taxtadagi sinf uchun topshiriq")}
        </span>
        <input
          value={board.task}
          maxLength={LIMITS.task}
          placeholder={t("Например: Ход белых. Мат в 1 ход", "Masalan: Oqlar yuradi. 1 yurishda mot")}
          onChange={(e) => run({ t: "setTask", text: e.target.value })}
          className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-3 font-bold"
          data-mentor-task-input
        />
      </label>
      <div>
        <p className="mb-2 text-sm font-extrabold text-muted">
          {t(`Доски урока: ${lesson.boards.length}`, `Dars taxtalari: ${lesson.boards.length}`)}
        </p>
        <ol className="flex gap-2 overflow-x-auto pb-1" aria-label={t("Доски урока", "Dars taxtalari")}>
          {lesson.boards.map((b, i) => {
            // У открытой доски — то, что на экране; у остальных — позиция, с которой доска откроется.
            const at = i === current ? fen : b.start;
            return (
              <li key={b.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-current={i === current ? "true" : undefined}
                  data-mentor-slide={i}
                  className={cn(
                    "flex min-h-11 flex-col items-center gap-1 rounded-2xl p-1.5 text-sm font-extrabold",
                    i === current ? "bg-brand-soft ring-2 ring-brand" : "hover:bg-brand-soft/60",
                  )}
                >
                  <span className="block w-16">
                    <BoardThumb position={at} size={64} orientation={b.orientation} />
                  </span>
                  <span>
                    <span className="sr-only">{t("Доска ", "Taxta ")}</span>
                    {i + 1}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="soft" onClick={() => run({ t: "addBoard" })} disabled={full} data-mentor-add>
          <Icon icon={Plus} /> {t("Доска", "Taxta")}
          <span className="sr-only">{t(" — добавить с этой позицией", " — shu pozitsiya bilan qoʻshish")}</span>
        </Button>
        <Button size="sm" variant="ghost" onClick={() => run({ t: "dupBoard" })} disabled={full} data-mentor-dup>
          <Icon icon={Copy} /> {t("Копия", "Nusxa")}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => run({ t: "deleteBoard" })} data-mentor-delete>
          <Icon icon={Trash2} /> {t("Удалить доску", "Taxtani oʻchirish")}
        </Button>
      </div>
      <p className="text-sm text-muted">
        {t(
          "Урок сохраняется сам — в этом браузере, без входа на сайт. Ошиблись — «Отменить».",
          "Dars oʻzi saqlanadi — shu brauzerda, saytga kirmasdan. Xato qilsangiz — «Qaytar».",
        )}
      </p>
    </div>
  );
}

/** Две-три кнопки «выбери одно» (сторона, вид доски, скорость). */
function Choice<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: V;
  options: [V, string][];
  onChange: (v: V) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-bold">{label}:</span>
      {options.map(([v, text]) => (
        <Button
          key={v}
          size="sm"
          variant={value === v ? "soft" : "ghost"}
          aria-pressed={value === v}
          onClick={() => onChange(v)}
        >
          {text}
        </Button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm font-bold">
      <input type="checkbox" className="h-5 w-5" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

/** Настройки показа (на странице — раскрывающийся блок, в режиме класса — панель «Ещё»). */
export function MentorSettings({
  prefs,
  setPref,
  present,
  wake,
  onPaste,
  onExit,
}: {
  prefs: MentorPrefs;
  setPref: (patch: Partial<MentorPrefs>) => void;
  present: boolean;
  wake: WakeLockStatus;
  onPaste: (setup: { start: string; line: string[] }) => boolean;
  onExit?: () => void;
}) {
  const t = useT();
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const paste = () => {
    const setup = parseMentorSetup(text);
    if (!setup || !onPaste(setup)) {
      setError(true);
      return;
    }
    setError(false);
    setText("");
  };
  return (
    <div className="space-y-3" data-mentor-settings-panel>
      {!present && (
        <p className="text-sm text-muted">
          {t("Эти настройки — для режима «На большой экран».", "Bu sozlamalar «Katta ekranga» rejimi uchun.")}
        </p>
      )}
      <Choice
        label={t("Кнопки", "Tugmalar")}
        value={prefs.side}
        options={[
          ["left", t("слева от доски", "taxtaning chap tomonida")],
          ["right", t("справа", "oʻng tomonida")],
        ]}
        onChange={(side) => setPref({ side })}
      />
      <Choice
        label={t("Вид доски", "Taxta koʻrinishi")}
        value={prefs.look}
        options={[
          ["class", t("для класса", "sinf uchun")],
          ["device", t("как на этом устройстве", "shu qurilmadagidek")],
        ]}
        onChange={(look) => setPref({ look })}
      />
      <Choice
        label={t("Ходы фигур", "Donalar yurishi")}
        value={prefs.speed}
        options={[
          ["slow", t("медленно", "sekin")],
          ["normal", t("обычно", "odatiy")],
        ]}
        onChange={(speed) => setPref({ speed })}
      />
      <Toggle
        label={t("Буквы и цифры на рамке", "Ramkadagi harf va raqamlar")}
        checked={prefs.coords}
        onChange={(coords) => setPref({ coords })}
      />
      <Toggle
        label={t("Доска пониже — чтобы ученики дотягивались", "Taxta pastroqda — oʻquvchilar yetishi uchun")}
        checked={prefs.low}
        onChange={(low) => setPref({ low })}
      />
      <Toggle
        label={t("Показывать запись ходов", "Yurishlar yozuvini koʻrsatish")}
        checked={prefs.showMoves}
        onChange={(showMoves) => setPref({ showMoves })}
      />
      <div className="space-y-2">
        <label htmlFor="mentor-paste" className="text-sm font-bold">
          {t("Позиция (FEN) или партия (PGN):", "Pozitsiya (FEN) yoki partiya (PGN):")}
        </label>
        <textarea
          id="mentor-paste"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(false);
          }}
          rows={3}
          className="w-full rounded-xl border-2 border-line bg-surface p-2 font-mono text-sm"
          placeholder="8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1"
          data-mentor-paste
        />
        {error && (
          <p role="alert" className="text-sm font-bold text-danger-ink">
            {t("Не получилось прочитать — проверьте запись.", "Oʻqib boʻlmadi — yozuvni tekshiring.")}
          </p>
        )}
        <p className="text-sm text-muted">
          {t(
            "Из PGN берётся главная линия, без вариантов и комментариев.",
            "PGN dan asosiy yoʻl olinadi, variant va izohlarsiz.",
          )}
        </p>
        <Button size="sm" variant="soft" onClick={paste} disabled={!text.trim()} data-mentor-paste-apply>
          <Icon icon={ClipboardPaste} /> {t("Открыть на доске", "Taxtada ochish")}
        </Button>
      </div>
      {present && (
        <>
          <p className="text-sm text-muted" data-mentor-wake={wake}>
            {wake === "on"
              ? t("Экран не погаснет во время показа.", "Koʻrsatish vaqtida ekran oʻchmaydi.")
              : wake === "unsupported"
                ? t("Этот браузер не умеет держать экран включённым.", "Bu brauzer ekranni yoqiq tutolmaydi.")
                : t(
                    "Экран может погаснуть — проверьте настройки панели.",
                    "Ekran oʻchishi mumkin — panel sozlamalarini tekshiring.",
                  )}
          </p>
          {onExit && (
            <Button size="sm" variant="secondary" onClick={onExit}>
              <Icon icon={LogOut} /> {t("Выйти из режима класса", "Sinf rejimidan chiqish")}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
