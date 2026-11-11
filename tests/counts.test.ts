import { expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { LEVEL_EXERCISE_IDS } from "@/content/chess/levelIds";
import { TASK_COUNT } from "@/content/counts";
import { allDays } from "@/content/program";

it("TASK_COUNT совпадает с числом задач в программе", () => {
  expect(TASK_COUNT).toBe(allDays().reduce((n, d) => n + d.tasks.length, 0));
});

it("LEVEL_EXERCISE_IDS совпадает с упражнениями шести званий — по порядку", () => {
  expect(Object.keys(LEVEL_EXERCISE_IDS)).toEqual(CHESS_LEVELS.map((l) => l.id));
  for (const level of CHESS_LEVELS) expect(LEVEL_EXERCISE_IDS[level.id]).toEqual(level.exercises.map((e) => e.id));
});
