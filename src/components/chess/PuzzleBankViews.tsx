"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, cn } from "@/components/ui";
import { getPuzzle, type PuzzleTheme } from "@/content/chess/puzzles";
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { loadBank, pickNext, themeOfKey, useBank, type BankPuzzle } from "@/lib/puzzleBank";
import { showsRatingNumber, startRating, starsFor, targetRating, type PuzzleLevel as Level } from "@/lib/puzzleRating";
import { random } from "@/lib/random";
import {
  getState,
  updateSettings,
  useHydrated,
  usePuzzleRating,
  useStore,
  woodpeckerReset,
  woodpeckerSolved,
  woodpeckerStart,
  WOODPECKER_ROUNDS,
  type WoodpeckerRound,
} from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { setHash } from "@/lib/useHash";
import { PuzzlePlayer, type AnyPuzzle } from "./PuzzleTrainer";

function Back() {
  const t = useT();
  return (
    <button type="button" onClick={() => setHash("#all")} className="text-sm font-extrabold text-brand hover:underline">
      ← {t("Все задачи", "Barcha masalalar")}
    </button>
  );
}

/** Уровень в задачах: младшим — звёзды, с 10 лет — число рейтинга. */
export function PuzzleLevel({ className }: { className?: string }) {
  const t = useT();
  const hydrated = useHydrated();
  const rating = usePuzzleRating();
  const age = useStore((s) => s.settings.age);
  if (!hydrated) return <span className={className}>…</span>;
  return (
    <span className={className} data-puzzle-level={rating.r}>
      {showsRatingNumber(age) ? t(`Рейтинг ${rating.r}`, `Reyting ${rating.r}`) : "⭐".repeat(starsFor(rating.r))}
    </span>
  );
}

/** Сложность задач из базы: полегче, по силам, потруднее. */
export function LevelChooser() {
  const t = useT();
  const level = useStore((s) => s.settings.puzzleLevel ?? "normal");
  const options: [Level, string][] = [
    ["easy", t("Полегче", "Osonroq")],
    ["normal", t("По силам", "Oʻzimga mos")],
    ["hard", t("Потруднее", "Qiyinroq")],
  ];
  return (
    <div role="group" aria-label={t("Сложность задач", "Masalalar qiyinligi")} className="flex flex-wrap gap-1.5">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          aria-pressed={level === id}
          onClick={() => updateSettings({ puzzleLevel: id === "normal" ? undefined : id })}
          className={cn(
            "rounded-xl border-2 px-3 py-1.5 text-sm font-black transition",
            level === id ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand/40",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type PickerStatus = "loading" | "ready" | "empty" | "error";

/**
 * Задачи из базы по одной: ещё не встречавшиеся, ближе к своему уровню и выбранной сложности.
 * Следующая выбирается только по кнопке — пока ребёнок решает, задача не меняется.
 */
export function useBankPicker(name: PuzzleTheme | "mix") {
  const [got, setGot] = useState<{ name: string; puzzle: BankPuzzle | null; status: PickerStatus } | null>(null);
  const pick = useCallback(() => {
    loadBank(name).then(
      (list) => {
        const s = getState();
        const me = s.chessRating ?? startRating(s.settings.age);
        const puzzle = pickNext(list, targetRating(me, s.settings.puzzleLevel), (key) => !!s.chessPuzzles[key]);
        setGot({ name, puzzle: puzzle ?? null, status: puzzle ? "ready" : "empty" });
      },
      () => setGot({ name, puzzle: null, status: "error" }),
    );
  }, [name]);
  useEffect(() => pick(), [pick]);
  const current = got?.name === name ? got : null;
  return { puzzle: current?.puzzle ?? null, status: current?.status ?? ("loading" as PickerStatus), next: pick };
}

/** Задача по ключу прогресса: задача школы — сразу, задача из базы — после загрузки её темы. */
export function usePuzzleByKey(key: string | undefined): AnyPuzzle | "loading" | "missing" {
  const classic = key ? getPuzzle(key) : undefined;
  const theme = key && !classic ? themeOfKey(key) : undefined;
  const list = useBank(theme ?? null);
  if (classic) return classic;
  if (!key || !theme || list === "error") return "missing";
  if (list === null) return "loading";
  return list.find((p) => p.key === key) ?? "missing";
}

export function Loading() {
  const t = useT();
  return (
    <p className="rounded-3xl bg-white p-6 text-center font-bold text-muted shadow-card" aria-live="polite">
      {t("Загружаю задачи…", "Masalalar yuklanyapti…")}
    </p>
  );
}

export function LoadError({ onRetry }: { onRetry: () => void }) {
  const t = useT();
  return (
    <div className="rounded-3xl bg-sun-soft p-6 text-center">
      <p className="font-bold text-[#7a4b00]">
        {t(
          "Не получилось загрузить задачи. Проверь интернет — и попробуй ещё раз.",
          "Masalalarni yuklab boʻlmadi. Internetni tekshirib, yana urinib koʻr.",
        )}
      </p>
      <Button className="mt-3" onClick={onRetry}>
        ↺ {t("Ещё раз", "Yana bir bor")}
      </Button>
    </div>
  );
}

/** Одна задача из базы за другой — для «задач по силам» и для темы. */
export function BankRun({ name, emptyText }: { name: PuzzleTheme | "mix"; emptyText: string }) {
  const t = useT();
  const picker = useBankPicker(name);
  if (picker.status === "loading") return <Loading />;
  if (picker.status === "error") return <LoadError onRetry={picker.next} />;
  if (!picker.puzzle)
    return (
      <div className="rounded-3xl bg-mint-soft p-6 text-center">
        <p className="text-5xl" aria-hidden>
          🏆
        </p>
        <p className="mt-2 text-xl font-black">{emptyText}</p>
        <Button className="mt-3" onClick={() => setHash("#all")}>
          {t("К задачам", "Masalalarga")}
        </Button>
      </div>
    );
  return (
    <PuzzlePlayer
      key={picker.puzzle.key}
      puzzle={picker.puzzle}
      next={{ label: t("Следующая задача →", "Keyingi masala →"), onClick: picker.next }}
    />
  );
}

/** «Задачи по силам»: темы вперемешку, сложность подбирается по рейтингу. */
export function PracticeView() {
  const t = useT();
  return (
    <div className="space-y-4">
      <Back />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">🧠 {t("Задачи по силам", "Kuchingga mos masalalar")}</h1>
          <p className="text-muted">
            {t(
              "Темы вперемешку. Решаешь с первой попытки — задачи становятся труднее, ошибаешься — полегче.",
              "Mavzular aralash keladi. Birinchi urinishda yechsang — masalalar qiyinlashadi, xato qilsang — osonlashadi.",
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PuzzleLevel className="text-lg font-black" />
          <LevelChooser />
        </div>
      </header>
      <BankRun name="mix" emptyText={t("Все задачи набора решены!", "Toʻplamdagi barcha masalalarni yechding!")} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Дятел»
// ---------------------------------------------------------------------------

export const WOODPECKER_SIZE = 20;

/**
 * Набор для «Дятла»: 20 ещё не встречавшихся задач около своего уровня, не больше двух из одной темы —
 * чтобы круг был разнообразным.
 */
export function woodpeckerSet(
  list: readonly BankPuzzle[],
  target: number,
  seen: (key: string) => boolean,
  rnd: () => number = random,
): string[] {
  const near = [...list]
    .map((p) => ({ p, d: Math.abs(p.rating - target) + rnd() * 60, fresh: !seen(p.key) }))
    .sort((a, b) => Number(b.fresh) - Number(a.fresh) || a.d - b.d);
  const perTheme = new Map<string, number>();
  const out: string[] = [];
  for (const { p } of near) {
    if (out.length === WOODPECKER_SIZE) break;
    const n = perTheme.get(p.theme) ?? 0;
    if (n >= 2) continue;
    perTheme.set(p.theme, n + 1);
    out.push(p.key);
  }
  return out;
}

const clock = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Медаль за три круга: золото — третий круг вдвое быстрее первого и почти без ошибок, серебро — быстрее первого. */
export function woodpeckerMedal(rounds: readonly WoodpeckerRound[]): "🥇" | "🥈" | "🥉" | null {
  if (rounds.length < WOODPECKER_ROUNDS) return null;
  const first = rounds[0];
  const last = rounds[rounds.length - 1];
  if (last.ms <= first.ms / 2 && last.misses <= 2) return "🥇";
  if (last.ms < first.ms) return "🥈";
  return "🥉";
}

/**
 * «Дятел»: один и тот же набор из 20 задач решается три круга подряд — каждый раз быстрее.
 * Так узоры тактики запоминаются «в пальцах» (метод Смита и Тикканена, только короче).
 */
export function WoodpeckerView() {
  const t = useT();
  const hydrated = useHydrated();
  const w = useStore((s) => s.chessWoodpecker);
  const mix = useBank(w ? "mix" : null);
  const [creating, setCreating] = useState<"idle" | "busy" | "error">("idle");
  // Круг только что закончился: показываем итог, пока ребёнок не нажмёт «дальше».
  const [summary, setSummary] = useState<number | null>(null);
  // Часы текущей задачи: когда появилась и сколько заняла (после решения часы стоят до кнопки «дальше»).
  const [clockStart, setClockStart] = useState(0);
  const [now, setNow] = useState(0);
  const [solved, setSolved] = useState<{ ms: number; misses: number } | null>(null);

  const create = () => {
    setCreating("busy");
    loadBank("mix").then(
      (list) => {
        const s = getState();
        const me = s.chessRating ?? startRating(s.settings.age);
        woodpeckerStart(woodpeckerSet(list, targetRating(me, "normal"), (key) => !!s.chessPuzzles[key]));
        setSummary(null);
        setSolved(null);
        setCreating("idle");
      },
      () => setCreating("error"),
    );
  };

  const finished = !!w && w.rounds.length >= WOODPECKER_ROUNDS;
  const round = w ? w.rounds.length + 1 : 1;
  const key = w && !finished && summary === null ? w.keys[w.index] : undefined;
  const puzzle = key && Array.isArray(mix) ? mix.find((p) => p.key === key) : undefined;

  // Часы круга: время уже решённых задач плюс текущая.
  useEffect(() => {
    if (!puzzle) return;
    const begin = setTimeout(() => {
      const at = Date.now();
      setClockStart(at);
      setNow(at);
    }, 0);
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => {
      clearTimeout(begin);
      clearInterval(id);
    };
  }, [puzzle]);

  if (!hydrated) return <Loading />;

  const intro = (
    <p className="text-muted">
      {t(
        `Один набор из ${WOODPECKER_SIZE} задач решается три круга подряд. Во втором и третьем круге задачи знакомые — старайся решать быстрее и без ошибок. Так приёмы тактики запоминаются надолго.`,
        `${WOODPECKER_SIZE} ta masaladan iborat bitta toʻplam ketma-ket uch aylana yechiladi. Ikkinchi va uchinchi aylanada masalalar tanish boʻladi — ularni tezroq va xatosiz yechishga harakat qil. Shunda taktika usullari uzoq vaqt esda qoladi.`,
      )}
    </p>
  );

  if (!w || finished) {
    const medal = w ? woodpeckerMedal(w.rounds) : null;
    return (
      <div className="space-y-4">
        <Back />
        <h1 className="text-2xl font-black">🐦 {t("Дятел", "Qizilishton")}</h1>
        {intro}
        {w && finished && (
          <div className="rounded-3xl bg-sun-soft p-6 text-center">
            <p className="text-5xl" aria-hidden>
              {medal}
            </p>
            <p className="mt-2 text-xl font-black">
              {t("Три круга пройдены!", "Uchala aylana yakunlandi!")}{" "}
              {medal === "🥇"
                ? t(
                    "Золото: третий круг вдвое быстрее первого.",
                    "Oltin: uchinchi aylana birinchisidan ikki barobar tez.",
                  )
                : medal === "🥈"
                  ? t(
                      "Серебро: решаешь быстрее, чем в первом круге.",
                      "Kumush: birinchi aylanadagidan tezroq yechyapsan.",
                    )
                  : t("Бронза: набор пройден три раза.", "Bronza: toʻplam uch marta yechildi.")}
            </p>
            <Rounds rounds={w.rounds} />
          </div>
        )}
        {creating === "error" && <LoadError onRetry={create} />}
        <Button size="lg" onClick={create} disabled={creating === "busy"}>
          {w ? t("Новый набор задач", "Yangi toʻplam") : t("▶ Начать первый круг", "▶ Birinchi aylanani boshlash")}
        </Button>
      </div>
    );
  }

  if (summary !== null) {
    const r = w.rounds[summary];
    const prev = w.rounds[summary - 1];
    const faster = prev ? Math.round((1 - r.ms / prev.ms) * 100) : 0;
    return (
      <div className="space-y-4">
        <Back />
        <h1 className="text-2xl font-black">🐦 {t("Дятел", "Qizilishton")}</h1>
        <div className="rounded-3xl bg-mint-soft p-6 text-center">
          <p className="text-xl font-black">
            {t(`Круг ${summary + 1} пройден!`, `${summary + 1}-aylana yakunlandi!`)} ⏱ {clock(r.ms)} ·{" "}
            {t(pluralize(r.misses, "ошибка", "ошибки", "ошибок"), `${r.misses} ta xato`)}
          </p>
          {prev && (
            <p className="mt-1 font-bold text-[#065f46]">
              {faster > 0
                ? t(`Быстрее прошлого круга на ${faster}%!`, `Oldingi aylanadan ${faster}% tezroq!`)
                : t(
                    "В этот раз медленнее — не страшно, главное точность.",
                    "Bu safar sekinroq boʻldi — hechqisi yoʻq, eng muhimi aniqlik.",
                  )}
            </p>
          )}
          <Button className="mt-4" size="lg" onClick={() => setSummary(null)}>
            {t(`Начать круг ${summary + 2}`, `${summary + 2}-aylanani boshlash`)}
          </Button>
        </div>
      </div>
    );
  }

  const elapsed = w.ms + (solved ? solved.ms : clockStart && now > clockStart ? now - clockStart : 0);
  const last = w.index + 1 === w.keys.length;
  const advance = () => {
    if (!solved) return;
    woodpeckerSolved(solved.ms, solved.misses);
    setSolved(null);
    if (last) setSummary(w.rounds.length);
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Back />
        <p className="text-lg font-black">
          🐦{" "}
          {t(
            `Круг ${round} из ${WOODPECKER_ROUNDS} · задача ${w.index + 1} из ${w.keys.length}`,
            `${round}-aylana (jami ${WOODPECKER_ROUNDS} ta) · ${w.index + 1}-masala (jami ${w.keys.length} ta)`,
          )}{" "}
          · ⏱ <span className="tabular-nums">{clock(elapsed)}</span>
        </p>
      </div>
      {w.rounds.length > 0 && <Rounds rounds={w.rounds} />}
      {mix === "error" ? (
        <LoadError onRetry={() => setHash("#woodpecker")} />
      ) : !puzzle ? (
        mix === null ? (
          <Loading />
        ) : (
          <div className="rounded-3xl bg-sun-soft p-6 text-center">
            <p className="font-bold text-[#7a4b00]">
              {t(
                "Этой задачи больше нет в наборе — начнём новый.",
                "Bu masala endi toʻplamda yoʻq — yangisini boshlaymiz.",
              )}
            </p>
            <Button className="mt-3" onClick={woodpeckerReset}>
              {t("Новый набор задач", "Yangi toʻplam")}
            </Button>
          </div>
        )
      ) : (
        <PuzzlePlayer
          key={`${puzzle.key}-${round}`}
          puzzle={puzzle}
          onSolved={(misses) => setSolved({ ms: Math.max(0, Date.now() - clockStart), misses })}
          next={{
            label: last ? t("Закончить круг →", "Aylanani yakunlash →") : t("Следующая задача →", "Keyingi masala →"),
            onClick: advance,
          }}
        />
      )}
    </div>
  );
}

function Rounds({ rounds }: { rounds: readonly WoodpeckerRound[] }) {
  const t = useT();
  return (
    <ol
      className="mt-3 flex flex-wrap justify-center gap-2"
      aria-label={t("Пройденные круги", "Yakunlangan aylanalar")}
    >
      {rounds.map((r, i) => (
        <li key={i} className="rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-card">
          {t(`Круг ${i + 1}`, `${i + 1}-aylana`)}: ⏱ {clock(r.ms)} · ❌ {r.misses}
        </li>
      ))}
    </ol>
  );
}

/** Название темы с эмодзи — для чипов на панели. */
export function useThemeName() {
  const { themes } = useChess();
  return (id: PuzzleTheme) => {
    const theme = themes.find((x) => x.id === id);
    return theme ? `${theme.emoji} ${theme.name}` : id;
  };
}
