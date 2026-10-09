"use client";

import Link from "next/link";
import { PieceIcon } from "@/components/chess/ChessBoard";
import { RichText } from "@/components/RichText";
import { Card, cn, ProgressBar } from "@/components/ui";
import { chessLevelHref } from "@/content/chess";
import type { ChessExercise } from "@/content/chess/types";
import { matingMovesIn, robotLevels } from "@/lib/engine/search";
import { ENDGAMES, endgameText } from "@/lib/play";
import { matingMoves, sanOf } from "@/lib/chess";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { sanFor, tFor, useLang, useT, type Lang } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { bankCount } from "@/lib/puzzleBank";
import { accuracy, solvedCount, themeStats } from "@/lib/puzzleStats";
import { isoDay, updateSettings, useHydrated, useStore, type ChessExerciseProgress } from "@/lib/store";
import { useChess } from "@/lib/useChess";

const KIND_LABEL: Record<ChessExercise["kind"], { ru: string; uz: string }> = {
  squares: { ru: "Имена клеток", uz: "Kataklar nomi" },
  moves: { ru: "Ходы фигуры", uz: "Dona yurishlari" },
  stars: { ru: "Звёздочки", uz: "Yulduzchalar" },
  move: { ru: "Найди ход", uz: "Yurishni top" },
  pick: { ru: "Найди на доске", uz: "Taxtadan top" },
  quiz: { ru: "Вопросы", uz: "Savollar" },
  queens: { ru: "Расстановка ферзей", uz: "Farzinlarni joylashtirish" },
};

/** Ключ ответа для родителя. */
function answerOf(e: ChessExercise, lang: Lang): string {
  const t = tFor(lang);
  switch (e.kind) {
    case "squares":
      return t(`Клетки по порядку: ${e.targets.join(", ")}.`, `Kataklar tartib bilan: ${e.targets.join(", ")}.`);
    case "moves":
      return t(
        `${pluralize(e.answer.length, "клетка", "клетки", "клеток")}: ${e.answer.join(", ")}.`,
        `${e.answer.length} ta katak: ${e.answer.join(", ")}.`,
      );
    case "stars":
      return t(`Меньше всего — ${pluralize(e.optimal, "ход", "хода", "ходов")}.`, `Eng kami — ${e.optimal} ta yurish.`);
    case "move": {
      const moves = (e.goal === "mate" ? matingMoves(e.fen) : e.solutions).map((u) => sanFor(lang, sanOf(e.fen, u)));
      return t(`Ход: ${moves.join(" или ")}.`, `Yurish: ${moves.join(" yoki ")}.`);
    }
    case "pick":
      return t(`Клетка ${e.answer.join(", ")}.`, `Katak: ${e.answer.join(", ")}.`);
    case "quiz":
      return e.questions.map((q, i) => `${i + 1}) ${q.options[q.correct]}`).join("; ");
    case "queens":
      return t(
        `Доска ${e.size} × ${e.size}: ферзи не должны стоять на одной линии.`,
        `${e.size} × ${e.size} taxta: hech bir ikki farzin bir chiziqda turmasligi kerak.`,
      );
  }
}

function status(p: ChessExerciseProgress | undefined, e: ChessExercise, lang: Lang): string {
  const t = tFor(lang);
  if (!p) return t("не начато", "boshlanmagan");
  const parts = [p.solvedAt ? t("✅ решено", "✅ yechildi") : t("⏳ ещё не решено", "⏳ hali yechilmagan")];
  if (p.misses) parts.push(t(`попыток не сошлось: ${p.misses}`, `${p.misses} ta urinish natija bermadi`));
  if (e.kind === "stars" && p.best !== undefined) {
    const perfect = p.best <= e.optimal;
    parts.push(
      t(
        `лучший результат: ${pluralize(p.best, "ход", "хода", "ходов")}${perfect ? " — лучше не бывает" : ""}`,
        `eng yaxshi natija: ${p.best} ta yurish${perfect ? " — bundan yaxshisi boʻlmaydi" : ""}`,
      ),
    );
  }
  if (e.kind === "queens" && p.found?.length)
    parts.push(t(`найдено решений: ${p.found.length}`, `${p.found.length} ta yechim topildi`));
  return parts.join(" · ");
}

export function ParentChess() {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const levels = useChess().levels;
  const state = useStore((s) => s);
  const statuses = levelStatuses(levels, state);
  const rank = hydrated ? currentRank(levels, state) : null;

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
          {t("Шахматная школа", "Shaxmat maktabi")}
        </p>
        <h1 className="text-3xl font-black">{t("Шахматы: прогресс и ответы", "Shaxmat: natijalar va javoblar")}</h1>
        <p className="mt-1 max-w-3xl text-muted">
          {t(
            "Шесть уровней-званий: Пешка, Конь, Слон, Ладья, Ферзь, Король. На каждом уровне — урок, правила, словарик, интересные факты и упражнения. Все позиции проверены шахматной библиотекой chess.js. Следующий уровень открывается, когда решено около семи упражнений из десяти (из семи — пять), чтобы ребёнок не застревал на одной трудной задаче; звание даётся за все упражнения.",
            "Oltita daraja-unvon: Piyoda, Ot, Fil, Rux, Farzin, Shoh. Har bir darajada dars, qoidalar, lugʻatcha, qiziqarli faktlar va mashqlar bor. Barcha pozitsiyalar chess.js shaxmat kutubxonasida tekshirilgan. Keyingi daraja oldingisidagi mashqlarning taxminan yetti dan oʻntasi (yettitadan beshtasi) yechilganda ochiladi, shunda bola bitta qiyin masalada qolib ketmaydi; unvon esa hamma mashq uchun beriladi.",
          )}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-lg font-black">
            {t("Звание: ", "Unvon: ")}
            {rank ? t(`${rank.name} (${rank.uz})`, rank.name) : t("пока нет", "hozircha yoʻq")}
          </p>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#4f46e5]"
              checked={state.settings.chessOpenAll === true}
              onChange={(e) => updateSettings({ chessOpenAll: e.target.checked })}
            />
            {t("Открыть все уровни сразу", "Barcha darajalarni birdaniga ochish")}
          </label>
        </div>
      </Card>

      <ActivitySummary />

      {levels.map((level, i) => {
        const st = statuses[i];
        const solved = hydrated ? st.solved : 0;
        return (
          <section key={level.id} className="space-y-3" aria-labelledby={`pc-${level.id}`}>
            <div className="flex flex-wrap items-center gap-3">
              <PieceIcon piece={level.piece} className="h-12 w-12 rounded-xl bg-[#f0d9b5] p-0.5" />
              <div className="min-w-0">
                <h2 id={`pc-${level.id}`} className="text-xl font-black">
                  {lang === "uz" ? (
                    `${level.order}-daraja. ${level.name}`
                  ) : (
                    <>
                      Уровень {level.order}. {level.name}{" "}
                      <span className="text-base font-bold text-muted">· {level.uz}</span>
                    </>
                  )}
                </h2>
                <p className="text-sm text-muted">{level.title}</p>
              </div>
              <div className="ml-auto flex min-w-48 items-center gap-2">
                <ProgressBar value={solved} max={st.total} className="flex-1" />
                <span className="text-sm font-extrabold whitespace-nowrap">
                  {t(`${solved} из ${st.total}`, `${st.total} tadan ${solved}`)}
                </span>
              </div>
              <Link href={chessLevelHref(level.id)} className="text-sm font-extrabold text-brand hover:underline">
                {t("Открыть уровень →", "Darajani ochish →")}
              </Link>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {level.exercises.map((e, n) => {
                const p = hydrated ? state.chess[e.id] : undefined;
                return (
                  <Card key={e.id} className={cn("space-y-1.5 p-4", !!p?.solvedAt && "border-2 border-mint/30")}>
                    <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                      {n + 1}. {t(KIND_LABEL[e.kind].ru, KIND_LABEL[e.kind].uz)}
                    </p>
                    <p className="text-lg font-black">{e.title}</p>
                    <p className="font-bold text-brand-dark">{answerOf(e, lang)}</p>
                    <p className="text-[0.95rem]">
                      <RichText text={e.why} />
                    </p>
                    <p className="text-sm font-bold text-muted">{status(p, e, lang)}</p>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const RESULT_LABEL = {
  win: { ru: "победа", uz: "gʻalaba" },
  loss: { ru: "поражение", uz: "magʻlubiyat" },
  draw: { ru: "ничья", uz: "durang" },
} as const;

/** Дата партии: по-русски — как раньше, по-узбекски — привычное «28.09.2026». */
const dateText = (ms: number, lang: Lang) =>
  lang === "uz" ? isoDay(ms).split("-").reverse().join(".") : new Date(ms).toLocaleDateString("ru-RU");

/** Игра с роботом, задачи, дебюты, партии и дневник — одним взглядом. */
function ActivitySummary() {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const chess = useChess();
  const state = useStore((s) => s);
  if (!hydrated) return null;
  const result = (r: keyof typeof RESULT_LABEL) => t(RESULT_LABEL[r].ru, RESULT_LABEL[r].uz);
  const games = state.chessGames;
  const byLevel = robotLevels(lang)
    .map((l) => {
      const list = games.filter((g) => g.mode === "robot" && g.level === l.id);
      return { level: l, games: list.length, wins: list.filter((g) => g.result === "win").length };
    })
    .filter((x) => x.games > 0);
  const endgames = ENDGAMES.map((v) => {
    const list = games.filter((g) => g.mode === "endgame" && g.variant === v.id);
    return {
      v,
      name: endgameText(v, lang).name,
      games: list.length,
      wins: list.filter((g) => g.result === "win").length,
      best: Math.min(...list.filter((g) => g.result === "win").map((g) => g.moves)),
    };
  }).filter((x) => x.games > 0);
  const pawns = games.filter((g) => g.mode === "pawns");
  const pawnWins = pawns.filter((g) => g.result === "win").length;
  // Задачи школы и задачи из базы Lichess — вместе, по темам; только темы, которые уже пробовали.
  const stats = themeStats(state.chessPuzzles);
  const puzzleThemes = chess.themes.flatMap((theme) => {
    const stat = stats.get(theme.id);
    const total = chess.puzzles.filter((p) => p.theme === theme.id).length + bankCount(theme.id);
    return stat ? [{ theme, total, stat }] : [];
  });
  const rating = state.chessRating;
  const openingsLearned = Object.keys(state.chessOpenings).map((k) => {
    const [id, side] = k.split(":");
    const name = chess.openings.find((o) => o.id === id)?.name ?? id;
    return side === "white"
      ? t(`${name} (белыми)`, `${name} (oqlar bilan)`)
      : t(`${name} (чёрными)`, `${name} (qoralar bilan)`);
  });
  const viewed = Object.keys(state.chessGamesViewed).map((id) => chess.games.find((g) => g.id === id)?.title ?? id);
  const puzzleAnswers = chess.puzzles.map((p) => ({
    p,
    answer: p.mateIn
      ? matingMovesIn(p.fen, p.mateIn)
          .map((u) => sanFor(lang, sanOf(p.fen, u)))
          .join(" / ")
      : (p.solution ?? []).map((u) => sanFor(lang, sanOf(p.fen, u))).join(" / "),
  }));
  const nothing = t("пока ничего", "hozircha hech narsa");

  return (
    <section className="space-y-3" aria-labelledby="pc-activity">
      <h2 id="pc-activity" className="text-xl font-black">
        {t("Игра, задачи, дебюты и партии", "Oʻyin, masalalar, debyutlar va partiyalar")}
      </h2>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">🤖 {t("Партии с роботом", "Robot bilan partiyalar")}</p>
          {games.length === 0 && <p className="mt-1 text-muted">{t("Ещё не играл.", "Hali oʻynamagan.")}</p>}
          <ul className="mt-1 space-y-1 text-[0.95rem]">
            {byLevel.map((x) => (
              <li key={x.level.id}>
                {t(
                  `Робот «${x.level.name}»: сыграно ${x.games}, побед ${x.wins}`,
                  `«${x.level.name}» robot: ${x.games} ta partiya, ${x.wins} ta gʻalaba`,
                )}
              </li>
            ))}
            {pawns.length > 0 && (
              <li>
                {t(
                  `Пешечный бой: сыграно ${pawns.length}, побед ${pawnWins}`,
                  `Piyodalar jangi: ${pawns.length} ta partiya, ${pawnWins} ta gʻalaba`,
                )}
              </li>
            )}
            {endgames.map((x) => (
              <li key={x.v.id}>
                {t(
                  `${x.name}: попыток ${x.games}, поставлено матов ${x.wins}`,
                  `${x.name}: ${x.games} ta urinish, ${x.wins} marta mot qildi`,
                )}
                {x.wins > 0 &&
                  t(
                    ` · быстрее всего — за ${pluralize(x.best, "ход", "хода", "ходов")}`,
                    ` · eng tezi — ${x.best} ta yurishda`,
                  )}
              </li>
            ))}
          </ul>
          {games.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              {t(
                `Последняя партия: ${result(games[0].result)}, ${games[0].moves} ходов, ${dateText(games[0].at, lang)}.`,
                `Oxirgi partiya: ${result(games[0].result)}, ${games[0].moves} ta yurish, ${dateText(games[0].at, lang)}.`,
              )}
            </p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">
            🎯{" "}
            {t(
              `Задачи · решено ${solvedCount(state.chessPuzzles)} · лучшая серия: ${state.chessStreak}`,
              `Masalalar · ${solvedCount(state.chessPuzzles)} ta yechildi · eng uzun seriya: ${state.chessStreak}`,
            )}
          </p>
          {rating && (
            <p className="mt-1 text-sm" data-parent-rating>
              {t(
                `Рейтинг в задачах: ${rating.r} (учтено задач: ${rating.n}). Ребёнку до 10 лет число не показываем — только звёзды.`,
                `Masalalardagi reyting: ${rating.r} (hisobga olingan masalalar: ${rating.n}). 10 yoshgacha bolaga raqam koʻrsatilmaydi — faqat yulduzlar.`,
              )}
            </p>
          )}
          <ul className="mt-1 space-y-1 text-[0.95rem]">
            {puzzleThemes.length === 0 && <li className="text-muted">{nothing}</li>}
            {puzzleThemes.map((x) => (
              <li key={x.theme.id} className="flex flex-wrap gap-x-2">
                <span className="font-bold">
                  {x.theme.emoji} {x.theme.name}:
                </span>
                {t(` решено ${x.stat.solved} из ${x.total}`, ` ${x.total} tadan ${x.stat.solved} tasi yechildi`)}
                <span className="text-muted">
                  {t(
                    `· с первой попытки ${Math.round(accuracy(x.stat) * 100)}%`,
                    `· birinchi urinishda ${Math.round(accuracy(x.stat) * 100)}%`,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">📖 {t("Дебюты и партии", "Debyutlar va partiyalar")}</p>
          <p className="mt-1 text-[0.95rem]">
            {t("Выучено в тренажёре: ", "Trenajyorda oʻrganilgan: ")}
            {openingsLearned.length ? openingsLearned.join(", ") : nothing}.
          </p>
          <p className="mt-1 text-[0.95rem]">
            {t("Разобрано до конца: ", "Oxirigacha koʻrib chiqilgan: ")}
            {viewed.length ? viewed.join(", ") : nothing}.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">✍️ {t("Дневник партий", "Partiyalar kundaligi")}</p>
          {state.chessDiary.length === 0 && <p className="mt-1 text-muted">{t("Записей нет.", "Hali yozuv yoʻq.")}</p>}
          <ul className="mt-1 space-y-1 text-[0.95rem]">
            {state.chessDiary.slice(0, 6).map((e) => (
              <li key={e.id}>
                {t(
                  `${e.date} · с ${e.opponent} · ${result(e.result)}`,
                  `${e.date} · ${e.opponent} bilan · ${result(e.result)}`,
                )}
                {e.notes && <span className="text-muted"> — {e.notes}</span>}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <details className="rounded-2xl bg-white p-4 shadow-card">
        <summary className="cursor-pointer text-sm font-extrabold text-brand">
          {t(
            `Ответы ко всем задачам тренажёра (${chess.puzzles.length})`,
            `Trenajyordagi barcha masalalar javoblari (${chess.puzzles.length})`,
          )}
        </summary>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {puzzleAnswers.map(({ p, answer }) => (
            <li key={p.id}>
              <b>{p.title}</b> ({"⭐".repeat(p.stars)}): {answer}
              {state.chessPuzzles[p.id]?.solvedAt ? " ✅" : ""}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
