/**
 * Уроки, которые сначала были ступенью 3, а по книгам М.И. Глотова относятся к ступени 4 «Ладья».
 * Прогресс по ним хранился под id «c3-…» — переносим его на «c4-…», чтобы решённое не пропало.
 * Новые уроки ступени 3 «Слон» не используют эти имена, поэтому перенос можно делать при каждой загрузке.
 */
export const MOVED_TO_STEP_4: ReadonlySet<string> = new Set([
  "horwitz",
  "horwitz-g7",
  "horwitz-h7",
  "seventh",
  "seventh-choose",
  "seventh-mate",
  "two-rooks",
  "two-rooks-mate",
  "passed",
  "passed-choose",
  "passed-attack",
  "passed-attack-mate",
  "passed-quiz",
  "phalanx",
  "phalanx-quiz",
  "weak-squares",
  "weak-knight",
  "weak-attack",
  "weak-attack-mate",
  "opposition",
  "opposition-choose",
  "zugzwang-quiz",
  "square",
  "square-choose",
  "breakthrough",
  "breakthrough-choose",
  "kpk-lead",
  "kpk-lead-choose",
  "kpk-defend",
  "kpk-defend-choose",
  "rook-pawn",
  "rook-pawn-choose",
  "rook-pawn-quiz",
  "shoulder",
  "shoulder-choose",
  "outside-passer",
  "outside-passer-quiz",
  "good-bad",
  "bad-bishop-moves",
  "activity-quiz",
  "stalemate",
  "stalemate-trap",
  "stalemate-save",
  "perpetual",
  "perpetual-choose",
  "two-bishops",
  "two-bishops-f6",
  "two-bishops-e5",
  "study",
  "study-underpromote",
  "final-test",
  "final-bishops",
  "final-king",
  "final-stalemate",
  "final-quiz",
]);

export function migrateCourseIds<V>(chess: Record<string, V>): Record<string, V> {
  let out: Record<string, V> | null = null;
  for (const [key, value] of Object.entries(chess)) {
    if (!key.startsWith("c3-") || !MOVED_TO_STEP_4.has(key.slice(3))) continue;
    out ??= { ...chess };
    const target = `c4-${key.slice(3)}`;
    if (!(target in out)) out[target] = value;
    delete out[key];
  }
  return out ?? chess;
}
