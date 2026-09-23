import type { GraphPuzzle } from "@/content/types";

type Edge = GraphPuzzle["edges"][number];

export function edgeBetween(edges: Edge[], a: string, b: string): Edge | undefined {
  return edges.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
}

/** Алгоритм Дейкстры: кратчайшее время от start до всех вершин. */
export function shortestDistances(nodes: string[], edges: Edge[], start: string): Map<string, number> {
  const dist = new Map(nodes.map((n) => [n, Infinity] as [string, number]));
  dist.set(start, 0);
  const done = new Set<string>();
  while (done.size < nodes.length) {
    let best: string | null = null;
    for (const n of nodes) {
      if (!done.has(n) && (best === null || dist.get(n)! < dist.get(best)!)) best = n;
    }
    if (best === null || dist.get(best) === Infinity) break;
    done.add(best);
    for (const e of edges) {
      const other = e.a === best ? e.b : e.b === best ? e.a : null;
      if (other && !done.has(other)) {
        const d = dist.get(best)! + e.w;
        if (d < dist.get(other)!) dist.set(other, d);
      }
    }
  }
  return dist;
}

export function shortestTime(puzzle: Pick<GraphPuzzle, "nodes" | "edges" | "start" | "finish">): number {
  return shortestDistances(
    puzzle.nodes.map((n) => n.id),
    puzzle.edges,
    puzzle.start,
  ).get(puzzle.finish)!;
}

/** Время пути по списку вершин или null, если между соседними вершинами нет дороги. */
export function pathTime(edges: Edge[], path: string[]): number | null {
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const e = edgeBetween(edges, path[i - 1], path[i]);
    if (!e) return null;
    total += e.w;
  }
  return total;
}
