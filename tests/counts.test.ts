import { expect, it } from "vitest";
import { TASK_COUNT } from "@/content/counts";
import { allDays } from "@/content/program";

it("TASK_COUNT совпадает с числом задач в программе", () => {
  expect(TASK_COUNT).toBe(allDays().reduce((n, d) => n + d.tasks.length, 0));
});
