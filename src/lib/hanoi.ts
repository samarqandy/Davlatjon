/**
 * Ханойская башня. Состояние — три стержня, на каждом кольца снизу вверх
 * (число — размер кольца: 1 — самое маленькое).
 */
export type HanoiState = number[][];

export function hanoiStart(disks: number): HanoiState {
  return [Array.from({ length: disks }, (_, i) => disks - i), [], []];
}

export function topDisk(peg: readonly number[]): number | undefined {
  return peg[peg.length - 1];
}

/** Можно ли переложить верхнее кольцо со стержня from на стержень to. */
export function canMove(state: HanoiState, from: number, to: number): boolean {
  if (from === to) return false;
  const disk = topDisk(state[from]);
  if (disk === undefined) return false;
  const under = topDisk(state[to]);
  return under === undefined || under > disk;
}

export function moveDisk(state: HanoiState, from: number, to: number): HanoiState {
  if (!canMove(state, from, to)) return state;
  const next = state.map((peg) => [...peg]);
  next[to].push(next[from].pop()!);
  return next;
}

/** Башня собрана на правом стержне. */
export function hanoiSolved(state: HanoiState, disks: number): boolean {
  return state[2].length === disks;
}

const key = (s: HanoiState) => s.map((peg) => peg.join(",")).join("|");

/** Наименьшее число ходов — поиск в ширину по всем расположениям колец. */
export function shortestHanoi(disks: number): number {
  const start = hanoiStart(disks);
  const dist = new Map([[key(start), 0]]);
  const queue = [start];
  while (queue.length) {
    const s = queue.shift()!;
    const d = dist.get(key(s))!;
    if (hanoiSolved(s, disks)) return d;
    for (let from = 0; from < 3; from++) {
      for (let to = 0; to < 3; to++) {
        if (!canMove(s, from, to)) continue;
        const n = moveDisk(s, from, to);
        if (!dist.has(key(n))) {
          dist.set(key(n), d + 1);
          queue.push(n);
        }
      }
    }
  }
  return Infinity;
}
