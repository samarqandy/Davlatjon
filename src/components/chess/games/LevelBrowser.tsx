"use client";

import { RotateCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import { OPENING_GROUPS, resultText, type LoadedGame } from "@/lib/games/library";
import { EMPTY_LEVEL_QUERY, filterLevel, loadLevel, type Level, type LevelQuery } from "@/lib/games/levels";
import { useT } from "@/lib/i18n";
import { plural } from "@/lib/plural";
import type { LibraryState } from "./GamesBrowser";

const PAGE = 40;

/** Последний запрос на каждом уровне — до перезагрузки страницы. */
const lastQuery = new Map<Level, LevelQuery>();

/** Подпись уровня: «Начинающие · 1000–1400». */
export function levelName(level: Level, t: (ru: string, uz: string) => string): string {
  return level === 1
    ? t("Начинающие · 1000–1400", "Boshlangʻich · 1000–1400")
    : level === 2
      ? t("Средний уровень · 1400–1800", "Oʻrta daraja · 1400–1800")
      : t("Сильные игроки · 1800–2200", "Kuchli oʻyinchilar · 1800–2200");
}

/** Кто играл: ников нет — «Белые (1300)». */
export function sideName(g: LoadedGame, side: "w" | "b", t: (ru: string, uz: string) => string): string {
  if (!g.lv) return side === "w" ? g.w : g.b;
  const r = side === "w" ? g.we : g.be;
  return side === "w" ? t(`Белые (${r})`, `Oqlar (${r})`) : t(`Чёрные (${r})`, `Qoralar (${r})`);
}

/** Загрузить файл уровня (level = null — ничего не грузить): то же состояние, что у базы мастеров. */
export function useLevelLibrary(level: Level | null): LibraryState {
  const [state, setState] = useState<{ level: Level | null; lib: LibraryState["lib"]; failed: boolean }>({
    level: null,
    lib: null,
    failed: false,
  });
  const [attempt, setAttempt] = useState(0);
  const busy = level !== null && state.level === level && !state.lib && !state.failed;
  useEffect(() => {
    if (level === null) return;
    let alive = true;
    loadLevel(level).then(
      ({ games, meta }) => alive && setState({ level, lib: { games, files: [meta], missing: [] }, failed: false }),
      () => alive && setState({ level, lib: null, failed: true }),
    );
    return () => {
      alive = false;
    };
  }, [level, attempt]);
  const current = state.level === level;
  return {
    lib: current ? state.lib : null,
    failed: current && state.failed,
    busy: busy || (level !== null && !current),
    retry: () => {
      setState((s) => ({ ...s, failed: false }));
      setAttempt((n) => n + 1);
    },
  };
}

/**
 * Список партий одного уровня: партии обычных игроков из открытой базы Lichess, без имён. Отбор — по дебюту,
 * результату, «закончилась матом», «есть решающая ошибка» и «короткие».
 */
export function LevelBrowser({
  level,
  library: { lib, failed, busy, retry },
  head,
  titleId,
  onPick,
}: {
  level: Level;
  library: LibraryState;
  head: ReactNode;
  titleId: string;
  onPick: (game: LoadedGame) => void;
}) {
  const t = useT();
  // Другой уровень — другой экземпляр (key={level}) со своим запросом.
  const [query, setQueryState] = useState<LevelQuery>(lastQuery.get(level) ?? EMPTY_LEVEL_QUERY);
  const [shown, setShown] = useState(PAGE);
  const resultsRef = useRef<HTMLDivElement>(null);

  const setQuery = (patch: Partial<LevelQuery>) => {
    const next = { ...query, ...patch };
    lastQuery.set(level, next);
    setQueryState(next);
    setShown(PAGE);
  };

  const found = useMemo(() => (lib ? filterLevel(lib.games, query) : []), [lib, query]);
  const opName = (family?: string) => {
    const n = family ? OPENING_NAMES[family] : undefined;
    return n ? t(n.ru, n.uz) : null;
  };
  const movesText = (plies: number) => {
    const n = Math.ceil(plies / 2);
    return t(`${n} ${plural(n, "ход", "хода", "ходов")}`, `${n} yurish`);
  };
  const chips = "flex flex-wrap gap-2 max-sm:-mx-4 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-1";
  const chip = "shrink-0 whitespace-nowrap";
  const toggles: { key: "mate" | "mistake" | "short"; label: string }[] = [
    { key: "mate", label: t("Закончилась матом", "Mot bilan tugagan") },
    { key: "mistake", label: t("Есть решающая ошибка", "Hal qiluvchi xato bor") },
    { key: "short", label: t("Короткие (до 30 ходов)", "Qisqa (30 yurishgacha)") },
  ];
  const results: { key: LevelQuery["result"]; label: string }[] = [
    { key: "any", label: t("Любой результат", "Har qanday natija") },
    { key: "1-0", label: t("Выиграли белые", "Oqlar yutgan") },
    { key: "0-1", label: t("Выиграли чёрные", "Qoralar yutgan") },
    { key: "1/2-1/2", label: t("Ничья", "Durang") },
  ];
  const rowClass =
    "flex min-h-14 w-full flex-col items-start gap-0.5 rounded-2xl bg-paper px-3 py-2 text-left ring-1 ring-line hover:bg-brand-soft/60 focus-visible:outline-3 focus-visible:outline-brand";

  return (
    <div
      className="flex min-h-0 flex-col gap-3 lg:grid lg:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)] lg:items-start lg:gap-6"
      data-games
      data-games-level={level}
    >
      {head}
      <div className="flex min-h-0 flex-col gap-3 lg:sticky lg:top-[5.25rem] lg:max-h-[calc(100svh-6.25rem)] lg:overflow-y-auto lg:p-1">
        <p className="text-muted">
          {t(
            "Партии обычных игроков твоего уровня из открытой базы Lichess: на них видно, какие ошибки случаются чаще всего и как их наказывают.",
            "Oʻz darajangdagi oddiy oʻyinchilarning Lichess ochiq bazasidagi partiyalari: qaysi xatolar koʻp uchrashi va ular qanday jazolanishi koʻrinadi.",
          )}
        </p>
        <div role="group" aria-label={t("Что показать", "Nimani koʻrsatish")} className={chips}>
          {toggles.map((x) => (
            <Button
              key={x.key}
              size="sm"
              variant={query[x.key] ? "soft" : "secondary"}
              aria-pressed={query[x.key]}
              className={chip}
              data-level-toggle={x.key}
              onClick={() => setQuery({ [x.key]: !query[x.key] })}
            >
              {x.label}
            </Button>
          ))}
        </div>
        <div role="group" aria-label={t("Результат", "Natija")} className={chips}>
          {results.map((x) => (
            <Button
              key={x.key}
              size="sm"
              variant={query.result === x.key ? "soft" : "secondary"}
              aria-pressed={query.result === x.key}
              className={chip}
              data-level-result={x.key}
              onClick={() => setQuery({ result: x.key })}
            >
              {x.label}
            </Button>
          ))}
        </div>
        <div role="group" aria-label={t("Дебют", "Debyut")} className={chips}>
          {OPENING_GROUPS.map((g) => (
            <Button
              key={g.key}
              size="sm"
              variant={query.op === g.key ? "soft" : "secondary"}
              aria-pressed={query.op === g.key}
              className={chip}
              data-level-opening={g.key}
              onClick={() => setQuery({ op: query.op === g.key ? "any" : g.key })}
            >
              {opName(g.name)}
            </Button>
          ))}
        </div>
        {lib && (
          <p className="text-sm text-muted" data-level-source>
            {t("Источник:", "Manba:")}{" "}
            <a
              href={lib.files[0].sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand underline"
            >
              database.lichess.org
            </a>{" "}
            ·{" "}
            <a
              href={lib.files[0].licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand underline"
            >
              CC0
            </a>
            .{" "}
            {t(
              "Ники игроков, ссылки и турниры убраны, рейтинги округлены.",
              "Oʻyinchilar niklari, havolalar va turnirlar olib tashlangan, reytinglar yaxlitlangan.",
            )}
          </p>
        )}
      </div>

      <div ref={resultsRef} className="flex min-h-0 flex-col gap-3">
        {!lib && !failed && (
          <p className="font-bold text-muted" role="status" data-games-loading>
            {t("Загружаем партии…", "Partiyalar yuklanmoqda…")}
          </p>
        )}
        {failed && (
          <div role="alert" className="space-y-2 rounded-2xl bg-warning-soft p-3 font-bold text-warning-ink">
            <p>
              {t(
                "Не удалось загрузить партии. Проверь интернет и попробуй ещё раз.",
                "Partiyalarni yuklab boʻlmadi. Internetni tekshirib, qayta urinib koʻr.",
              )}
            </p>
            <Button size="sm" variant="secondary" aria-disabled={busy} onClick={retry} data-games-retry>
              <Icon icon={RotateCw} /> {busy ? t("Загружаем…", "Yuklanmoqda…") : t("Ещё раз", "Qayta urinish")}
            </Button>
          </div>
        )}
        {lib && (
          <>
            <p className="text-sm font-bold text-muted tabular-nums" aria-live="polite" data-games-count={found.length}>
              {t(
                `Найдено: ${found.length} ${plural(found.length, "партия", "партии", "партий")}`,
                `Topildi: ${found.length} ta partiya`,
              )}
            </p>
            <ul className="space-y-2" aria-labelledby={titleId}>
              {found.slice(0, shown).map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className={rowClass}
                    data-games-item={g.id}
                    onClick={(e) => {
                      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      onPick(g);
                    }}
                  >
                    <span className="flex w-full items-baseline justify-between gap-3 font-extrabold">
                      <span className="min-w-0">
                        {sideName(g, "w", t)} – {sideName(g, "b", t)}
                      </span>
                      <span className="shrink-0 tabular-nums">{resultText(g.res)}</span>
                    </span>
                    <span className="text-sm text-muted">
                      {[
                        opName(g.op),
                        movesText(g.plies),
                        g.tc === "c" ? t("классика", "klassik") : t("рапид", "tezkor"),
                        g.mt ? t("мат", "mot") : null,
                        g.x ? t("есть решающая ошибка", "hal qiluvchi xato bor") : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {found.length > shown && (
              <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)} data-games-more>
                {t(`Показать ещё (${found.length - shown})`, `Yana koʻrsatish (${found.length - shown})`)}
              </Button>
            )}
            {!found.length && (
              <p className={cn("font-bold text-muted")}>
                {t(
                  "Таких партий нет. Попробуй убрать часть отбора.",
                  "Bunday partiya yoʻq. Tanlovning bir qismini olib tashlab koʻr.",
                )}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
