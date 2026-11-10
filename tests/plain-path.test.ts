/**
 * Адрес без языка: при сборке сервер видит /ru/… и /uz/…, браузер — адрес без языка. Нижнее меню сравнивает
 * адрес со списком разделов, поэтому оба вида должны давать одно и то же (иначе сервер и браузер рисуют разное).
 */
import { describe, expect, it } from "vitest";
import { plainPath } from "@/lib/lang";

describe("plainPath", () => {
  it("убирает язык в начале адреса", () => {
    expect(plainPath("/ru")).toBe("/");
    expect(plainPath("/uz/")).toBe("/");
    expect(plainPath("/ru/chess")).toBe("/chess");
    expect(plainPath("/uz/chess/puzzles/")).toBe("/chess/puzzles");
  });

  it("адрес без языка не меняет, кроме косой черты в конце", () => {
    expect(plainPath("/")).toBe("/");
    expect(plainPath("/achievements")).toBe("/achievements");
    expect(plainPath("/my-problems/")).toBe("/my-problems");
  });

  it("не трогает разделы, которые только начинаются с «ru» или «uz»", () => {
    expect(plainPath("/rules")).toBe("/rules");
    expect(plainPath("/uzbek/page")).toBe("/uzbek/page");
  });
});
