"use client";

import { cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { bracketGames, knockoutPlaces } from "@/lib/tournament/knockout";
import { standings } from "@/lib/tournament/standings";
import type { TGame, Tournament } from "@/lib/tournament/types";
import { pointsIn, winnerOf } from "@/lib/tournament/types";
import { knockoutRoundName, metric, points } from "./shared";

/** Итоги: таблица с местами и дополнительными показателями; у олимпийской системы — сетка. */
export function TournamentTable({ tournament: t }: { tournament: Tournament }) {
  return t.format === "knockout" ? <Bracket tournament={t} /> : <Standings tournament={t} />;
}

function Standings({ tournament: t }: { tournament: Tournament }) {
  const tr = useT();
  const rows = standings(t);
  const swiss = t.format === "swiss";
  const cell = "px-1.5 py-2 text-right tabular-nums";
  const head = "px-1.5 py-2 text-right text-sm font-extrabold whitespace-nowrap text-muted";
  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-3xl bg-surface shadow-card" data-standings>
        <table className="w-full min-w-[18rem] border-collapse">
          <caption className="sr-only">{tr("Таблица турнира", "Turnir jadvali")}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className={cn(head, "w-9 text-center")}>
                <abbr title={tr("Место", "Oʻrin")}>{tr("М", "Oʻ")}</abbr>
              </th>
              <th scope="col" className={cn(head, "text-left")}>
                {tr("Участник", "Ishtirokchi")}
              </th>
              <th scope="col" className={head}>
                {tr("Очки", "Ochko")}
              </th>
              {swiss ? (
                <>
                  <th scope="col" className={head}>
                    <abbr title={tr("Бухгольц без худшего результата", "Eng past natijasiz Buxgolts")}>
                      {tr("БХ−1", "BX−1")}
                    </abbr>
                  </th>
                  <th scope="col" className={head}>
                    <abbr title={tr("Бухгольц", "Buxgolts")}>{tr("БХ", "BX")}</abbr>
                  </th>
                </>
              ) : (
                <th scope="col" className={head}>
                  <abbr title={tr("Личные встречи", "Oʻzaro uchrashuvlar")}>{tr("ЛВ", "OʻU")}</abbr>
                </th>
              )}
              <th scope="col" className={head}>
                <abbr title={tr("Зоннеборн-Бергер", "Zonneborn-Berger")}>{tr("ЗБ", "ZB")}</abbr>
              </th>
              <th scope="col" className={head}>
                <abbr title={tr("Победы", "Gʻalabalar")}>{tr("Поб.", "Gʻal.")}</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.player.id} className="border-b border-line/60 last:border-0" data-rank={row.rank}>
                <td className={cn(cell, "text-center font-black")}>{row.rank}</td>
                <th scope="row" className="px-1.5 py-2 text-left font-extrabold break-words">
                  {row.player.name}
                  {row.player.withdrawnAfter !== undefined && (
                    <span className="ml-2 text-sm font-bold text-muted">{tr("(выбыл)", "(chiqib ketdi)")}</span>
                  )}
                </th>
                <td className={cn(cell, "text-lg font-black")} data-points={row.points}>
                  {points(row.points)}
                </td>
                {swiss ? (
                  <>
                    <td className={cell}>{metric(row.buchholzCut1)}</td>
                    <td className={cell}>{metric(row.buchholz)}</td>
                  </>
                ) : (
                  <td className={cell}>{metric(row.direct)}</td>
                )}
                <td className={cell}>{metric(row.sonnebornBerger)}</td>
                <td className={cell}>{row.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="rounded-3xl bg-surface p-4 shadow-card print:hidden">
        <summary className="min-h-11 cursor-pointer py-2 font-black">
          {tr("Как считаются места", "Oʻrinlar qanday hisoblanadi")}
        </summary>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          <li>{tr("М — место.", "Oʻ — oʻrin.")}</li>
          <li>
            {tr("Очки: победа — 1, ничья — ½, поражение — 0.", "Ochkolar: gʻalaba — 1, durang — ½, magʻlubiyat — 0.")}
            {swiss && tr(" Свободный от игры получает 1 очко.", " Oʻyindan ozod boʻlgan ishtirokchi 1 ochko oladi.")}
          </li>
          {swiss ? (
            <>
              <li>
                {tr(
                  "БХ−1 и БХ (Бухгольц): сумма очков всех соперников — без самого слабого и полная. У кого соперники сильнее, тот выше.",
                  "BX−1 va BX (Buxgolts): barcha raqiblarning ochkolari yigʻindisi — eng kuchsizisiz va toʻliq. Raqiblari kuchliroq boʻlgan ishtirokchi yuqorida turadi.",
                )}
              </li>
              <li>
                {tr(
                  "ЗБ (Зоннеборн-Бергер): очки побеждённых соперников и половина очков тех, с кем сыграна ничья.",
                  "ZB (Zonneborn-Berger): yutilgan raqiblarning ochkolari va durang oʻynalgan raqiblar ochkolarining yarmi.",
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                {tr(
                  "ЛВ: очки в партиях между теми, у кого очков поровну. Считается, когда эти партии сыграны.",
                  "OʻU: ochkolari teng ishtirokchilarning oʻzaro partiyalaridagi ochkolar. Shu partiyalar oʻynalgach hisoblanadi.",
                )}
              </li>
              <li>
                {tr(
                  "ЗБ (Зоннеборн-Бергер): очки побеждённых соперников и половина очков тех, с кем сыграна ничья.",
                  "ZB (Zonneborn-Berger): yutilgan raqiblarning ochkolari va durang oʻynalgan raqiblar ochkolarining yarmi.",
                )}
              </li>
            </>
          )}
          <li>
            {tr(
              "Если все показатели равны, участники делят место.",
              "Barcha koʻrsatkichlar teng boʻlsa, ishtirokchilar oʻrinni boʻlishadi.",
            )}
          </li>
        </ul>
      </details>

      {!swiss && <Crosstable tournament={t} />}
    </div>
  );
}

/** Круговая: кто как сыграл с каждым — строки и столбцы по стартовым номерам. */
function Crosstable({ tournament: t }: { tournament: Tournament }) {
  const tr = useT();
  const players = [...t.players].sort((a, b) => a.seed - b.seed);
  const cellFor = (row: string, col: string) =>
    t.rounds
      .flatMap((r) => r.games)
      .filter((g) => (g.white === row && g.black === col) || (g.white === col && g.black === row))
      .map((g) => {
        const p = pointsIn(g, row, 0);
        return p === undefined ? "·" : points(p);
      })
      .join(" ");
  return (
    <div className="overflow-x-auto rounded-3xl bg-surface p-3 shadow-card" data-crosstable>
      <table className="border-collapse text-center">
        <caption className="mb-2 text-left font-black">
          {tr("Кто с кем как сыграл", "Kim kim bilan qanday oʻynadi")}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="px-2 py-1 text-left text-sm text-muted">
              №
            </th>
            <th scope="col" className="px-2 py-1 text-left text-sm text-muted">
              {tr("Участник", "Ishtirokchi")}
            </th>
            {players.map((p) => (
              <th key={p.id} scope="col" className="min-w-9 px-1 py-1 text-sm text-muted">
                {p.seed}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((row) => (
            <tr key={row.id} className="border-t border-line/60">
              <td className="px-2 py-1.5 text-left text-sm font-bold text-muted">{row.seed}</td>
              <th scope="row" className="px-2 py-1.5 text-left font-extrabold whitespace-nowrap">
                {row.name}
              </th>
              {players.map((col) => (
                <td
                  key={col.id}
                  className={cn("px-1 py-1.5 font-bold tabular-nums", row.id === col.id && "bg-line/50")}
                >
                  {row.id === col.id ? "" : cellFor(row.id, col.id)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bracket({ tournament: t }: { tournament: Tournament }) {
  const tr = useT();
  const name = new Map(t.players.map((p) => [p.id, p.name]));
  const places = knockoutPlaces(t);
  const small = t.thirdPlace ? t.rounds[t.totalRounds - 1]?.games[1] : undefined;
  const match = (g: TGame, key: string | number) => {
    const winner = g.black === null ? null : winnerOf(g);
    const line = (id: string | null) => (
      <span className={cn("flex items-center justify-between gap-2", id && winner === id && "font-black")}>
        <span className="truncate">{id ? name.get(id) : tr("свободен", "ozod")}</span>
        {id && winner === id && <span aria-label={tr("прошёл дальше", "keyingi bosqichga oʻtdi")}>✓</span>}
      </span>
    );
    return (
      <li key={key} className="rounded-2xl border-2 border-line bg-surface px-3 py-2 text-sm font-semibold">
        {line(g.white)}
        <span className="my-1 block border-t border-line/60" />
        {g.black === null ? (
          <span className="text-muted">{tr("свободен от игры", "oʻyindan ozod")}</span>
        ) : (
          line(g.black)
        )}
      </li>
    );
  };
  return (
    <div className="space-y-5">
      {places.first && (
        <ol className="grid gap-3 rounded-3xl bg-sun-soft p-4 sm:grid-cols-3" data-places>
          {(
            [
              [tr("1 место", "1-oʻrin"), [places.first]],
              [tr("2 место", "2-oʻrin"), places.second ? [places.second] : []],
              [tr("3 место", "3-oʻrin"), places.third],
            ] as const
          )
            .filter(([, ids]) => ids.length > 0)
            .map(([label, ids]) => (
              <li key={label}>
                <span className="block text-sm font-extrabold text-sun-ink">{label}</span>
                <span className="block text-lg font-black">{ids.map((id) => name.get(id)).join(", ")}</span>
              </li>
            ))}
        </ol>
      )}
      <div className="overflow-x-auto pb-2" data-bracket>
        <div className="flex min-w-max gap-4">
          {Array.from({ length: t.totalRounds }, (_, r) => {
            const games = bracketGames(t, r);
            const expected = 2 ** (t.totalRounds - 1 - r);
            return (
              <section key={r} className="flex w-52 flex-col" aria-label={knockoutRoundName(expected, tr)}>
                <h3 className="mb-2 text-sm font-extrabold tracking-wide text-muted uppercase">
                  {knockoutRoundName(expected, tr)}
                </h3>
                <ol className="flex flex-1 flex-col justify-around gap-3">
                  {games.length ? (
                    games.map((g, i) => match(g, i))
                  ) : (
                    <li className="rounded-2xl border-2 border-dashed border-line px-3 py-4 text-center text-sm text-muted">
                      {tr("после предыдущего тура", "oldingi turdan keyin")}
                    </li>
                  )}
                </ol>
              </section>
            );
          })}
        </div>
      </div>
      {small && (
        <section aria-label={tr("Матч за третье место", "Uchinchi oʻrin uchun oʻyin")} className="max-w-xs">
          <h3 className="mb-2 text-sm font-extrabold tracking-wide text-muted uppercase">
            {tr("За третье место", "Uchinchi oʻrin uchun")}
          </h3>
          <ol>{match(small, "small")}</ol>
        </section>
      )}
    </div>
  );
}
