/** Задачи «каждому — своё»: одну карточку нельзя поставить в две строки, счёт «N из M» не выдаётся. */
import { describe, expect, it } from "vitest";
import { allDays } from "@/content/program";
import { isOneToOne } from "@/lib/checks";

const assigns = allDays().flatMap((d) =>
  d.tasks.flatMap((t) => (t.answer.kind === "assign" ? [{ id: t.id, spec: t.answer }] : [])),
);

describe("isOneToOne", () => {
  it("кто в каком домике живёт — «каждому своё»; выбор знака («<», «=», «>») — нет", () => {
    expect(assigns.find((a) => a.id === "w1d1t3")).toBeTruthy();
    expect(isOneToOne(assigns.find((a) => a.id === "w1d1t3")!.spec)).toBe(true);
    const signs = assigns.find((a) => a.id === "w1d3t3" || a.spec.options.some((o) => o.id === "lt"));
    expect(signs && isOneToOne(signs.spec)).toBe(false);
  });

  it("если ответы повторяются или карточек больше, чем строк, это не «каждому своё»", () => {
    const spec = assigns[0].spec;
    expect(
      isOneToOne({ ...spec, correct: Object.fromEntries(spec.items.map((i) => [i.id, spec.options[0].id])) }),
    ).toBe(false);
    expect(isOneToOne({ ...spec, options: [...spec.options, { id: "extra", label: "x" }] })).toBe(false);
  });
});
