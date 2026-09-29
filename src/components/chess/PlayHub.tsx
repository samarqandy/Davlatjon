"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { BOSS_LEVEL, bestCrowns } from "@/lib/crowns";
import { robotLevels } from "@/lib/engine/search";
import { profileText, useAgeProfile } from "@/lib/age";
import { useLang, useT } from "@/lib/i18n";
import { CLOCKS, ENDGAMES, ODDS_PIECES, clockLabel, endgameText, oddsPieceLabel } from "@/lib/play";
import { useHydrated, useStore } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { PieceIcon } from "./ChessBoard";
import { PlayBoard, type PlayConfig } from "./PlayBoard";

/** Адрес вида #robot-3-w, #two, #pawns-2-b, #endgame-kq; после «?» — часы и фора: #two?c=5_3&o=bq. */
export function parseConfig(hash: string): PlayConfig | null {
  const [path, query = ""] = hash.replace(/^#/, "").split("?");
  const [mode, a, b] = path.split("-");
  const params = new URLSearchParams(query);
  const clock = CLOCKS.find((c) => c.id === params.get("c"));
  const o = params.get("o") ?? "";
  const oddsPiece = ODDS_PIECES.find((x) => x.id === o.slice(-1))?.id;
  if (mode === "robot") {
    const color = b === "b" ? "b" : "w";
    return {
      mode,
      level: Math.min(5, Math.max(1, Number(a) || 1)),
      color,
      // Фору даёт робот: он играет без фигуры.
      odds: oddsPiece ? { side: color === "w" ? "b" : "w", piece: oddsPiece } : undefined,
    };
  }
  if (mode === "two")
    return {
      mode,
      level: 1,
      color: "w",
      clock,
      odds: oddsPiece && (o[0] === "w" || o[0] === "b") ? { side: o[0], piece: oddsPiece } : undefined,
    };
  if (mode === "pawns") return { mode, level: Math.min(3, Math.max(1, Number(a) || 1)), color: b === "b" ? "b" : "w" };
  if (mode === "endgame") {
    const variant = ENDGAMES.find((v) => v.id === a);
    return variant ? { mode, level: 4, color: "w", variant } : null;
  }
  return null;
}

export function PlayHub() {
  const hash = useHash();
  const config = parseConfig(hash);
  if (config) {
    return <PlayBoard key={hash} config={config} onExit={() => setHash("#modes")} />;
  }
  return <ModeChooser />;
}

function ModeChooser() {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const profile = useAgeProfile();
  const robotName = profileText(profile, lang).robotName;
  const games = useStore((s) => s.chessGames);
  const robotGames = hydrated ? games.filter((g) => g.mode === "robot") : [];
  const wins = (level: number) => robotGames.filter((g) => g.level === level && g.result === "win").length;
  const [robotOdds, setRobotOdds] = useState("");
  const [clock, setClock] = useState("");
  const [oddsSide, setOddsSide] = useState<"w" | "b">("w");
  const [oddsPiece, setOddsPiece] = useState("");
  const robotQuery = robotOdds ? `?o=${robotOdds}` : "";
  const twoParams = [clock && `c=${clock}`, oddsPiece && `o=${oddsSide}${oddsPiece}`].filter(Boolean).join("&");
  const chip = (on: boolean) =>
    cn(
      "rounded-xl border-2 px-2.5 py-1 text-sm font-extrabold transition",
      on ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
    );

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← {t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Играть", "Oʻynash")}</p>
        <h1 className="text-3xl font-black">{t("Шахматная доска", "Shaxmat taxtasi")}</h1>
        <p className="mt-1 max-w-2xl text-muted">
          {t(
            "Играй с роботом, вдвоём с мамой или папой на одном экране, устрой пешечный бой или потренируй мат одинокому королю. Доска сама следит за правилами.",
            "Robot bilan oʻyna, onang yoki otang bilan bitta ekranda bellash, piyodalar jangini uyushtir yoki yolgʻiz shohga mot qilishni mashq qil. Qoidalarni taxtaning oʻzi kuzatib boradi.",
          )}
        </p>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="robot">
        <h2 id="robot" className="text-xl font-black">
          🤖 {t("С роботом", "Robot bilan")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {t(
            `Выбери силу робота. Тебе советуем начать с «${robotName}» — и подниматься выше, когда начнёшь побеждать.`,
            `Robotning kuchini tanla. Senga «${robotName}»dan boshlashni maslahat beramiz — yuta boshlaganingda esa yuqoriroqqa koʻtaril.`,
          )}
        </p>
        <div
          className="mt-3 flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label={t("Фора от робота", "Robotdan fora")}
        >
          <span className="text-sm font-extrabold text-muted">
            {t("Фора — робот играет:", "Fora — robot oʻynaydi:")}
          </span>
          <button type="button" className={chip(robotOdds === "")} onClick={() => setRobotOdds("")}>
            {t("со всеми фигурами", "barcha donalar bilan")}
          </button>
          {ODDS_PIECES.map((o) => (
            <button key={o.id} type="button" className={chip(robotOdds === o.id)} onClick={() => setRobotOdds(o.id)}>
              {oddsPieceLabel(o.id, lang)}
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-5">
          {robotLevels(lang).map((l) => (
            <div
              key={l.id}
              className={cn(
                "flex flex-col rounded-2xl border-2 p-3",
                hydrated && l.id === profile.robotLevel ? "border-brand/60 bg-brand-soft/30" : "border-line",
              )}
            >
              <div className="flex items-center gap-2">
                <PieceIcon piece={l.piece} className="h-10 w-10 rounded-xl bg-[#f0d9b5] p-0.5" />
                <div>
                  <p className="font-black">{l.name}</p>
                  <p className="text-xs font-bold text-muted">{t(`уровень ${l.id}`, `${l.id}-daraja`)}</p>
                  {hydrated && l.id === profile.robotLevel && (
                    <p className="text-xs font-extrabold text-brand">{t("★ советуем тебе", "★ senga tavsiya")}</p>
                  )}
                </div>
              </div>
              <p className="mt-2 flex-1 text-xs text-muted">{l.about}</p>
              {hydrated && wins(l.id) > 0 && (
                <p className="mt-1 text-xs font-extrabold text-[#065f46]">
                  🏆 {t("побед", "gʻalabalar")}: {wins(l.id)}{" "}
                  <span
                    className="ml-1 whitespace-nowrap"
                    data-best-crowns={bestCrowns(robotGames, l.id)}
                    title={t("Лучший результат: короны", "Eng yaxshi natija: tojlar")}
                  >
                    {[1, 2, 3].map((i) => (
                      <span key={i} className={i > bestCrowns(robotGames, l.id) ? "opacity-25 grayscale" : undefined}>
                        👑
                      </span>
                    ))}
                  </span>
                </p>
              )}
              {l.id === BOSS_LEVEL && (
                <p className="mt-1 text-xs font-extrabold text-rose">{t("😈 Главный босс", "😈 Bosh boss")}</p>
              )}
              <div className="mt-2 flex gap-1">
                <Button size="sm" className="flex-1" onClick={() => setHash(`#robot-${l.id}-w${robotQuery}`)}>
                  {t("Белыми", "Oqlar bilan")}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setHash(`#robot-${l.id}-b${robotQuery}`)}
                >
                  {t("Чёрными", "Qoralar bilan")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="two">
          <h2 id="two" className="text-xl font-black">
            👨‍👦 {t("Вдвоём", "Ikki kishilik oʻyin")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {t(
              "Партия на одном экране: ты и мама, папа или друг. Доска подсвечивает ходы, объявляет шах и мат, считает ходы.",
              "Bitta ekranda partiya: sen va onang, otang yoki doʻsting. Taxta yurishlarni belgilab koʻrsatadi, shoh va motni eʼlon qiladi, yurishlarni sanaydi.",
            )}
          </p>
          <p className="mt-3 text-sm font-extrabold text-muted">⏱ {t("Шахматные часы", "Shaxmat soati")}</p>
          <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={t("Шахматные часы", "Shaxmat soati")}>
            <button type="button" className={chip(clock === "")} onClick={() => setClock("")}>
              {t("без часов", "soatsiz")}
            </button>
            {CLOCKS.map((c) => (
              <button key={c.id} type="button" className={chip(clock === c.id)} onClick={() => setClock(c.id)}>
                {clockLabel(c, lang)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-extrabold text-muted">
            🎁 {t("Фора — сильный играет без фигуры", "Fora — kuchliroq oʻyinchi bitta donasiz oʻynaydi")}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={t("Кто даёт фору", "Kim fora beradi")}>
            <button type="button" className={chip(oddsSide === "w")} onClick={() => setOddsSide("w")}>
              {t("белые", "oqlar")}
            </button>
            <button type="button" className={chip(oddsSide === "b")} onClick={() => setOddsSide("b")}>
              {t("чёрные", "qoralar")}
            </button>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label={t("Фора", "Fora")}>
            <button type="button" className={chip(oddsPiece === "")} onClick={() => setOddsPiece("")}>
              {t("без форы", "forasiz")}
            </button>
            {ODDS_PIECES.map((o) => (
              <button key={o.id} type="button" className={chip(oddsPiece === o.id)} onClick={() => setOddsPiece(o.id)}>
                {oddsPieceLabel(o.id, lang)}
              </button>
            ))}
          </div>
          <Button className="mt-3" onClick={() => setHash(twoParams ? `#two?${twoParams}` : "#two")}>
            {t("Начать партию", "Partiyani boshlash")}
          </Button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="pawns">
          <h2 id="pawns" className="text-xl font-black">
            ♟ {t("Пешечный бой", "Piyodalar jangi")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {t(
              "Только пешки! Кто первым проведёт пешку до края — победил. Лучшая игра, чтобы понять, как ходят и бьют пешки.",
              "Faqat piyodalar! Kim piyodasini birinchi boʻlib taxta chetiga olib borsa — oʻsha yutadi. Piyodalar qanday yurishi va urishini tushunish uchun eng yaxshi oʻyin.",
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[1, 2, 3].map((lvl) => (
              <Button
                key={lvl}
                size="sm"
                variant={lvl === 1 ? "primary" : "secondary"}
                onClick={() => setHash(`#pawns-${lvl}-w`)}
              >
                {t("Робот", "Robot")} {lvl === 1 ? "🐣" : lvl === 2 ? "🙂" : "😎"}
              </Button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="endgames">
          <h2 id="endgames" className="text-xl font-black">
            🏁 {t("Поставь мат", "Mot qil")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {t(
              "Робот убегает королём, а ты ставишь мат. Позиция каждый раз новая. Главное — не поставить пат!",
              "Robot shohi bilan qochadi, sen esa mot qilasan. Pozitsiya har safar yangi. Eng muhimi — pat qilib qoʻyma!",
            )}
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {ENDGAMES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setHash(`#endgame-${v.id}`)}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 border-line px-3 py-2 text-left font-extrabold transition hover:border-brand/40 hover:bg-brand-soft/40",
                )}
              >
                {endgameText(v, lang).name}
                <span className="text-xs text-muted">{t(`до ${v.target} ходов`, `${v.target} yurishgacha`)}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {hydrated && games.length > 0 && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-card">
          <div>
            <h2 className="text-lg font-black">{t("Мои партии", "Mening partiyalarim")}</h2>
            <p className="mt-1 text-sm font-bold text-muted">
              {t("С роботом", "Robot bilan")}: {robotGames.length} · {t("побед", "gʻalabalar")}:{" "}
              {robotGames.filter((g) => g.result === "win").length} · {t("вдвоём", "ikki kishilik")}:{" "}
              {games.filter((g) => g.mode === "two").length}
            </p>
          </div>
          <Link
            href="/chess/review"
            className="rounded-2xl bg-brand-soft px-4 py-2 font-extrabold text-brand-dark hover:bg-[#e0e3ff]"
          >
            🔎 {t("Разбор моих партий →", "Partiyalarim tahlili →")}
          </Link>
        </section>
      )}
    </div>
  );
}
