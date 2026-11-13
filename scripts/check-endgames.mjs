#!/usr/bin/env node
/**
 * Сверка эндшпильных позиций с таблицами окончаний (точный результат при лучшей игре обеих сторон).
 *
 *   node scripts/check-endgames.mjs           — сверить tests/fixtures/endgame-tablebase.json с таблицами
 *   node scripts/check-endgames.mjs --write   — записать в файл то, что отвечают таблицы
 *
 * Файл — посредник между уроками и таблицами: тесты (tests/endgame-pieces.test.ts) проверяют по нему, что верный
 * ход упражнения сохраняет результат позиции, а неверный — упускает. В CI скрипт не запускается: ему нужна сеть.
 * Новая позиция: добавь в файл запись `"<FEN>": { "moves": { "<ход UCI>": "" } }` и запусти с --write.
 * За прокси: NODE_USE_ENV_PROXY=1 node scripts/check-endgames.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../tests/fixtures/endgame-tablebase.json", import.meta.url);
const write = process.argv.includes("--write");
const data = JSON.parse(readFileSync(FILE, "utf8"));

/** Таблицы отвечают за того, кто ходит. Принимаем только точные ответы — без «выигрыша, если бы не правило 50 ходов». */
function exact(category, fen) {
  if (category === "win" || category === "draw" || category === "loss") return category;
  throw new Error(`Неточный ответ таблиц «${category}»: ${fen}`);
}
const flip = (r) => (r === "win" ? "loss" : r === "loss" ? "win" : "draw");

async function probe(fen) {
  const res = await fetch(`${data.source}?fen=${encodeURIComponent(fen)}`);
  if (!res.ok) throw new Error(`Таблицы ответили ${res.status}: ${fen}`);
  return res.json();
}

let bad = 0;
for (const [fen, saved] of Object.entries(data.positions)) {
  const answer = await probe(fen);
  const fresh = { result: exact(answer.category, fen), moves: {} };
  for (const uci of Object.keys(saved.moves ?? {})) {
    const move = answer.moves.find((m) => m.uci === uci);
    if (!move) throw new Error(`Нет хода ${uci}: ${fen}`);
    // После хода таблицы отвечают за соперника — переворачиваем.
    fresh.moves[uci] = flip(exact(move.category, fen));
  }
  if (JSON.stringify(fresh) !== JSON.stringify({ result: saved.result, moves: saved.moves ?? {} })) {
    bad++;
    console.log(
      `${write ? "обновлено" : "РАСХОЖДЕНИЕ"}: ${fen}\n  в файле:  ${JSON.stringify(saved)}\n  таблицы: ${JSON.stringify(fresh)}`,
    );
  }
  data.positions[fen] = fresh;
  // Не чаще нескольких запросов в секунду: сервис общий и бесплатный.
  await new Promise((r) => setTimeout(r, 300));
}

const total = Object.keys(data.positions).length;
if (write) {
  writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
  console.log(`Записано позиций: ${total}.`);
} else if (bad) {
  console.log(`Расхождений: ${bad} из ${total}.`);
  process.exit(1);
} else console.log(`Все ${total} позиций совпадают с таблицами.`);
