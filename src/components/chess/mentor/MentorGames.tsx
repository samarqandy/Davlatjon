"use client";

import { RotateCw, Search, SlidersHorizontal, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import {
  EMPTY_QUERY,
  PLAYER_CHIPS,
  TITLES,
  eventText,
  filterGames,
  inSection,
  loadLibrary,
  openingFamilies,
  resultText,
  roundText,
  searchKey,
  type GameQuery,
  type LibFileMeta,
  type LoadedGame,
  type Section,
} from "@/lib/games/library";
import { useT } from "@/lib/i18n";
import { plural } from "@/lib/plural";

/** Сколько строк списка показывать сразу и сколько добавлять по «Показать ещё». */
const PAGE = 40;

/** Последний запрос — до перезагрузки страницы: тренер открывает партии одну за другой из одной выборки. */
let lastQuery: GameQuery = EMPTY_QUERY;

type Library = { games: LoadedGame[]; files: LibFileMeta[] };

const SECTIONS: Section[] = ["all", "uz", "championship", "classic", "modern"];

/** Откуда набор — на языке страницы (в файле набора та же подпись по-русски). */
const SOURCE_TEXT: Record<string, [ru: string, uz: string]> = {
  lichess: [
    "Партии из трансляций Lichess (lichess.org/broadcast), лицензия",
    "Partiyalar Lichess translyatsiyalaridan (lichess.org/broadcast), litsenziya",
  ],
  wikimedia: [
    "Ходы партий — из статей Википедии и страниц Викисклада (авторы — участники Викимедиа; у каждой партии указана правка), часть — по набору проекта Kingfisher, лицензия",
    "Partiyalar yurishlari — Vikipediya maqolalari va Vikiombor sahifalaridan (mualliflar — Vikimedia ishtirokchilari; har bir partiyada tahrir koʻrsatilgan), bir qismi — Kingfisher loyihasi toʻplamidan, litsenziya",
  ],
  pd: [
    "Партии из книги Х. Р. Капабланки «Chess Fundamentals» (1921) —",
    "Partiyalar X. R. Kapablankaning «Chess Fundamentals» (1921) kitobidan —",
  ],
};

/**
 * База партий доски тренера: поиск по фамилии (латиницей, кириллицей, по-узбекски), турниру и году, разделы
 * (Узбекистан, матчи за звание чемпиона мира, классика, последние годы), фильтры по годам, результату, контролю
 * и дебюту. Нажатие на партию открывает её на доске урока с начала (onOpen).
 */
export function MentorGames({
  present,
  onOpen,
  onClose,
}: {
  present: boolean;
  /** Открыть партию на доске; false — не получилось (в уроке уже предельное число досок). */
  onOpen: (game: LoadedGame) => boolean;
  onClose: () => void;
}) {
  const t = useT();
  const [lib, setLib] = useState<Library | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQueryState] = useState<GameQuery>(lastQuery);
  const [shown, setShown] = useState(PAGE);
  const [full, setFull] = useState(false);

  useEffect(() => {
    let alive = true;
    loadLibrary().then(
      (loaded) => alive && setLib(loaded),
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
    };
  }, [attempt]);

  const setQuery = (patch: Partial<GameQuery>) => {
    const next = { ...query, ...patch };
    lastQuery = next;
    setQueryState(next);
    setShown(PAGE);
    setFull(false);
  };

  // Печатают — список догоняет без задержки ввода.
  const deferred = useDeferredValue(query);
  const games = lib?.games;
  const found = useMemo(() => (games ? filterGames(games, deferred) : []), [games, deferred]);
  const families = useMemo(() => (games ? openingFamilies(games) : []), [games]);
  const sectionCounts = useMemo(() => {
    const counts: Record<Section, number> = { all: 0, uz: 0, championship: 0, classic: 0, modern: 0 };
    for (const g of games ?? []) for (const s of SECTIONS) if (inSection(g, s)) counts[s]++;
    return counts;
  }, [games]);

  const opName = (family: string) => {
    const n = OPENING_NAMES[family];
    return n ? t(n.ru, n.uz) : null;
  };
  const sectionName: Record<Section, string> = {
    all: t("Все", "Hammasi"),
    uz: t("Узбекистан", "Oʻzbekiston"),
    championship: t("Чемпионаты мира", "Jahon chempionatlari"),
    classic: t("Классика (до 1950)", "Klassika (1950-yilgacha)"),
    modern: t("Последние годы", "Soʻnggi yillar"),
  };
  const tcName = { c: t("классика", "klassik"), r: t("рапид", "tezkor"), b: t("блиц", "blits") } as const;
  const movesText = (plies: number) => {
    const n = Math.ceil(plies / 2);
    return t(`${n} ${plural(n, "ход", "хода", "ходов")}`, `${n} yurish`);
  };

  const activeChip = PLAYER_CHIPS.find((c) => searchKey(query.text) === searchKey(c.q));
  const filtersOn = !!(query.from || query.to || query.result !== "any" || query.tc !== "any" || query.op !== "any");
  const year = (v: string) => {
    const n = Number(v);
    return Number.isInteger(n) && n > 0 ? n : 0;
  };

  const open = (g: LoadedGame) => {
    if (!onOpen(g)) setFull(true);
  };

  return (
    <div className={cn("flex min-h-0 flex-col gap-3", present && "mentor-games")} data-mentor-games>
      <div className="flex items-center justify-between gap-2">
        <h2 id="mentor-games-title" className="text-lg font-black">
          {t("База партий", "Partiyalar bazasi")}
        </h2>
        <Button size="sm" variant="ghost" onClick={onClose} data-mentor-games-close>
          <Icon icon={X} /> {t("Закрыть", "Yopish")}
        </Button>
      </div>

      <label className="relative block">
        <span className="sr-only">{t("Поиск партии", "Partiyani qidirish")}</span>
        <Icon icon={Search} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query.text}
          onChange={(e) => setQuery({ text: e.target.value })}
          placeholder={t("Фамилия, турнир или год", "Familiya, turnir yoki yil")}
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          className="min-h-12 w-full rounded-xl border-2 border-line bg-surface py-2 pr-3 pl-10 font-bold"
          data-mentor-games-search
        />
      </label>

      <div
        role="group"
        aria-label={t("Быстрый выбор игрока", "Oʻyinchini tez tanlash")}
        className="flex flex-wrap gap-2"
      >
        {PLAYER_CHIPS.map((c) => (
          <Button
            key={c.q}
            size="sm"
            variant={activeChip === c ? "soft" : "secondary"}
            aria-pressed={activeChip === c}
            data-mentor-games-player={c.q}
            onClick={() => setQuery({ text: activeChip === c ? "" : c.q })}
          >
            {t(c.ru, c.uz)}
          </Button>
        ))}
      </div>

      <div role="group" aria-label={t("Раздел", "Boʻlim")} className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={query.section === s ? "soft" : "secondary"}
            aria-pressed={query.section === s}
            data-mentor-games-section={s}
            onClick={() => setQuery({ section: s })}
          >
            {sectionName[s]}
            {lib && <span className="font-bold text-muted tabular-nums">{sectionCounts[s]}</span>}
          </Button>
        ))}
      </div>

      <details className="rounded-2xl border-2 border-line p-2" open={filtersOn || undefined} data-mentor-games-filters>
        <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-1 font-extrabold">
          <Icon icon={SlidersHorizontal} /> {t("Фильтры", "Filtrlar")}
          {filtersOn && <span className="text-sm text-brand">{t("включены", "yoqilgan")}</span>}
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-bold">{t("Год с", "Yildan")}</span>
            <input
              type="number"
              inputMode="numeric"
              min={1800}
              max={2100}
              value={query.from || ""}
              onChange={(e) => setQuery({ from: year(e.target.value) })}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-3 font-bold"
              data-mentor-games-from
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold">{t("по", "gacha")}</span>
            <input
              type="number"
              inputMode="numeric"
              min={1800}
              max={2100}
              value={query.to || ""}
              onChange={(e) => setQuery({ to: year(e.target.value) })}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-3 font-bold"
              data-mentor-games-to
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold">{t("Результат", "Natija")}</span>
            <select
              value={query.result}
              onChange={(e) => setQuery({ result: e.target.value as GameQuery["result"] })}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-2 font-bold"
              data-mentor-games-result
            >
              <option value="any">{t("любой", "har qanday")}</option>
              <option value="1-0">{t("победа белых", "oqlar yutgan")}</option>
              <option value="1/2-1/2">{t("ничья", "durang")}</option>
              <option value="0-1">{t("победа чёрных", "qoralar yutgan")}</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold">{t("Контроль", "Vaqt nazorati")}</span>
            <select
              value={query.tc}
              onChange={(e) => setQuery({ tc: e.target.value as GameQuery["tc"] })}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-2 font-bold"
              data-mentor-games-tc
            >
              <option value="any">{t("любой", "har qanday")}</option>
              <option value="c">{tcName.c}</option>
              <option value="r">{tcName.r}</option>
              <option value="b">{tcName.b}</option>
            </select>
          </label>
          <label className="col-span-2 block">
            <span className="text-sm font-bold">{t("Дебют", "Debyut")}</span>
            <select
              value={query.op}
              onChange={(e) => setQuery({ op: e.target.value })}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-2 font-bold"
              data-mentor-games-opening
            >
              <option value="any">{t("любой", "har qanday")}</option>
              {families.map(([family, count]) => {
                const name = opName(family);
                return name ? (
                  <option key={family} value={family}>
                    {name} ({count})
                  </option>
                ) : null;
              })}
            </select>
          </label>
          {filtersOn && (
            <Button
              size="sm"
              variant="ghost"
              className="col-span-2 justify-self-start"
              data-mentor-games-reset
              onClick={() => setQuery({ from: 0, to: 0, result: "any", tc: "any", op: "any" })}
            >
              {t("Сбросить фильтры", "Filtrlarni tozalash")}
            </Button>
          )}
        </div>
      </details>

      {!lib && !failed && (
        <p className="font-bold text-muted" role="status" data-mentor-games-loading>
          {t("Загружаем партии…", "Partiyalar yuklanmoqda…")}
        </p>
      )}
      {failed && !lib && (
        <div role="alert" className="space-y-2 rounded-2xl bg-warning-soft p-3 font-bold text-warning-ink">
          <p>
            {t(
              "Не удалось загрузить партии. Проверьте интернет и попробуйте ещё раз.",
              "Partiyalarni yuklab boʻlmadi. Internetni tekshirib, qayta urinib koʻring.",
            )}
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setFailed(false);
              setAttempt((n) => n + 1);
            }}
          >
            <Icon icon={RotateCw} /> {t("Ещё раз", "Qayta urinish")}
          </Button>
        </div>
      )}

      {lib && (
        <>
          <p
            className="text-sm font-bold text-muted tabular-nums"
            aria-live="polite"
            data-mentor-games-count={found.length}
          >
            {t(
              `Найдено: ${found.length} ${plural(found.length, "партия", "партии", "партий")}`,
              `Topildi: ${found.length} ta partiya`,
            )}
          </p>
          {full && (
            <p role="alert" className="rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning-ink">
              {t(
                "В уроке уже 40 досок — удалите лишнюю доску, чтобы открыть партию.",
                "Darsda 40 ta taxta bor — partiyani ochish uchun ortiqcha taxtani oʻchiring.",
              )}
            </p>
          )}
          <ul className="mentor-games-list min-h-0 space-y-2" aria-labelledby="mentor-games-title">
            {found.slice(0, shown).map((g) => {
              const title = g.t ? (TITLES[g.t] ? t(TITLES[g.t].ru, TITLES[g.t].uz) : g.t) : null;
              const round = roundText(g, t);
              const op = g.op ? opName(g.op) : null;
              const meta = [eventText(g), round, g.si, op, movesText(g.plies), g.tc !== "c" ? tcName[g.tc] : null];
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => open(g)}
                    className="flex min-h-14 w-full flex-col items-start gap-0.5 rounded-2xl bg-paper px-3 py-2 text-left ring-1 ring-line hover:bg-brand-soft/60 focus-visible:outline-3 focus-visible:outline-brand"
                    data-mentor-games-item={g.id}
                  >
                    {title && <span className="text-sm font-black text-brand">{title}</span>}
                    <span className="flex w-full items-baseline justify-between gap-3 font-extrabold">
                      <span className="min-w-0">
                        {g.w} – {g.b}
                      </span>
                      <span className="shrink-0 tabular-nums">{resultText(g.res)}</span>
                    </span>
                    <span className="text-sm text-muted">{meta.filter(Boolean).join(" · ")}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {found.length > shown && (
            <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)} data-mentor-games-more>
              {t(`Показать ещё (${found.length - shown})`, `Yana koʻrsatish (${found.length - shown})`)}
            </Button>
          )}
          {!found.length && (
            <p className="font-bold text-muted">
              {t(
                "Таких партий нет. Попробуйте другую фамилию или уберите фильтры.",
                "Bunday partiya yoʻq. Boshqa familiyani yozing yoki filtrlarni olib tashlang.",
              )}
            </p>
          )}
          <details className="text-sm text-muted" data-mentor-games-sources>
            <summary className="min-h-11 cursor-pointer py-2 font-extrabold">
              {t("Откуда партии и на каких условиях", "Partiyalar qayerdan va qanday shartlarda")}
            </summary>
            <ul className="mt-1 space-y-2">
              {lib.files.map((f) => (
                <li key={f.set}>
                  {SOURCE_TEXT[f.set] ? t(...SOURCE_TEXT[f.set]) : f.attribution}{" "}
                  {f.licenseUrl ? (
                    <a href={f.licenseUrl} target="_blank" rel="noreferrer" className="font-bold text-brand underline">
                      {f.license}
                    </a>
                  ) : (
                    <span className="font-bold">{t("Общественное достояние", "Jamoat mulki")}</span>
                  )}
                  .{" "}
                  <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-brand underline">
                    {t("Источник", "Manba")}
                  </a>
                </li>
              ))}
              <li>
                {t(
                  "Ходы проверены и переписаны, оценки компьютера, время и комментарии убраны. Подписи и разделы — наши.",
                  "Yurishlar tekshirilib, qayta yozilgan; kompyuter baholari, vaqt va izohlar olib tashlangan. Yozuvlar va boʻlimlar — bizniki.",
                )}
              </li>
            </ul>
          </details>
        </>
      )}
    </div>
  );
}
