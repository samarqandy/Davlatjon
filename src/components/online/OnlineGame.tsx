"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AccountPanel } from "@/components/AccountPanel";
import { ChessBoard, type PromotionPiece, type SquareMark } from "@/components/chess/ChessBoard";
import { illegalText, usePromotion } from "@/components/chess/useMoveInput";
import { Button, ButtonLink, cn } from "@/components/ui";
import { useAccount } from "@/lib/account";
import { illegalReason, isInCheck, isPromotionMove, legalTargets, pieceAt, playMove } from "@/lib/chess";
import { useSan, useT } from "@/lib/i18n";
import { TIME_CONTROLS, replay, timeControlLabel, type GameView, type Side } from "@/lib/online";
import { api, errorText, usePoll } from "@/lib/onlineClient";
import { formatClock, kingOf } from "@/lib/play";
import { FriendChat } from "./FriendChat";
import { sayIllegal } from "@/lib/voice";

const nowMs = () => Date.now();

interface Loaded {
  game: GameView;
  /** Когда этот ответ получен браузером, мс: от него отсчитываем бег часов. */
  at: number;
}

const sideWord = (side: Side, t: (ru: string, uz: string) => string) =>
  side === "w" ? t("белые", "oqlar") : t("чёрные", "qoralar");

/** Партия по сети: доска, часы, сдача и ничья, переписка с соперником. */
export function OnlineGame({ id }: { id: string }) {
  const t = useT();
  const account = useAccount();
  const ready = account.status === "ready" && !!account.user;

  if (account.status === "loading")
    return <p className="text-muted">{t("Проверяем вход…", "Kirish tekshirilmoqda…")}</p>;
  if (!ready) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow-card">
        <p className="mb-3 font-bold">
          {t("Чтобы открыть партию, войди в аккаунт.", "Partiyani ochish uchun hisobga kir.")}
        </p>
        <AccountPanel back={`/chess/online/${id}`} />
      </section>
    );
  }
  return <Table id={id} />;
}

function Table({ id }: { id: string }) {
  const t = useT();
  const san = useSan();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [illegal, setIllegal] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState<{ fen: string; version: number } | null>(null);
  const [confirmResign, setConfirmResign] = useState(false);
  const [lost, setLost] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(false);

  const { data, reload, set } = usePoll<Loaded>(async () => {
    const res = await api<{ game: GameView }>(`/api/play/game?id=${encodeURIComponent(id)}`);
    if (!res.ok) {
      setLost(res.data.error ?? "network");
      return null;
    }
    setLost(null);
    return { game: res.data.game, at: nowMs() };
  }, 1500);

  const game = data?.game;
  const at = data?.at ?? 0;
  const running = !!game?.clockRunning;
  const promo = usePromotion(pending?.fen ?? game?.fen ?? "");

  // Часы идут на экране каждые четверть секунды; сервер сам решает, у кого вышло время.
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setTick(nowMs()), 250);
    return () => clearInterval(timer);
  }, [running]);

  const sans = useMemo(() => {
    if (!game) return [] as string[];
    const chess = replay(game.moves);
    return chess ? chess.history() : [];
  }, [game]);

  if (!game) {
    return lost === "not-found" ? (
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow-card">
        <p className="font-bold">
          {t("Такой партии нет, или она не твоя.", "Bunday partiya yoʻq yoki u senga tegishli emas.")}
        </p>
        <ButtonLink href="/chess/online" className="mt-3">
          {t("К друзьям", "Doʻstlarga")}
        </ButtonLink>
      </section>
    ) : (
      <p className="text-muted">{lost ? errorText(lost, t) : t("Загружаем партию…", "Partiya yuklanmoqda…")}</p>
    );
  }

  const you: Side = game.you ?? "w";
  const opponentName = you === "w" ? game.black : game.white;
  const orientation = you === "b" ? "black" : "white";
  const fen = pending && pending.version === game.version ? pending.fen : game.fen;
  const turn = fen.split(" ")[1] as Side;
  const active = game.status === "active";
  const myTurn = active && you === turn && !(pending && pending.version === game.version);
  const finished = game.status === "finished";
  const inCheck = isInCheck(fen);
  const lastUci = game.moves.at(-1);

  const elapsed = running && tick > at ? tick - at : 0;
  const left = (side: Side) => Math.max(0, game.clock[side] - (running && game.turn === side ? elapsed : 0));

  const act = async (body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    const res = await api<{ game: GameView }>("/api/play/game", { id, ...body });
    setBusy(false);
    if (!res.ok) {
      setError(errorText(res.data.error, t));
      setPending(null);
      reload();
      return false;
    }
    setPending(null);
    set({ game: res.data.game, at: nowMs() });
    return true;
  };

  const tryMove = (from: string, to: string, promotion?: PromotionPiece): boolean => {
    if (!myTurn || busy) return false;
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
    // Ход виден сразу, а сервер подтвердит его через долю секунды.
    setPending({ fen: played.fen, version: game.version });
    void act({ action: "move", uci: played.uci });
    return true;
  };

  const tap = (sq: string): boolean | void => {
    if (!myTurn) return;
    const piece = pieceAt(fen, sq);
    if (piece && piece.color === turn) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (!selected || tryMove(selected, sq)) return;
    setSelected(null);
    if (illegalReason(fen, selected, sq)) return false;
  };

  const marks: Record<string, SquareMark> = {};
  if (lastUci) {
    marks[lastUci.slice(0, 2)] = "last";
    marks[lastUci.slice(2, 4)] = "last";
  }
  if (inCheck && !finished) {
    const k = kingOf(fen, turn);
    if (k) marks[k] = "check";
  }
  if (selected && myTurn) {
    marks[selected] = "selected";
    for (const sq of legalTargets(fen, selected)) marks[sq] = pieceAt(fen, sq) ? "capture" : "target";
  }

  const clockBox = (side: Side) =>
    game.baseS > 0 ? (
      <div
        className={cn(
          "rounded-xl px-3 py-1 font-mono text-xl font-black tabular-nums",
          running && game.turn === side ? "bg-ink text-white" : "bg-white text-ink shadow-card",
          left(side) < 20_000 && game.clockRunning && "text-rose",
        )}
        data-clock={side}
      >
        {formatClock(left(side))}
      </div>
    ) : null;

  const nameRow = (side: Side) => (
    <div className="flex items-center gap-2">
      <span className="grow truncate font-mono text-lg font-black">
        {side === "w" ? game.white : game.black}
        {side === you && <span className="ml-2 text-sm font-bold text-muted">({t("ты", "sen")})</span>}
      </span>
      <span className="text-sm text-muted">{side === "w" ? "⚪" : "⚫"}</span>
      {clockBox(side)}
    </div>
  );

  const resultText = (): string => {
    if (!game.result) return "";
    const won = game.result === "1/2-1/2" ? null : (game.result === "1-0") === (you === "w");
    const why: Record<string, [string, string]> = {
      checkmate: ["Мат.", "Mot."],
      resign: ["Соперник сдался.", "Raqib taslim boʻldi."],
      timeout: ["У соперника вышло время.", "Raqibning vaqti tugadi."],
      stalemate: ["Пат.", "Pat."],
      repetition: ["Позиция повторилась три раза.", "Pozitsiya uch marta takrorlandi."],
      insufficient: ["Не хватает фигур для мата.", "Mot qoʻyish uchun figuralar yetarli emas."],
      fifty: ["Правило пятидесяти ходов.", "Ellik yurish qoidasi."],
      agreement: ["Ничья по согласию.", "Kelishuv bilan durang."],
      aborted: ["Партия отменена.", "Partiya bekor qilindi."],
    };
    const reason = game.reason ?? "checkmate";
    // «Соперник сдался» и «у соперника вышло время» — про победу; если проиграл ты — говорим про себя.
    const mine: Record<string, [string, string]> = {
      resign: ["Партия закончена сдачей.", "Partiya taslim boʻlish bilan tugadi."],
      timeout: ["У тебя вышло время.", "Sening vaqting tugadi."],
    };
    const text = won === false && mine[reason] ? mine[reason] : (why[reason] ?? ["", ""]);
    const head =
      won === null
        ? t("🤝 Ничья", "🤝 Durang")
        : won
          ? t("🏆 Победа!", "🏆 Gʻalaba!")
          : t("Поражение — в следующий раз получится!", "Magʻlubiyat — keyingi safar chiqadi!");
    return `${head} ${t(text[0], text[1])}`;
  };

  const rematch = async () => {
    const tc = TIME_CONTROLS.find((c) => c.baseS === game.baseS && c.incS === game.incS)?.id ?? "10+0";
    const res = await api<{ game: GameView }>("/api/play/games", {
      friend: opponentName,
      color: you === "w" ? "b" : "w",
      tc,
    });
    if (!res.ok) return setError(errorText(res.data.error, t));
    router.push(`/chess/online/${res.data.game.id}`);
  };

  const iAmInvited = game.status === "invited" && game.invitedBy !== you;
  const offeredToMe = active && game.drawBy !== null && game.drawBy !== you;
  const offeredByMe = active && game.drawBy === you;

  let statusText: string;
  if (finished) statusText = resultText();
  else if (game.status === "invited")
    statusText = iAmInvited
      ? t(`${opponentName} зовёт тебя на партию.`, `${opponentName} seni partiyaga chaqirmoqda.`)
      : t(`Ждём, когда ${opponentName} ответит…`, `${opponentName} javob berishini kutamiz…`);
  else if (game.status === "declined") statusText = t("Приглашение отклонено.", "Taklif rad etildi.");
  else if (myTurn)
    statusText = inCheck ? t("⚠️ Шах! Твой ход.", "⚠️ Shoh! Navbat senda.") : t("🙂 Твой ход", "🙂 Navbat senda");
  else statusText = t(`Ходят ${sideWord(turn, t)} — ${opponentName} думает…`, `${opponentName} oʻylayapti…`);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]" data-online-game={game.status}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-black">
            ⚔️ {t("Партия с", "Partiya:")} <span className="font-mono">{opponentName}</span>{" "}
            <span className="text-base font-bold text-muted">
              ⏱ {game.baseS ? timeControlLabel(game) : t("без часов", "soatsiz")}
            </span>
          </h1>
          <Link href="/chess/online" className="text-sm font-bold text-brand-dark hover:underline">
            ← {t("К друзьям", "Doʻstlarga")}
          </Link>
        </div>
        {nameRow(you === "w" ? "b" : "w")}
        <ChessBoard
          id="online"
          position={fen}
          marks={marks}
          orientation={orientation}
          onSquare={tap}
          draggable={myTurn}
          onDrop={(from, to) => tryMove(from, to)}
          canDrag={(_, piece) => piece[0] === turn && you === turn}
          promotion={promo.request}
          maxWidth={560}
        />
        {nameRow(you)}
        <p
          className={cn(
            "rounded-2xl px-4 py-3 font-bold",
            finished ? "bg-sun-soft" : myTurn ? "bg-brand-soft text-brand-dark" : "bg-white shadow-card",
          )}
          role="status"
          data-online-status
        >
          {statusText}
        </p>
        {illegal && <p className="rounded-2xl bg-sun-soft px-4 py-2 text-sm font-bold">{illegal}</p>}
        {error && (
          <p className="rounded-2xl bg-rose/10 px-4 py-2 text-sm font-bold text-[#b42318]" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {iAmInvited && (
            <>
              <Button onClick={() => void act({ action: "accept" })} disabled={busy}>
                {t("Принять", "Qabul qilish")}
              </Button>
              <Button variant="secondary" onClick={() => void act({ action: "decline" })} disabled={busy}>
                {t("Отказаться", "Rad etish")}
              </Button>
            </>
          )}
          {game.status === "invited" && !iAmInvited && (
            <Button variant="secondary" onClick={() => void act({ action: "decline" })} disabled={busy}>
              {t("Отменить приглашение", "Taklifni bekor qilish")}
            </Button>
          )}
          {active && offeredToMe && (
            <>
              <Button variant="success" onClick={() => void act({ action: "draw-accept" })} disabled={busy}>
                🤝 {t("Принять ничью", "Durangni qabul qilish")}
              </Button>
              <Button variant="secondary" onClick={() => void act({ action: "draw-decline" })} disabled={busy}>
                {t("Отказать", "Rad etish")}
              </Button>
            </>
          )}
          {active && !offeredToMe && (
            <Button
              variant="secondary"
              onClick={() => void act({ action: "draw-offer" })}
              disabled={busy || offeredByMe || game.moves.length < 2}
            >
              🤝{" "}
              {offeredByMe
                ? t("Ничья предложена", "Durang taklif qilindi")
                : t("Предложить ничью", "Durang taklif qilish")}
            </Button>
          )}
          {active && game.moves.length < 2 && (
            <Button variant="secondary" onClick={() => void act({ action: "abort" })} disabled={busy}>
              {t("Отменить партию", "Partiyani bekor qilish")}
            </Button>
          )}
          {active &&
            game.moves.length >= 2 &&
            (confirmResign ? (
              <>
                <Button
                  variant="sun"
                  onClick={() => {
                    setConfirmResign(false);
                    void act({ action: "resign" });
                  }}
                  disabled={busy}
                >
                  {t("Да, сдаться", "Ha, taslim boʻlaman")}
                </Button>
                <Button variant="ghost" onClick={() => setConfirmResign(false)}>
                  {t("Нет, играю дальше", "Yoʻq, oʻynayman")}
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => setConfirmResign(true)}>
                🏳 {t("Сдаться", "Taslim boʻlish")}
              </Button>
            ))}
          {finished && game.reason !== "aborted" && (
            <Button onClick={() => void rematch()}>🔁 {t("Сыграть ещё", "Yana oʻynash")}</Button>
          )}
        </div>
      </div>

      <aside className="space-y-3">
        <section className="rounded-3xl bg-white p-4 shadow-card" aria-labelledby="moves">
          <h2 id="moves" className="text-lg font-black">
            {t("Ходы", "Yurishlar")}
          </h2>
          {sans.length === 0 ? (
            <p className="mt-1 text-sm text-muted">{t("Ходов ещё нет.", "Hali yurish yoʻq.")}</p>
          ) : (
            <ol className="mt-2 grid max-h-48 grid-cols-2 gap-x-3 gap-y-0.5 overflow-y-auto font-mono text-sm">
              {sans.map((m, i) => (
                <li key={i} className={cn(i === sans.length - 1 && "font-black")}>
                  {i % 2 === 0 && <span className="mr-1 text-muted">{i / 2 + 1}.</span>}
                  {san(m)}
                </li>
              ))}
            </ol>
          )}
        </section>
        <FriendChat friend={opponentName} />
      </aside>
    </div>
  );
}
