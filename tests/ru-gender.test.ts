/**
 * Русский текст, обращённый к ребёнку, не должен «определять» его пол: «ты нашёл», «я справился», «подумай сам».
 * Проверка читает исходные файлы построчно: комментарии, раздел родителя и узбекские тексты пропускаются,
 * реплики роботов и персонажей — в списке разрешённых.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function files(dir: string): string[] {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return files(rel);
    return /\.(ts|tsx)$/.test(e.name) ? [rel] : [];
  });
}

const SCANNED = [
  ...files("src/components").filter((f) => !f.startsWith("src/components/parent/")),
  ...files("src/content").filter(
    (f) =>
      !/\.uz\.ts$/.test(f) &&
      !f.startsWith("src/content/chess/uz/") &&
      !/^src\/content\/(guide|review)\.ts$/.test(f) &&
      !/^src\/content\/uz/.test(f),
  ),
  "src/lib/feedback.ts",
];

/** Что считаем «мужским» обращением к ребёнку. */
const PATTERNS: RegExp[] = [
  /(^|[^а-яё])(ты|я)\s+(?:уже\s+|сегодня\s+|так\s+|всё\s+|все\s+|наконец\s+|тоже\s+|сначала\s+|потом\s+|правильно\s+|точно\s+|первым\s+|первой\s+)?[а-яё]{3,}(?:л|лся)(?![а-яё])/i,
  /(^|[^а-яё])(застрял|нашёл|нашел|справился|молодец)(?![а-яё])/i,
  /(?:подумай|попробуй|реши|сделай|найди|проверь|придумай|посчитай)(?:\s+[а-яё]+)?\s+сам(?![а-яё])/i,
  /(^|[^а-яё])готов\?/i,
];

/** Строки, где «нашёл», «решил» и т. п. — про робота, персонажа или взрослого. */
const THIRD_PERSON =
  /(?:[Рр]обот|Детектив|Незнайка|тренер|Кемпелен|Фирдоуси|мудрец|Хосров|раджа|царь|король|ферзь|конь|Авербах|Эйлер|Али говорит|🙂|МОЛОДЕЦ|[Рр]ебёнок|Покажите|Хороший повод|Я задумал|Учёный)/;

describe("русский текст не определяет пол ребёнка", () => {
  it("в детских текстах нет «ты нашёл», «справился», «подумай сам»", () => {
    const hits: string[] = [];
    for (const file of SCANNED) {
      const lines = fs.readFileSync(path.join(ROOT, file), "utf8").split("\n");
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (/^(\/\/|\*|\/\*)/.test(trimmed)) return;
        const code = line.replace(/\s\/\/.*$/, "");
        if (THIRD_PERSON.test(code)) return;
        if (PATTERNS.some((p) => p.test(code))) hits.push(`${file}:${i + 1}: ${trimmed.slice(0, 120)}`);
      });
    }
    expect(hits).toEqual([]);
  });
});
