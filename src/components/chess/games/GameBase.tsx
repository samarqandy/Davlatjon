"use client";

import { Chess } from "chess.js";
import { ArrowLeft, Download, Flag, Microscope, Pause, Play, RotateCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BarButton } from "@/components/chess/BoardBar";
import { ChessBoard, type SquareMark } from "@/components/chess/ChessBoard";
import { MoveNav } from "@/components/chess/MoveNav";
import { Button, ButtonLink, cn, Icon } from "@/components/ui";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import { checkedKing } from "@/lib/chess";
import {
  TITLES,
  eventText,
  libraryPgn,
  resultText,
  roundText,
  type LibFileMeta,
  type LoadedGame,
} from "@/lib/games/library";
import { useSan, useT } from "@/lib/i18n";
import { plural } from "@/lib/plural";
import { setHash, useHash } from "@/lib/useHash";
import { GamesBrowser, useLibrary } from "./GamesBrowser";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Позиции партии после каждого полухода (индекс 0 — начальная) из записи UCI базы. */
function positions(g: LoadedGame): { fen: string; from: string; to: string; san: string }[] {
  const chess = new Chess(g.fen ?? START);
  const out = [{ fen: chess.fen(), from: "", to: "", san: "" }];
  for (const u of g.m.split(" ")) {
    const mv = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    out.push({ fen: chess.fen(), from: mv.from, to: mv.to, san: mv.san });
  }
  return out;
}

/**
 * «База партий мастеров» для ученика (GAMES-2): та же база, что у доски тренера (930 партий: трансляции Lichess,
 * Википедия и Викисклад, книга Капабланки), тот же поиск — и просмотр партии ход за ходом. Экран партии — по
 * адресу «#id партии»: им можно поделиться, а «Назад» браузера возвращает к списку на то же место.
 */
export function GameBase() {
  const t = useT();
  const hash = useHash();
  const id = hash.length > 1 ? decodeURIComponent(hash.slice(1)) : "";
  // Где стоял список и какую партию открыли: по возвращении — туда же, фокус на ту же строку.
  const back = useRef<{ y: number; id: string } | null>(null);

  useEffect(() => {
    if (id || !back.current) return;
    const { y, id: was } = back.current;
    back.current = null;
    window.scrollTo({ top: y, behavior: "instant" });
    document.querySelector<HTMLElement>(`[data-games-item="${CSS.escape(was)}"]`)?.focus({ preventScroll: true });
  }, [id]);

  return (
    <>
      {/* Список остаётся на странице, пока открыта партия: запрос, «Показать ещё» и раскрытые фильтры не теряются. */}
      <div hidden={!!id}>
        <GamesBrowser
          audience="child"
          page
          titleId="games-base-title"
          hrefOf={(g) => `#${g.id}`}
          onPick={(g) => {
            back.current = { y: window.scrollY, id: g.id };
            setHash(`#${g.id}`);
          }}
          head={
            <div className="space-y-3 lg:col-span-2">
              <ButtonLink href="/chess/games" variant="ghost" size="sm" className="-ml-2">
                <Icon icon={ArrowLeft} /> {t("Знаменитые партии", "Mashhur partiyalar")}
              </ButtonLink>
              <header>
                <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
                  {t("Шахматная школа", "Shaxmat maktabi")}
                </p>
                <h1 id="games-base-title" className="text-3xl font-black">
                  {t("База партий мастеров", "Ustalar partiyalari bazasi")}
                </h1>
                <p className="mt-1 max-w-2xl text-muted">
                  {t(
                    "Партии чемпионов мира, узбекских гроссмейстеров и знаменитых мастеров прошлого. Найди партию по фамилии, турниру или году и посмотри её ход за ходом.",
                    "Jahon chempionlari, oʻzbek grossmeysterlari va oʻtmishning mashhur ustalari partiyalari. Partiyani familiya, turnir yoki yil boʻyicha top va uni yurishma-yurish koʻr.",
                  )}
                </p>
              </header>
            </div>
          }
        />
      </div>
      {id && (
        <GameScreen
          id={id}
          onBack={() => {
            // Пришли из списка — шаг назад по истории (список вернётся на то же место); вошли по ссылке — к списку.
            if (back.current) window.history.back();
            else setHash("#");
          }}
        />
      )}
    </>
  );
}

function GameScreen({ id, onBack }: { id: string; onBack: () => void }) {
  const t = useT();
  const { lib, failed, busy, retry } = useLibrary();
  const game = lib?.games.find((g) => g.id === id);
  const backButton = (
    <Button variant="ghost" size="sm" className="-ml-2 justify-self-start" onClick={onBack} data-games-back>
      <Icon icon={ArrowLeft} /> {t("Все партии базы", "Bazadagi barcha partiyalar")}
    </Button>
  );

  if (game)
    return <GameView key={game.id} game={game} file={lib!.files.find((f) => f.set === game.set)} back={backButton} />;

  return (
    <div className="space-y-4">
      {backButton}
      {!lib && !failed && (
        <p className="font-bold text-muted" role="status">
          {t("Загружаем партию…", "Partiya yuklanmoqda…")}
        </p>
      )}
      {(failed || (lib && lib.missing.length > 0)) && (
        <div role="alert" className="space-y-2 rounded-2xl bg-warning-soft p-3 font-bold text-warning-ink">
          <p>
            {t(
              "Не удалось загрузить партии. Проверь интернет и попробуй ещё раз.",
              "Partiyalarni yuklab boʻlmadi. Internetni tekshirib, qayta urinib koʻr.",
            )}
          </p>
          <Button size="sm" variant="secondary" aria-disabled={busy} onClick={retry}>
            <Icon icon={RotateCw} /> {busy ? t("Загружаем…", "Yuklanmoqda…") : t("Ещё раз", "Qayta urinish")}
          </Button>
        </div>
      )}
      {lib && !lib.missing.length && (
        <p className="text-lg font-bold" role="alert" data-games-not-found>
          {t("Такой партии в базе нет.", "Bazada bunday partiya yoʻq.")}
        </p>
      )}
    </div>
  );
}

function GameView({ game: g, file, back }: { game: LoadedGame; file?: LibFileMeta; back: ReactNode }) {
  const t = useT();
  const san = useSan();
  const line = useMemo(() => positions(g), [g]);
  const total = line.length - 1;
  const [ply, setPly] = useState(0);
  const [playing, setPlaying] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const movesRef = useRef<HTMLOListElement>(null);
  const isPlaying = playing && ply < total;

  // Экран партии открылся — фокус на заголовок: экранный диктор читает, какая партия, Tab идёт отсюда.
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    // На начале эндшпиля — пауза подольше: под доской появляется подпись.
    const timer = setTimeout(() => setPly((p) => p + 1), ply + 1 === g.en ? 2600 : 1300);
    return () => clearTimeout(timer);
  }, [isPlaying, ply, g.en]);

  // Текущий ход — в видимой части списка ходов (листается только сам список, не страница).
  useEffect(() => {
    const list = movesRef.current;
    const cur = list?.querySelector<HTMLElement>("[aria-current='true']");
    if (!list || !cur) return;
    if (cur.offsetTop < list.scrollTop) list.scrollTop = cur.offsetTop - 8;
    else if (cur.offsetTop + cur.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = cur.offsetTop + cur.offsetHeight - list.clientHeight + 8;
  }, [ply]);

  const go = (p: number) => {
    setPlaying(false);
    setPly(Math.min(Math.max(p, 0), total));
  };

  const cur = line[ply];
  const marks: Record<string, SquareMark> = {};
  if (ply > 0) {
    marks[cur.from] = "last";
    marks[cur.to] = "last";
  }
  const checked = checkedKing(cur.fen);
  if (checked) marks[checked] = "check";

  const title = g.t ? (TITLES[g.t] ? t(TITLES[g.t].ru, TITLES[g.t].uz) : g.t) : null;
  const opening = g.op && OPENING_NAMES[g.op] ? t(OPENING_NAMES[g.op].ru, OPENING_NAMES[g.op].uz) : null;
  const moves = Math.ceil(total / 2);
  const startBlack = line[0].fen.split(" ")[1] === "b";
  // Номер хода по позиции: партия из книги может начинаться не с первого хода и не с хода белых.
  const moveNo = (p: number) => {
    const [, side, , , , full] = line[p - 1].fen.split(" ");
    return `${full}${side === "w" ? "." : "…"}`;
  };
  const moveLabel = ply === 0 ? t("Начальная позиция", "Boshlangʻich pozitsiya") : `${moveNo(ply)} ${san(cur.san)}`;
  const winner =
    g.res === "1-0"
      ? t("победили белые", "oqlar yutdi")
      : g.res === "0-1"
        ? t("победили чёрные", "qoralar yutdi")
        : t("ничья", "durang");
  const note =
    ply === total
      ? t(`Партия окончена: ${resultText(g.res)}, ${winner}.`, `Partiya tugadi: ${resultText(g.res)}, ${winner}.`)
      : ply === g.en
        ? t(
            "Здесь начинается эндшпиль: фигур на доске осталось мало.",
            "Shu yerdan endshpil boshlanadi: taxtada donalar kam qoldi.",
          )
        : ply === 0
          ? t(
              "Нажимай «Дальше» или «Смотреть» — ходы партии пойдут по очереди.",
              "«Oldinga» yoki «Koʻrish» tugmasini bos — partiya yurishlari birin-ketin koʻrsatiladi.",
            )
          : null;

  const downloadPgn = () => {
    const url = URL.createObjectURL(new Blob([libraryPgn(g, file)], { type: "application/x-chess-pgn" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `partiya-${g.id}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const srcIsLink = /^https:\/\//.test(g.src);

  // Раскладка .board-stage: доска — слева во всю высоту окна, всё остальное — справа (на телефоне — по порядку).
  return (
    <section
      className="board-stage board-wide board-top space-y-3"
      aria-labelledby="game-base-title"
      data-games-game={g.id}
      data-games-ply={ply}
    >
      {back}
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
          {[title, eventText(g), roundText(g, t), g.si].filter(Boolean).join(" · ")}
        </p>
        <h1 id="game-base-title" ref={titleRef} tabIndex={-1} className="text-2xl font-black sm:text-3xl">
          {g.w} – {g.b}
        </h1>
        <p className="font-bold text-muted">
          {[
            resultText(g.res),
            opening && (g.eco ? `${opening} (${g.eco})` : opening),
            t(`${moves} ${plural(moves, "ход", "хода", "ходов")}`, `${moves} yurish`),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>
      <ChessBoard
        id={`base-${g.id}`}
        position={cur.fen}
        marks={marks}
        maxWidth={560}
        label={t(`Позиция: ${moveLabel}`, ply === 0 ? moveLabel : `${moveLabel} yurishidan keyingi pozitsiya`)}
      />
      <MoveNav ply={ply} total={total} onGo={go}>
        <BarButton
          icon={isPlaying ? Pause : Play}
          filled
          pressed={isPlaying}
          label={isPlaying ? t("Пауза", "Pauza") : t("Смотреть", "Koʻrish")}
          onClick={() => {
            if (isPlaying) setPlaying(false);
            else {
              if (ply === total) setPly(0);
              setPlaying(true);
            }
          }}
          data-games-play
        />
      </MoveNav>
      <div
        className={cn(
          "min-h-16 rounded-2xl border-2 px-4 py-3",
          note && ply > 0 ? "border-brand/30 bg-brand-soft/60" : "border-line bg-surface",
        )}
        aria-live="polite"
        data-games-note
      >
        <p className="text-sm font-extrabold text-muted">{moveLabel}</p>
        {note && <p className="mt-1 text-lg font-semibold">{note}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {g.en !== undefined && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              go(g.en!);
              // На телефоне кнопка — под доской: позиция эндшпиля должна оказаться на экране, а не над ним.
              const board = document.querySelector(`[data-board="base-${CSS.escape(g.id)}"]`);
              const r = board?.getBoundingClientRect();
              if (board && r && (r.top < 0 || r.bottom > window.innerHeight)) board.scrollIntoView({ block: "center" });
            }}
            data-games-endgame
          >
            <Icon icon={Flag} /> {t("К эндшпилю", "Endshpilga oʻtish")}
          </Button>
        )}
        <ButtonLink
          size="sm"
          variant="secondary"
          href={`/chess/analysis#fen=${encodeURIComponent(cur.fen)}`}
          data-games-analysis
        >
          <Icon icon={Microscope} /> {t("Разобрать на доске анализа", "Tahlil taxtasida koʻrish")}
        </ButtonLink>
        <Button size="sm" variant="secondary" onClick={downloadPgn} data-games-pgn>
          <Icon icon={Download} /> {t("Скачать PGN", "PGN yuklab olish")}
        </Button>
      </div>
      <aside className="rounded-2xl bg-surface p-3 shadow-card">
        <p className="mb-2 text-sm font-extrabold text-muted" id="game-base-moves">
          {t("Ходы партии", "Partiya yurishlari")}
        </p>
        <ol
          ref={movesRef}
          aria-labelledby="game-base-moves"
          className="relative grid max-h-[22rem] grid-cols-[auto_1fr_1fr] gap-x-2 gap-y-0.5 overflow-y-auto text-[0.95rem]"
        >
          {startBlack && (
            <li className="contents">
              <span className="text-muted">{line[0].fen.split(" ")[5]}.</span>
              <span>…</span>
              <MoveButton p={1} ply={ply} go={go} text={san(line[1].san)} />
            </li>
          )}
          {Array.from({ length: Math.ceil((total - (startBlack ? 1 : 0)) / 2) }, (_, i) => {
            const first = 2 * i + 1 + (startBlack ? 1 : 0);
            return (
              <li key={first} className="contents">
                <span className="text-muted">{line[first - 1].fen.split(" ")[5]}.</span>
                {[first, first + 1].map((p) =>
                  p <= total ? (
                    <MoveButton key={p} p={p} ply={ply} go={go} text={san(line[p].san)} endgame={p === g.en} />
                  ) : (
                    <span key={p} />
                  ),
                )}
              </li>
            );
          })}
        </ol>
      </aside>
      <p className="text-sm text-muted" data-games-source>
        {t("Источник партии:", "Partiya manbasi:")}{" "}
        {srcIsLink ? (
          <a href={g.src} target="_blank" rel="noreferrer" className="font-bold text-brand underline">
            {new URL(g.src).hostname.replace(/^www\./, "")}
          </a>
        ) : (
          g.src
        )}
        {file && (
          <>
            {" · "}
            {file.licenseUrl ? (
              <a href={file.licenseUrl} target="_blank" rel="noreferrer" className="font-bold text-brand underline">
                {file.license}
              </a>
            ) : (
              t("общественное достояние", "jamoat mulki")
            )}
          </>
        )}
        {". "}
        {t(
          "Ходы проверены и переписаны, подписи — наши.",
          "Yurishlar tekshirilib, qayta yozilgan; yozuvlar — bizniki.",
        )}
      </p>
    </section>
  );
}

function MoveButton({
  p,
  ply,
  go,
  text,
  endgame,
}: {
  p: number;
  ply: number;
  go: (p: number) => void;
  text: string;
  endgame?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => go(p)}
      aria-current={p === ply ? "true" : undefined}
      className={cn(
        "rounded-md px-1.5 py-0.5 text-left font-bold hover:bg-brand-soft",
        p === ply && "bg-brand text-white hover:bg-brand",
        endgame && p !== ply && "text-brand-dark underline decoration-dotted",
      )}
    >
      {text}
    </button>
  );
}
