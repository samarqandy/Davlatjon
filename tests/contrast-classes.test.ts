/**
 * Белый текст на светло-зелёной заливке не читается: на `mint` и `success` (#10b981) его контраст — 2,5:1 при норме
 * 4,5:1. Так была покрашена кнопка «готово» и значки «решено»; увидеть это можно было только в состояниях
 * с прогрессом, куда проверка доступности в браузере не заходит. Под белый текст — `bg-success-fill`.
 */
import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";

const ROOT = process.cwd();

function files(dir: string): string[] {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return files(rel);
    return /\.tsx?$/.test(e.name) ? [rel] : [];
  });
}

/** Заливка целиком: не `bg-mint-soft`, не `bg-mint/40`, не `hover:bg-mint`. */
const LIGHT_GREEN_FILL = /(^|[\s"'`])bg-(?:mint|success)(?![-/\w])/;
const WHITE_TEXT = /(^|[\s"'`])text-white(?![-/\w])/;

it("белый текст не стоит на светло-зелёной заливке", () => {
  const hits: string[] = [];
  for (const file of files("src")) {
    fs.readFileSync(path.join(ROOT, file), "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (LIGHT_GREEN_FILL.test(line) && WHITE_TEXT.test(line))
          hits.push(`${file}:${i + 1}: ${line.trim().slice(0, 120)}`);
      });
  }
  expect(hits).toEqual([]);
});
