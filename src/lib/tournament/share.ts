/**
 * Турнир словами — для кнопки «Поделиться»: организатор отправляет пары тура и таблицу в чат родителей
 * (Telegram, WhatsApp). Простой текст без разметки: его одинаково покажет любой мессенджер.
 *
 * Текст уходит только туда, куда его отправил сам организатор; на наш сервер имена не попадают.
 */
import type { Lang } from "@/lib/lang";
import { plural } from "@/lib/plural";
import { isFinished } from "./engine";
import { knockoutRoundName, points, RESULT_TEXT } from "./format";
import { bracketGames, knockoutPlaces } from "./knockout";
import { standings } from "./standings";
import { roundDone, type TGame, type Tournament } from "./types";

type Say = (ru: string, uz: string) => string;

const sayIn =
  (lang: Lang): Say =>
  (ru, uz) =>
    lang === "uz" ? uz : ru;

function names(t: Tournament): (id: string) => string {
  const byId = new Map(t.players.map((p) => [p.id, p.name]));
  return (id) => byId.get(id) ?? "?";
}

/** Партия одной строкой: «Али — Вали», с результатом — «Али 1–0 Вали». Белые слева. */
function gameLine(g: TGame & { black: string }, name: (id: string) => string): string {
  return `${name(g.white)} ${g.result ? RESULT_TEXT[g.result] : "—"} ${name(g.black)}`;
}

/** Как называется тур: «Тур 3 из 5», в олимпийской системе — «Полуфинал». */
export function roundTitle(t: Tournament, roundIndex: number, lang: Lang): string {
  const say = sayIn(lang);
  if (t.format === "knockout") return knockoutRoundName(bracketGames(t, roundIndex).length, say);
  return say(`Тур ${roundIndex + 1} из ${t.totalRounds}`, `${roundIndex + 1}-tur (jami ${t.totalRounds} ta)`);
}

/** Пары тура (и результаты, если они уже есть). Пустая строка — тура с таким номером нет. */
export function roundText(t: Tournament, roundIndex: number, lang: Lang): string {
  const round = t.rounds[roundIndex];
  if (!round) return "";
  const say = sayIn(lang);
  const name = names(t);
  // Название турнира — отдельной строкой и без кавычек: в нём могут быть свои («Турнир 3 «Б»).
  const lines = [t.name, `${roundTitle(t, roundIndex, lang)}. ${say("Белые — слева.", "Oqlar — chapda.")}`];

  const knockout = t.format === "knockout";
  const main = knockout ? bracketGames(t, roundIndex) : round.games;
  const free: string[] = [];
  let board = 0;
  for (const g of main) {
    if (g.black === null) free.push(name(g.white));
    else lines.push(`${++board}. ${gameLine({ ...g, black: g.black }, name)}`);
  }
  // Матч за третье место стоит последним в финальном туре — подписываем его отдельно.
  const small = knockout ? round.games[main.length] : undefined;
  if (small && small.black !== null)
    lines.push(`${say("За 3-е место", "3-oʻrin uchun")}: ${gameLine({ ...small, black: small.black }, name)}`);

  if (free.length) {
    const who = free.join(", ");
    lines.push(
      knockout
        ? say(`Проходят дальше без игры: ${who}`, `Oʻyinsiz keyingi bosqichga oʻtadi: ${who}`)
        : t.format === "swiss"
          ? say(`Свободен от игры (1 очко): ${who}`, `Oʻyindan ozod (1 ochko): ${who}`)
          : say(`Свободен от игры: ${who}`, `Oʻyindan ozod: ${who}`),
    );
  }
  return lines.join("\n");
}

/**
 * Таблица: место, имя, очки. Дополнительные показатели в текст не идут — места уже расставлены с их учётом,
 * а в чате столбцы цифр не читаются. В олимпийской системе — сетка по турам и призёры.
 */
export function standingsText(t: Tournament, lang: Lang): string {
  const say = sayIn(lang);
  const name = names(t);
  const done = t.rounds.filter(roundDone).length;

  if (t.format === "knockout") {
    const lines = [t.name, say("Сетка", "Setka")];
    t.rounds.forEach((_, r) => {
      // У каждого тура свой заголовок: первые две строки roundText — название турнира и тур с памяткой о цвете.
      const body = roundText(t, r, lang).split("\n").slice(2);
      lines.push("", `${roundTitle(t, r, lang)}:`, ...body);
    });
    const places = knockoutPlaces(t);
    if (places.first) {
      lines.push("", `${say("1 место", "1-oʻrin")}: ${name(places.first)}`);
      if (places.second) lines.push(`${say("2 место", "2-oʻrin")}: ${name(places.second)}`);
      if (places.third.length) lines.push(`${say("3 место", "3-oʻrin")}: ${places.third.map(name).join(", ")}`);
    }
    return lines.join("\n");
  }

  const head = isFinished(t)
    ? say("Итоговая таблица", "Yakuniy jadval")
    : done > 0
      ? say(
          `Таблица после ${done} ${plural(done, "тура", "туров", "туров")} (всего ${t.totalRounds})`,
          `${done}-turdan keyingi jadval (jami ${t.totalRounds} ta tur)`,
        )
      : say("Таблица", "Jadval");
  const lines = [t.name, head];
  for (const row of standings(t)) lines.push(`${row.rank}. ${row.player.name} — ${points(row.points)}`);
  return lines.join("\n");
}
