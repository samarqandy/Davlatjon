/**
 * Круговая система: расписание по таблицам Бергера (Справочник ФИДЕ, C.05, приложение 1).
 * Номера участников — стартовые (seed). При нечётном числе участников старший номер таблицы — «свободен от игры».
 */
import type { TGame, TRound } from "./types";

/**
 * Туры таблицы Бергера для n участников в номерах 1…n. Пара — [белые, чёрные]; у нечётного n вместо
 * несуществующего номера стоит null: его соперник в этом туре свободен.
 *
 * Правило таблицы: номер size неподвижен и меняет цвет через тур, остальные идут по кругу;
 * первая доска тура r — номер s = ((r − 1)·size/2 mod (size − 1)) + 1, дальше белые s+1, s+2…, чёрные s−1, s−2…
 */
export function bergerRounds(n: number): [number, number | null][][] {
  const size = n % 2 === 0 ? n : n + 1;
  const m = size - 1;
  const wrap = (x: number) => ((((x - 1) % m) + m) % m) + 1;
  const real = (x: number) => (x > n ? null : x);
  const rounds: [number, number | null][][] = [];
  for (let r = 1; r <= m; r++) {
    const s = (((r - 1) * (size / 2)) % m) + 1;
    const pairs: [number, number | null][] = [];
    const top: [number, number] = r % 2 === 1 ? [s, size] : [size, s];
    const [w, b] = top;
    // Свободный от игры записывается как «участник — null», кто бы ни стоял белыми в таблице.
    if (real(w) === null) pairs.push([b, null]);
    else pairs.push([w, real(b)]);
    for (let k = 1; k < size / 2; k++) pairs.push([wrap(s + k), wrap(s - k)]);
    rounds.push(pairs);
  }
  return rounds;
}

/**
 * Расписание турнира: ids[i] — участник со стартовым номером i + 1.
 * Два круга: второй круг — те же пары со сменой цвета, а два последних тура первого круга меняются местами,
 * чтобы никто не играл три партии подряд одним цветом (рекомендация того же приложения).
 */
export function roundRobinRounds(ids: readonly string[], double = false): TRound[] {
  const table = bergerRounds(ids.length);
  const toRound = (pairs: [number, number | null][], flip: boolean): TRound => {
    const games = pairs.map(([w, b]): TGame => {
      if (b === null) return { white: ids[w - 1], black: null };
      return flip ? { white: ids[b - 1], black: ids[w - 1] } : { white: ids[w - 1], black: ids[b - 1] };
    });
    // Свободный от игры — в конце списка: номера досок идут только по настоящим партиям.
    return { games: [...games.filter((g) => g.black !== null), ...games.filter((g) => g.black === null)] };
  };
  const first = table.map((pairs) => toRound(pairs, false));
  if (!double) return first;
  if (first.length >= 2) {
    const last = first.length - 1;
    [first[last - 1], first[last]] = [first[last], first[last - 1]];
  }
  return [...first, ...table.map((pairs) => toRound(pairs, true))];
}
