/**
 * «Тайны шахмат»: тексты по-русски и без ошибок, картинки и ссылки на месте,
 * загадка посла совпадает с настоящими ходами фигур, задача Дилярам разыграна кадр за кадром,
 * путешествие коня и зёрна считаются правильно, у каждого уровня есть легенда.
 */
import { Chess, type Square } from "chess.js";
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { chessImage } from "@/content/chess/images";
import {
  DID_YOU_KNOW,
  DILARAM,
  ENVOY_ROUNDS,
  PIECE_NAMES_RU,
  RIDDLES,
  SAGES,
  SECRETS,
  TURK_OPTIONS,
  formatBig,
  grainsOn,
  grainsUpTo,
  knightMoves,
  squareName,
  warnsdorffBest,
} from "@/content/chess/secrets";
import { parseFen } from "@/lib/engine/board";

const RU_MOVE = /(Кр|Ф|Л|С|К)?x?[a-h]?[1-8]?x?[a-h][1-8](=(Ф|Л|С|К))?[+#!?]*/g;

function checkText(id: string, text: string) {
  const plain = text.replace(RU_MOVE, " ");
  expect(plain.match(/[А-Яа-яЁё]+[A-Za-z]+[А-Яа-яЁё]*|[A-Za-z]+[А-Яа-яЁё]+/g), `${id}: ${text}`).toBeNull();
  expect(/неправильн/i.test(text), `${id}: ${text}`).toBe(false);
  expect(/ {2,}| [,.!?:;]/.test(text), `${id}: ${text}`).toBe(false);
  expect(/[А-Яа-яЁё]/.test(text), `${id}: ${text}`).toBe(true);
}

const HREF = /^\/chess(\/[a-z0-9-]+)*(#[a-z0-9-]+)?$/;

describe("тайны шахмат", () => {
  it("истории: крючок, текст, картинка, ссылка, без повторов", () => {
    expect(SECRETS.length).toBeGreaterThanOrEqual(12);
    const ids = SECRETS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SECRETS) {
      expect(s.hook.length, s.id).toBeGreaterThan(20);
      expect(s.story.length, s.id).toBeGreaterThanOrEqual(1);
      for (const t of [s.hook, s.title, s.when, ...s.story, s.deeper ?? ""]) if (t) checkText(s.id, t);
      if (s.image) expect(chessImage(s.image), `${s.id} → ${s.image}`).toBeDefined();
      if (s.link) expect(s.link.href, s.id).toMatch(HREF);
    }
    expect(SECRETS.filter((s) => s.widget).length).toBeGreaterThanOrEqual(5);
    expect(SECRETS.filter((s) => s.deeper).length).toBeGreaterThanOrEqual(10);
  });

  it("советы мудрецов, загадки и «знаешь ли ты»", () => {
    expect(SAGES.length).toBe(5);
    for (const s of SAGES) {
      for (const t of [s.name, s.where, s.fact, s.advice]) checkText(s.name, t);
      if (s.image) expect(chessImage(s.image), s.name).toBeDefined();
    }
    expect(RIDDLES.length).toBeGreaterThanOrEqual(6);
    for (const r of RIDDLES) {
      expect(r.options, r.text).toContain(r.answer);
      expect(new Set(r.options).size, r.text).toBe(r.options.length);
      for (const t of [r.text, r.why, ...r.options]) checkText(r.text, t);
    }
    expect(DID_YOU_KNOW.length).toBeGreaterThanOrEqual(20);
    for (const d of DID_YOU_KNOW) {
      checkText(d.q, d.q);
      checkText(d.q, d.a);
      if (d.href) expect(d.href, d.q).toMatch(HREF);
    }
    expect(TURK_OPTIONS.filter((o) => o.right).length).toBe(1);
  });

  it("загадка посла: показаны ровно те клетки, куда фигура ходит по правилам", () => {
    for (const r of ENVOY_ROUNDS) {
      const chess = new Chess();
      chess.clear();
      // Короли — подальше, чтобы не мешать и не стоять под ударом.
      const [wk, bk] = (r.piece === "r" ? ["g8", "b8"] : ["h8", "a8"]) as Square[];
      if (r.piece !== "k") chess.put({ type: "k", color: "w" }, wk);
      chess.put({ type: "k", color: "b" }, bk);
      chess.put({ type: r.piece, color: "w" }, r.from as Square);
      const moves = chess.moves({ square: r.from as Square, verbose: true }).map((m) => m.to);
      expect([...new Set(moves)].sort(), `${PIECE_NAMES_RU[r.piece]} ${r.from}`).toEqual([...r.targets].sort());
    }
    expect(new Set(ENVOY_ROUNDS.map((r) => r.piece)).size).toBe(6);
  });

  it("задача Дилярам: десять кадров, каждый кадр — ровно один ход, в конце мат конём", () => {
    expect(DILARAM.length).toBe(10);
    const count = (fen: string) => fen.split(" ")[0].replace(/[^a-zA-Z]/g, "").length;
    for (let i = 0; i < DILARAM.length; i++) {
      const f = DILARAM[i];
      expect(() => parseFen(f.fen), f.text).not.toThrow();
      checkText(`кадр ${i + 1}`, f.text);
      expect(f.fen.split(" ")[1]).toBe(i % 2 === 0 ? "w" : "b");
      if (i > 0) {
        const prev = DILARAM[i - 1].fen.split(" ")[0].split("/");
        const cur = f.fen.split(" ")[0].split("/");
        const changed = prev.filter((rank, k) => rank !== cur[k]).length;
        expect(changed, `кадр ${i + 1}`).toBeLessThanOrEqual(2);
        expect(count(f.fen), `кадр ${i + 1}`).toBeLessThanOrEqual(count(DILARAM[i - 1].fen));
      }
    }
    // Белые отдают обе ладьи: в начале их две, в конце — ни одной, а чёрный король под ударом коня на h6.
    expect(DILARAM[0].fen.split(" ")[0].split("R").length - 1).toBe(2);
    expect(DILARAM[9].fen.split(" ")[0]).not.toContain("R");
    const last = parseFen(DILARAM[9].fen);
    expect(last).toBeDefined();
    expect(DILARAM[9].fen.split(" ")[0].split("/")[2]).toBe("5P1N");
  });

  it("зёрна и конь считаются верно", () => {
    expect(grainsOn(1)).toBe(BigInt(1));
    expect(grainsOn(21).toString()).toBe("1048576");
    expect(grainsUpTo(64).toString()).toBe("18446744073709551615");
    expect(formatBig(grainsUpTo(64))).toBe("18 446 744 073 709 551 615");
    for (let sq = 0; sq < 64; sq++) {
      const chess = new Chess();
      chess.clear();
      const name = squareName(sq) as Square;
      chess.put({ type: "n", color: "w" }, name);
      // Короли — в углах, но не на клетке коня и не под его ударом.
      const taken = new Set([name, ...knightMoves(sq).map(squareName)]);
      const free = (cands: Square[]) => cands.find((c) => !taken.has(c)) as Square;
      chess.put({ type: "k", color: "w" }, free(["h8", "g8", "h7", "f8"]));
      chess.put({ type: "k", color: "b" }, free(["a1", "b1", "a2", "c1"]));
      const expected = chess
        .moves({ square: name, verbose: true })
        .map((m) => m.to)
        .sort();
      expect(knightMoves(sq).map(squareName).sort(), name).toEqual(expected);
    }
    // Правило Варнсдорфа из угла: единственные два хода — b3 и c2, у обоих одинаково мало продолжений.
    expect(
      warnsdorffBest(0, new Set([0]))
        .map(squareName)
        .sort(),
    ).toEqual(["b3", "c2"]);
    expect(warnsdorffBest(27, new Set([27, 10, 12, 17, 21, 33, 37, 42, 44]))).toEqual([]);
  });

  it("у каждого уровня — легенда с крючком, историей, картинкой и тайной", () => {
    for (const l of CHESS_LEVELS) {
      const g = l.legend;
      expect(g.hook, l.id).toMatch(/\?$/);
      expect(g.story.length, l.id).toBeGreaterThanOrEqual(2);
      expect(g.secret.length, l.id).toBeGreaterThan(40);
      expect(chessImage(g.image ?? ""), `${l.id} → ${g.image}`).toBeDefined();
      for (const t of [g.hook, g.title, g.secret, ...g.story]) checkText(l.id, t);
    }
  });
});
