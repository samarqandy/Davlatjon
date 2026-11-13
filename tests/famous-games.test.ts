/**
 * Знаменитые партии, вторая часть (от Ласкера до Гукеша): темы, перевод и то, что комментарии говорят о вариантах.
 * Сами записи партий проигрываются по правилам в tests/chess-content.test.ts; здесь — сверка с тем, что известно
 * о партии (число ходов, последний ход), и проверка слов «если возьмёт — мат», «фигура связана», «двойной удар».
 */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { chessContent } from "@/content/chess/content";
import { FAMOUS_GAMES, GAME_TAGS } from "@/content/chess/games";
import { MORE_GAMES } from "@/content/chess/gamesMore";
import { gamesUz } from "@/content/chess/uz/games";

const game = (id: string) => {
  const g = FAMOUS_GAMES.find((x) => x.id === id);
  if (!g) throw new Error(`нет партии ${id}`);
  return g;
};
/** Позиция после n полуходов партии и, если нужно, ходов «а что, если». */
function at(id: string, plies: number, ...extra: string[]): Chess {
  const c = new Chess();
  for (const m of game(id).moves.slice(0, plies)) c.move(m);
  for (const m of extra) c.move(m);
  return c;
}
const count = (c: Chess, color: "w" | "b", type: string) =>
  c
    .board()
    .flat()
    .filter((p) => p?.color === color && p.type === type).length;

describe("знаменитые партии: темы", () => {
  it("в библиотеке 16 партий; у каждой есть тема, у каждой темы — партия", () => {
    expect(FAMOUS_GAMES).toHaveLength(16);
    expect(MORE_GAMES).toHaveLength(8);
    for (const g of FAMOUS_GAMES) {
      expect(g.tags.length, g.id).toBeGreaterThan(0);
      expect(new Set(g.tags).size, g.id).toBe(g.tags.length);
      for (const tag of g.tags) expect(GAME_TAGS, `${g.id}: ${tag}`).toContain(tag);
    }
    for (const tag of GAME_TAGS)
      expect(
        FAMOUS_GAMES.some((g) => g.tags.includes(tag)),
        tag,
      ).toBe(true);
  });

  it("новые партии — настоящие, с годом и портретами; идут по порядку лет", () => {
    const years = MORE_GAMES.map((g) => g.year!);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    for (const g of MORE_GAMES) {
      expect(g.year, g.id).toBeGreaterThan(1850);
      expect(g.pictures?.length, g.id).toBeGreaterThan(0);
      expect(g.story.length, g.id).toBe(2);
      expect(Object.keys(g.comments).length, g.id).toBeGreaterThanOrEqual(7);
      expect(g.facts.length, g.id).toBe(2);
    }
  });
});

describe("знаменитые партии: записи сходятся с известным о партии", () => {
  it.each([
    ["lasker-bauer", 38, "Qxd3", "1-0"],
    ["steinitz-bardeleben", 25, "Rxh7+", "1-0"],
    ["botvinnik-capablanca", 41, "Kh5", "1-0"],
    ["fischer-spassky", 41, "Qf4", "1-0"],
    ["deep-blue-kasparov", 19, "c4", "1-0"],
    ["kasimdzhanov-adams", 40, "Ke3", "1-0"],
    ["carlsen-karjakin", 50, "Qh6+", "1-0"],
    ["ding-gukesh", 58, "Ke5", "0-1"],
  ] as const)("%s: %i ходов, последний ход %s, результат %s", (id, moves, last, result) => {
    const g = game(id);
    expect(Math.ceil(g.moves.length / 2)).toBe(moves);
    expect(g.moves.at(-1)).toBe(last);
    expect(g.result).toBe(result);
  });
});

describe("знаменитые партии: комментарии говорят правду", () => {
  it("Ласкер — Бауэр: две жертвы слона с шахом и взятием, угроза мата, двойной удар ферзя", () => {
    const g = game("lasker-bauer");
    expect(g.moves[28]).toBe("Bxh7+");
    expect(g.moves[32]).toBe("Bxg7");
    // 19. Лf3: грозит Лh3+ с матом (после любого «спокойного» хода единственная защита — закрыться слоном).
    const threat = at("lasker-bauer", 37, "a5", "Rh3+");
    expect(threat.moves()).toEqual(["Bh4"]);
    expect(at("lasker-bauer", 37, "a5", "Rh3+", "Bh4", "Rxh4#").isCheckmate()).toBe(true);
    // 22. Фd7: под ударом оба слона.
    const fork = at("lasker-bauer", 43);
    expect(fork.isAttacked("b7", "w") && fork.isAttacked("e7", "w")).toBe(true);
    // В конце: ферзь и пешки против ладьи.
    const end = at("lasker-bauer", g.moves.length);
    expect([count(end, "w", "q"), count(end, "b", "q"), count(end, "b", "r")]).toEqual([1, 0, 1]);
    expect(count(end, "w", "p") - count(end, "b", "p")).toBeGreaterThanOrEqual(4);
  });

  it("Стейниц — Барделебен: рокировка теряет коня; ладью нельзя взять; показанный вариант кончается матом", () => {
    // 14. Лe1: после рокировки конь e7 без защиты.
    expect(() => at("steinitz-bardeleben", 27, "O-O", "Rxe7")).not.toThrow();
    // 22. Лxe7+ Фxe7 23. Лxc8+ — белые остаются с лишним конём.
    const taken = at("steinitz-bardeleben", 43, "Qxe7", "Rxc8+", "Rxc8", "Qxc8+", "Qd8", "Qxd8+", "Kxd8");
    expect([count(taken, "w", "n"), count(taken, "b", "n"), count(taken, "b", "r")]).toEqual([1, 0, 0]);
    // 22... Крf8: ферзь g4 под боем, и грозит Лxc1+ с матом по первой горизонтали.
    const danger = at("steinitz-bardeleben", 44);
    expect(danger.isAttacked("g4", "b")).toBe(true);
    expect(at("steinitz-bardeleben", 44, "Qxd7", "Rxc1+", "Re1", "Rxe1#").isCheckmate()).toBe(true);
    // 23. Лf7+: король взять не может (ладью защищает конь), а после Фxf7 теряется ладья c8.
    const again = at("steinitz-bardeleben", 45);
    expect(again.moves()).not.toContain("Kxf7");
    expect(() => at("steinitz-bardeleben", 45, "Qxf7", "Rxc8+")).not.toThrow();
    // Вариант Стейница: мат на 35-м ходу.
    const line = "Kg8 Rg7+ Kh8 Qh4+ Kxg7 Qh7+ Kf8 Qh8+ Ke7 Qg7+ Ke8 Qg8+ Ke7 Qf7+ Kd8 Qf8+ Qe8 Nf7+ Kd7 Qd6#";
    const mate = at("steinitz-bardeleben", 49, ...line.split(" "));
    expect(mate.isCheckmate()).toBe(true);
    expect(mate.moveNumber()).toBe(35);
  });

  it("Ботвинник — Капабланка: коня h5 берёт только пешка; в конце полезных шахов нет", () => {
    // 31. Кh5+: конь f6 связан ферзём e5 — взять может только пешка g6.
    const check = at("botvinnik-capablanca", 61);
    expect(check.moves().filter((m) => m.includes("x"))).toEqual(["gxh5"]);
    // 27. fxe6: проходная на e6, до превращения два шага.
    expect(at("botvinnik-capablanca", 53).get("e6")).toEqual({ type: "p", color: "w" });
    // 34. e7 и финал: пешка на e7, у чёрных нет шаха, после которого её можно остановить.
    const end = at("botvinnik-capablanca", 81);
    expect(end.get("e7")).toEqual({ type: "p", color: "w" });
    expect(end.isCheck()).toBe(false);
  });

  it("Фишер — Спасский: слон b5 держит d7; после e6 чёрные фигуры на двух горизонталях; в конце под ударом h6", () => {
    const pin = at("fischer-spassky", 27);
    expect(pin.get("b8")).toEqual({ type: "n", color: "b" });
    expect(pin.isAttacked("d7", "w")).toBe(true);
    const cramped = at("fischer-spassky", 61);
    for (const row of cramped.board())
      for (const p of row) if (p?.color === "b" && p.type !== "p") expect(["7", "8"]).toContain(p.square[1]);
    expect(game("fischer-spassky").moves[74]).toBe("Rxf6");
    expect(at("fischer-spassky", 81).isAttacked("h6", "w")).toBe(true);
  });

  it("Deep Blue — Каспаров: коня ферзём брать нельзя (связка); чёрные отдали ферзя за ладью и слона", () => {
    // 9... Фxe6? 10. Лe1 — ферзь связан: уйти с линии e не может.
    const pinned = at("deep-blue-kasparov", 17, "Qxe6", "Re1");
    for (const m of pinned.moves({ square: "e6", verbose: true })) expect(m.to[0]).toBe("e");
    // 10. Сg6+: король уходит и теряет рокировку.
    expect(at("deep-blue-kasparov", 20).getCastlingRights("b")).toEqual({ k: false, q: false });
    const end = at("deep-blue-kasparov", 37);
    expect([count(end, "w", "q"), count(end, "b", "q")]).toEqual([1, 0]);
    expect(end.isAttacked("d5", "w")).toBe(true);
  });

  it("Касымджанов — Адамс: ферзи разменяны на 9-м ходу; после Лg6 конь без защиты, а слон держится на коне", () => {
    const early = at("kasimdzhanov-adams", 19);
    expect(count(early, "w", "q") + count(early, "b", "q")).toBe(0);
    const g6 = at("kasimdzhanov-adams", 65);
    expect(g6.isAttacked("e6", "w")).toBe(true);
    expect(g6.isAttacked("e6", "b")).toBe(false);
    expect(g6.isAttacked("f4", "w") && g6.isAttacked("f4", "b")).toBe(true);
    // После 35. Сxf4: у белых слон, у чёрных на две пешки больше.
    const piece = at("kasimdzhanov-adams", 69);
    expect([count(piece, "w", "b"), count(piece, "b", "b"), count(piece, "b", "n")]).toEqual([1, 0, 0]);
    expect(count(piece, "b", "p") - count(piece, "w", "p")).toBe(2);
  });

  it("Карлсен — Карякин: чёрные грозили матом на g2; после жертвы ферзя оба взятия ведут к мату", () => {
    expect(at("carlsen-karjakin", 96, "h6", "Qg2#").isCheckmate()).toBe(true);
    const sac = at("carlsen-karjakin", 99);
    expect(sac.moves().sort()).toEqual(["Kxh6", "gxh6"]);
    expect(at("carlsen-karjakin", 99, "Kxh6", "Rh8#").isCheckmate()).toBe(true);
    expect(at("carlsen-karjakin", 99, "gxh6", "Rxf7#").isCheckmate()).toBe(true);
  });

  it("Дин — Гукеш: лишняя пешка на одном фланге; слону из угла некуда; в конце оппозиция", () => {
    const rooks = at("ding-gukesh", 60);
    expect(count(rooks, "w", "q") + count(rooks, "b", "q")).toBe(0);
    expect(count(rooks, "b", "p") - count(rooks, "w", "p")).toBe(1);
    for (const row of rooks.board()) for (const p of row) if (p?.type === "p") expect("fgh").toContain(p.square[0]);
    // 56... Сd5: все поля слона a8 под ударом.
    const corner = at("ding-gukesh", 112);
    for (const m of corner.moves({ square: "a8", verbose: true }))
      expect(corner.isAttacked(m.to, "b"), m.to).toBe(true);
    // Финал: короли e3 и e5 друг против друга, ход белых; у чёрных пешкой больше.
    const end = at("ding-gukesh", 116);
    expect(end.fen().split(" ").slice(0, 2)).toEqual(["8/8/8/4kp2/6p1/4K1P1/8/8", "w"]);
  });
});

describe("знаменитые партии: узбекский перевод", () => {
  it("у каждой партии переведены все комментарии, моменты, история и факты; кириллицы нет", () => {
    const uz = chessContent("uz").games;
    for (const g of FAMOUS_GAMES) {
      const overlay = (gamesUz as Record<string, { comments?: Record<string, string> } | undefined>)[g.id];
      expect(overlay, g.id).toBeDefined();
      const u = uz.find((x) => x.id === g.id)!;
      expect(Object.keys(overlay!.comments ?? {}).sort(), g.id).toEqual(Object.keys(g.comments).sort());
      expect(
        u.keyMoments.map((k) => k.ply),
        g.id,
      ).toEqual(g.keyMoments.map((k) => k.ply));
      expect(u.story.length, g.id).toBe(g.story.length);
      expect(u.facts.length, g.id).toBe(g.facts.length);
      expect(u.moves, g.id).toEqual(g.moves);
      const text = JSON.stringify([
        u.title,
        u.white,
        u.black,
        u.place,
        u.event ?? "",
        u.era,
        u.story,
        u.comments,
        u.keyMoments,
        u.lesson,
        u.facts,
      ]);
      expect(text, g.id).not.toMatch(/[а-яё]/i);
    }
  });
});
