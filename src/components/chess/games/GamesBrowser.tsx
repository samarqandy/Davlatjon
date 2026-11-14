"use client";

import { RotateCw, Search, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import {
  EMPTY_QUERY,
  OPENING_GROUPS,
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
  type Library,
  type LoadedGame,
  type Section,
} from "@/lib/games/library";
import { useT } from "@/lib/i18n";
import { plural } from "@/lib/plural";

/** Сколько строк списка показывать сразу и сколько добавлять по «Показать ещё». */
const PAGE = 40;

/** Последний запрос — до перезагрузки страницы: партии открывают одну за другой из одной выборки. */
let lastQuery: GameQuery = EMPTY_QUERY;

const SECTIONS: Section[] = ["all", "uz", "championship", "famous", "classic", "modern", "endgame", "short"];

/** Откуда набор — на языке страницы (в файле набора та же подпись по-русски). */
const SOURCE_TEXT: Record<string, [ru: string, uz: string]> = {
  lichess: [
    "Партии из трансляций Lichess (lichess.org/broadcast), лицензия",
    "Partiyalar Lichess translyatsiyalaridan (lichess.org/broadcast), litsenziya",
  ],
  wikimedia: [
    "Ходы партий — из статей Википедии и страниц Викисклада (авторы — участники Викимедиа), часть — по набору проекта Kingfisher, лицензия",
    "Partiyalar yurishlari — Vikipediya maqolalari va Vikiombor sahifalaridan (mualliflar — Vikimedia ishtirokchilari), bir qismi — Kingfisher loyihasi toʻplamidan, litsenziya",
  ],
  pd: [
    "Партии из книги Х. Р. Капабланки «Chess Fundamentals» (1921) —",
    "Partiyalar X. R. Kapablankaning «Chess Fundamentals» (1921) kitobidan —",
  ],
};

/** Загрузить базу партий (один раз за страницу); при сбое — «Ещё раз». */
export function useLibrary() {
  const [lib, setLib] = useState<Library | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    loadLibrary().then(
      (loaded) => {
        if (!alive) return;
        setLib(loaded);
        setFailed(false);
        setBusy(false);
      },
      () => {
        if (!alive) return;
        setFailed(true);
        setBusy(false);
      },
    );
    return () => {
      alive = false;
    };
  }, [attempt]);
  const retry = () => {
    if (busy) return;
    setBusy(true);
    setAttempt((n) => n + 1);
  };
  return { lib, failed, busy, retry };
}

/**
 * Поиск по базе партий: фамилия (латиницей, кириллицей, по-узбекски), турнир и год, кнопки игроков и дебютов,
 * разделы, фильтры по годам, результату, контролю и дебюту. Один и тот же поиск — у доски тренера (audience
 * «teacher», обращение на «вы») и на странице «База партий» для детей («child», на «ты»).
 *
 * panel — две колонки (поиск и фильтры | список), которые листаются по отдельности: база в режиме класса.
 * Нажатие на партию вызывает onPick (false — не получилось, тогда показывается refusal). hrefOf — у строки есть
 * адрес: её можно открыть в новой вкладке, а обычное нажатие всё равно идёт в onPick.
 */
export function GamesBrowser({
  audience,
  panel = false,
  page = false,
  head,
  titleId,
  hrefOf,
  onPick,
  refusal,
}: {
  audience: "teacher" | "child";
  panel?: boolean;
  /** Страница сайта: на широком окне поиск и фильтры — колонкой слева (закреплены), список — справа; head — на обе колонки (lg:col-span-2). */
  page?: boolean;
  head?: ReactNode;
  /** id заголовка, по которому подписан список. */
  titleId: string;
  hrefOf?: (game: LoadedGame) => string;
  onPick?: (game: LoadedGame) => boolean | void;
  refusal?: string;
}) {
  const t = useT();
  // Учителю — на «вы», ребёнку — на «ты».
  const tv = (teacherRu: string, childRu: string, teacherUz: string, childUz: string) =>
    audience === "teacher" ? t(teacherRu, teacherUz) : t(childRu, childUz);
  const { lib, failed, busy, retry } = useLibrary();
  const [query, setQueryState] = useState<GameQuery>(lastQuery);
  const [shown, setShown] = useState(PAGE);
  const [refused, setRefused] = useState(false);
  // Раскрыт ли блок фильтров — решает человек: блок не захлопывается, когда фильтр вернули к «любой».
  const [filtersOpen, setFiltersOpen] = useState(
    !!(query.from || query.to || query.result !== "any" || query.tc !== "any" || query.op !== "any"),
  );
  const resultsRef = useRef<HTMLDivElement>(null);
  const refusalRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLElement>(null);

  // Отказ («В уроке уже 40 досок») — туда, где его видно: нажать могли на партию внизу длинного списка.
  useEffect(() => {
    if (refused) refusalRef.current?.scrollIntoView({ block: "center" });
  }, [refused]);

  const setQuery = (patch: Partial<GameQuery>) => {
    const next = { ...query, ...patch };
    lastQuery = next;
    setQueryState(next);
    setShown(PAGE);
    setRefused(false);
    // Новая выборка — с начала списка (в режиме класса список листается отдельно от поиска).
    if (resultsRef.current) resultsRef.current.scrollTop = 0;
  };

  // Печатают — список догоняет без задержки ввода.
  const deferred = useDeferredValue(query);
  const games = lib?.games;
  const found = useMemo(() => (games ? filterGames(games, deferred) : []), [games, deferred]);
  const families = useMemo(() => (games ? openingFamilies(games) : []), [games]);
  const sectionCounts = useMemo(() => {
    const counts = Object.fromEntries(SECTIONS.map((s) => [s, 0])) as Record<Section, number>;
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
    famous: t("Знаменитые", "Mashhur"),
    classic: t("Классика (до 1950)", "Klassika (1950-yilgacha)"),
    modern: t("Последние годы", "Soʻnggi yillar"),
    endgame: t("Эндшпиль", "Endshpil"),
    short: t("Короткие победы", "Qisqa gʻalabalar"),
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

  const retryButton = (
    <Button size="sm" variant="secondary" aria-disabled={busy} onClick={retry} data-games-retry>
      <Icon icon={RotateCw} /> {busy ? t("Загружаем…", "Yuklanmoqda…") : t("Ещё раз", "Qayta urinish")}
    </Button>
  );

  const rowClass =
    "flex min-h-14 w-full flex-col items-start gap-0.5 rounded-2xl bg-paper px-3 py-2 text-left ring-1 ring-line hover:bg-brand-soft/60 focus-visible:outline-3 focus-visible:outline-brand";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col gap-3",
        panel && "games-browser",
        page && "lg:grid lg:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)] lg:items-start lg:gap-6",
      )}
      data-games
    >
      {/* Заголовок — прямой потомок: в режиме класса он занимает свою область сетки, на странице — обе колонки. */}
      {head}

      <div
        className={cn(
          "games-controls flex min-h-0 flex-col gap-3",
          // Колонка поиска закреплена и листается сама: длинный список справа не уводит фильтры за экран.
          page && "lg:sticky lg:top-[5.25rem] lg:max-h-[calc(100svh-6.25rem)] lg:overflow-y-auto lg:p-1",
        )}
      >
        <label className="relative block">
          <span className="sr-only">{t("Поиск партии", "Partiyani qidirish")}</span>
          <Icon icon={Search} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query.text}
            onChange={(e) => setQuery({ text: e.target.value })}
            placeholder={t("Фамилия, турнир или год", "Familiya, turnir yoki yil")}
            enterKeyHint="search"
            onKeyDown={(e) => {
              // «Найти» на экранной клавиатуре: список уже отфильтрован — убираем клавиатуру.
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            autoComplete="off"
            spellCheck={false}
            className="min-h-12 w-full rounded-xl border-2 border-line bg-surface py-2 pr-3 pl-10 font-bold"
            data-games-search
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
              data-games-player={c.q}
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
              data-games-section={s}
              onClick={() => setQuery({ section: s })}
            >
              {sectionName[s]}
              {lib && <span className="font-bold text-muted tabular-nums">{sectionCounts[s]}</span>}
            </Button>
          ))}
        </div>

        <div role="group" aria-label={t("Дебют", "Debyut")} className="flex flex-wrap gap-2">
          {OPENING_GROUPS.map((g) => (
            <Button
              key={g.key}
              size="sm"
              variant={query.op === g.key ? "soft" : "secondary"}
              aria-pressed={query.op === g.key}
              data-games-opening-group={g.key}
              onClick={() => setQuery({ op: query.op === g.key ? "any" : g.key })}
            >
              {opName(g.name)}
            </Button>
          ))}
        </div>

        <details
          className="rounded-2xl border-2 border-line p-2"
          open={filtersOpen}
          onToggle={(e) => setFiltersOpen(e.currentTarget.open)}
          data-games-filters
        >
          <summary ref={filtersRef} className="flex min-h-11 cursor-pointer items-center gap-2 px-1 font-extrabold">
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
                data-games-from
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
                data-games-to
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">{t("Результат", "Natija")}</span>
              <select
                value={query.result}
                onChange={(e) => setQuery({ result: e.target.value as GameQuery["result"] })}
                className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-surface px-2 font-bold"
                data-games-result
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
                data-games-tc
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
                data-games-opening
              >
                <option value="any">{t("любой", "har qanday")}</option>
                {OPENING_GROUPS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {opName(g.name)} — {t("все варианты", "barcha variantlar")}
                  </option>
                ))}
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
                data-games-reset
                onClick={() => {
                  setQuery({ from: 0, to: 0, result: "any", tc: "any", op: "any" });
                  // Кнопка исчезнет — фокус на заголовок блока, а не в никуда.
                  filtersRef.current?.focus();
                }}
              >
                {t("Сбросить фильтры", "Filtrlarni tozalash")}
              </Button>
            )}
          </div>
        </details>
        {lib && (
          <details className="text-sm text-muted" data-games-sources>
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
                    <span className="font-bold">{t("общественное достояние", "jamoat mulki")}</span>
                  )}
                  .{" "}
                  <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-brand underline">
                    {t("Источник", "Manba")}
                  </a>
                  {" · "}
                  <a href={f.url} target="_blank" rel="noreferrer" className="font-bold text-brand underline">
                    {t(
                      "файл с партиями (у каждой — ссылка на источник)",
                      "partiyalar fayli (har biriga manba havolasi)",
                    )}
                  </a>
                </li>
              ))}
              <li>
                {t(
                  "Ходы проверены и переписаны, оценки компьютера, время и комментарии убраны. Подписи и разделы — наши.",
                  "Yurishlar tekshirilib, qayta yozilgan; kompyuter baholari, vaqt va izohlar olib tashlangan. Yozuvlar va boʻlimlar — bizniki.",
                )}{" "}
                <a
                  href="/data/games/ATTRIBUTION.md"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-brand underline"
                >
                  {t("Подробнее", "Batafsil")}
                </a>
              </li>
            </ul>
          </details>
        )}
      </div>

      <div ref={resultsRef} className="games-results flex min-h-0 flex-col gap-3">
        {!lib && !failed && (
          <p className="font-bold text-muted" role="status" data-games-loading>
            {t("Загружаем партии…", "Partiyalar yuklanmoqda…")}
          </p>
        )}
        {failed && !lib && (
          <div role="alert" className="space-y-2 rounded-2xl bg-warning-soft p-3 font-bold text-warning-ink">
            <p>
              {tv(
                "Не удалось загрузить партии. Проверьте интернет и попробуйте ещё раз.",
                "Не удалось загрузить партии. Проверь интернет и попробуй ещё раз.",
                "Partiyalarni yuklab boʻlmadi. Internetni tekshirib, qayta urinib koʻring.",
                "Partiyalarni yuklab boʻlmadi. Internetni tekshirib, qayta urinib koʻr.",
              )}
            </p>
            {retryButton}
          </div>
        )}
        {lib && lib.missing.length > 0 && (
          <div role="alert" className="space-y-2 rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning-ink">
            <p>
              {tv(
                "Загрузились не все партии — часть списка пока не видна. Проверьте интернет.",
                "Загрузились не все партии — часть списка пока не видна. Проверь интернет.",
                "Hamma partiyalar yuklanmadi — roʻyxatning bir qismi hozircha koʻrinmaydi. Internetni tekshiring.",
                "Hamma partiyalar yuklanmadi — roʻyxatning bir qismi hozircha koʻrinmaydi. Internetni tekshir.",
              )}
            </p>
            {retryButton}
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
            {refused && refusal && (
              <p
                ref={refusalRef}
                role="alert"
                className="rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning-ink"
              >
                {refusal}
              </p>
            )}
            <ul className="games-list space-y-2" aria-labelledby={titleId}>
              {found.slice(0, shown).map((g) => {
                const title = g.t ? (TITLES[g.t] ? t(TITLES[g.t].ru, TITLES[g.t].uz) : g.t) : null;
                const round = roundText(g, t);
                const op = g.op ? opName(g.op) : null;
                const meta = [eventText(g), round, g.si, op, movesText(g.plies), g.tc !== "c" ? tcName[g.tc] : null];
                const body = (
                  <>
                    {title && <span className="text-sm font-black text-brand">{title}</span>}
                    <span className="flex w-full items-baseline justify-between gap-3 font-extrabold">
                      <span className="min-w-0">
                        {g.w} – {g.b}
                      </span>
                      <span className="shrink-0 tabular-nums">{resultText(g.res)}</span>
                    </span>
                    <span className="text-sm text-muted">{meta.filter(Boolean).join(" · ")}</span>
                  </>
                );
                return (
                  <li key={g.id}>
                    {hrefOf ? (
                      <a
                        href={hrefOf(g)}
                        className={rowClass}
                        data-games-item={g.id}
                        onClick={(e) => {
                          // Новая вкладка (Ctrl, средняя кнопка) — по адресу; обычное нажатие — onPick.
                          if (!onPick || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                          e.preventDefault();
                          if (onPick(g) === false) setRefused(true);
                        }}
                      >
                        {body}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (onPick?.(g) === false) setRefused(true);
                        }}
                        className={rowClass}
                        data-games-item={g.id}
                      >
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            {found.length > shown && (
              <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)} data-games-more>
                {t(`Показать ещё (${found.length - shown})`, `Yana koʻrsatish (${found.length - shown})`)}
              </Button>
            )}
            {!found.length && (
              <p className="font-bold text-muted">
                {tv(
                  "Таких партий нет. Попробуйте другую фамилию или уберите фильтры.",
                  "Таких партий нет. Попробуй другую фамилию или убери фильтры.",
                  "Bunday partiya yoʻq. Boshqa familiyani yozing yoki filtrlarni olib tashlang.",
                  "Bunday partiya yoʻq. Boshqa familiyani yoz yoki filtrlarni olib tashla.",
                )}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
