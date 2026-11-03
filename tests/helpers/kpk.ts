/**
 * Ретроградный решатель эндшпиля «король и пешка против короля» (белые с пешкой).
 * Перебирает все позиции и находит, где белые выигрывают. Превращение — выигрыш, если нового ферзя
 * нельзя сразу взять и это не пат. Нужен тестам курса: проверяет ответы в уроках об оппозиции и квадрате.
 */
const sq = (s: string) => s.charCodeAt(0) - 97 + (Number(s[1]) - 1) * 8;
const file = (i: number) => i % 8;
const rank = (i: number) => Math.floor(i / 8);
const adj = (a: number, b: number) => a !== b && Math.abs(file(a) - file(b)) <= 1 && Math.abs(rank(a) - rank(b)) <= 1;
const kmoves = (k: number) => {
  const out: number[] = [];
  for (let df = -1; df <= 1; df++)
    for (let dr = -1; dr <= 1; dr++) {
      if (!df && !dr) continue;
      const x = file(k) + df;
      const y = rank(k) + dr;
      if (x >= 0 && x < 8 && y >= 0 && y < 8) out.push(y * 8 + x);
    }
  return out;
};
const pawnAttacks = (p: number) => {
  const out: number[] = [];
  if (rank(p) < 7) {
    if (file(p) > 0) out.push(p + 7);
    if (file(p) < 7) out.push(p + 9);
  }
  return out;
};
const idx = (wk: number, bk: number, p: number) => (wk * 64 + bk) * 64 + p;
const valid = (wk: number, bk: number, p: number, white: boolean) =>
  wk !== bk &&
  wk !== p &&
  bk !== p &&
  rank(p) >= 1 &&
  rank(p) <= 6 &&
  !adj(wk, bk) &&
  (!white || !pawnAttacks(p).includes(bk));

function queenAttacks(q: number, s: number, blockers: number[]): boolean {
  const dx = Math.sign(file(s) - file(q));
  const dy = Math.sign(rank(s) - rank(q));
  const aligned =
    file(s) === file(q) || rank(s) === rank(q) || Math.abs(file(s) - file(q)) === Math.abs(rank(s) - rank(q));
  if (!aligned || s === q) return false;
  let x = file(q) + dx;
  let y = rank(q) + dy;
  while (x !== file(s) || y !== rank(s)) {
    if (blockers.includes(y * 8 + x)) return false;
    x += dx;
    y += dy;
  }
  return true;
}

function promotionWins(wk: number, bk: number, q: number): boolean {
  if (adj(bk, q) && !adj(wk, q)) return false;
  if (queenAttacks(q, bk, [wk])) return true;
  const stalemate = kmoves(bk).every(
    (k) => adj(k, wk) || k === wk || (k !== q && queenAttacks(q, k, [wk])) || (k === q && adj(wk, q)),
  );
  return !stalemate;
}

let table: [Uint8Array, Uint8Array] | null = null;

function solve(): [Uint8Array, Uint8Array] {
  const N = 64 * 64 * 64;
  const w = new Uint8Array(N);
  const b = new Uint8Array(N);
  let changed = true;
  while (changed) {
    changed = false;
    for (let wk = 0; wk < 64; wk++)
      for (let bk = 0; bk < 64; bk++)
        for (let p = 8; p < 56; p++) {
          const i = idx(wk, bk, p);
          if (!w[i] && valid(wk, bk, p, true)) {
            let win = false;
            for (const k of kmoves(wk)) if (k !== p && k !== bk && !adj(k, bk) && b[idx(k, bk, p)]) win = true;
            const one = p + 8;
            if (!win && one !== wk && one !== bk) {
              if (rank(one) === 7) win = promotionWins(wk, bk, one);
              else {
                win = !!b[idx(wk, bk, one)];
                const two = p + 16;
                if (!win && rank(p) === 1 && two !== wk && two !== bk) win = !!b[idx(wk, bk, two)];
              }
            }
            if (win) {
              w[i] = 1;
              changed = true;
            }
          }
          if (!b[i] && valid(wk, bk, p, false)) {
            const moves = kmoves(bk).filter((k) => k !== wk && !adj(k, wk) && !pawnAttacks(p).includes(k));
            if (moves.length && moves.every((k) => k !== p && w[idx(wk, k, p)])) {
              b[i] = 1;
              changed = true;
            }
          }
        }
  }
  return [w, b];
}

/** Выигрывают ли белые: короли wk, bk, белая пешка p, ход toMove. */
export function kpkWins(wk: string, bk: string, p: string, toMove: "w" | "b"): boolean {
  table ??= solve();
  return !!table[toMove === "w" ? 0 : 1][idx(sq(wk), sq(bk), sq(p))];
}
