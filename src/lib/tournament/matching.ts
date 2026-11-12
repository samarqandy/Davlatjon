/**
 * Наибольшее паросочетание в произвольном графе (алгоритм Эдмондса со «сжатием цветков», O(V³)).
 * Нужен швейцарской системе: прежде чем поставить пару, проверяем, что остальных ещё можно разбить на пары, —
 * так жеребьёвка не заходит в тупик и не требует перебора.
 */

/** adj[v] — соседи вершины v. Возвращает match[v] — пара вершины или -1. */
export function maxMatching(n: number, adj: readonly (readonly number[])[]): number[] {
  const match = new Array<number>(n).fill(-1);
  const parent = new Array<number>(n).fill(-1);
  const base = new Array<number>(n).fill(0);
  const used = new Array<boolean>(n).fill(false);
  const blossom = new Array<boolean>(n).fill(false);
  const queue: number[] = [];

  const lca = (a: number, b: number): number => {
    const seen = new Array<boolean>(n).fill(false);
    for (;;) {
      a = base[a];
      seen[a] = true;
      if (match[a] === -1) break;
      a = parent[match[a]];
    }
    for (;;) {
      b = base[b];
      if (seen[b]) return b;
      b = parent[match[b]];
    }
  };

  const markPath = (v: number, b: number, child: number) => {
    while (base[v] !== b) {
      blossom[base[v]] = true;
      blossom[base[match[v]]] = true;
      parent[v] = child;
      child = match[v];
      v = parent[match[v]];
    }
  };

  const findPath = (root: number): number => {
    used.fill(false);
    parent.fill(-1);
    for (let i = 0; i < n; i++) base[i] = i;
    queue.length = 0;
    queue.push(root);
    used[root] = true;
    for (let head = 0; head < queue.length; head++) {
      const v = queue[head];
      for (const to of adj[v]) {
        if (base[v] === base[to] || match[v] === to) continue;
        if (to === root || (match[to] !== -1 && parent[match[to]] !== -1)) {
          const cur = lca(v, to);
          blossom.fill(false);
          markPath(v, cur, to);
          markPath(to, cur, v);
          for (let i = 0; i < n; i++)
            if (blossom[base[i]]) {
              base[i] = cur;
              if (!used[i]) {
                used[i] = true;
                queue.push(i);
              }
            }
        } else if (parent[to] === -1) {
          parent[to] = v;
          if (match[to] === -1) return to;
          used[match[to]] = true;
          queue.push(match[to]);
        }
      }
    }
    return -1;
  };

  // Жадное начало: большинство вершин получает пару сразу, поиск путей нужен немногим.
  for (let v = 0; v < n; v++)
    if (match[v] === -1)
      for (const to of adj[v])
        if (match[to] === -1) {
          match[v] = to;
          match[to] = v;
          break;
        }

  for (let v = 0; v < n; v++) {
    if (match[v] !== -1) continue;
    let end = findPath(v);
    while (end !== -1) {
      const prev = parent[end];
      const next = match[prev];
      match[end] = prev;
      match[prev] = end;
      end = next;
    }
  }
  return match;
}

/** Сколько пар в наибольшем паросочетании. */
export function matchingSize(n: number, adj: readonly (readonly number[])[]): number {
  return maxMatching(n, adj).filter((m) => m !== -1).length / 2;
}
