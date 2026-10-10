/** Партия по сети: ходы, часы, итоги, имена и сообщения. */
import { describe, expect, it } from "vitest";
import {
  START_FEN,
  applyAction,
  canMate,
  checkMessage,
  checkUsername,
  isError,
  newGameRow,
  pairKey,
  remainingMs,
  settle,
  timeControlOf,
  viewOf,
  type Action,
  type GameRow,
} from "@/lib/online";

const T0 = 1_000_000;
const tc = (id: string) => timeControlOf(id)!;
const fresh = (id = "10+0"): GameRow =>
  applyAction(
    newGameRow({ id: "g1", white: "u1", black: "u2", invitedBy: "u1", tc: tc(id), now: T0 }),
    "u2",
    { type: "accept" },
    T0,
  ) as GameRow;

function play(row: GameRow, moves: [string, string, number?][]): GameRow {
  let cur = row;
  for (const [user, uci, at] of moves) {
    const next = applyAction(cur, user, { type: "move", uci }, at ?? T0);
    if (isError(next)) throw new Error(`${uci}: ${next}`);
    cur = next;
  }
  return cur;
}

describe("приглашение", () => {
  it("принимает только приглашённый; отказаться могут оба", () => {
    const row = newGameRow({ id: "g", white: "u1", black: "u2", invitedBy: "u1", tc: tc("none"), now: T0 });
    expect(applyAction(row, "u1", { type: "accept" }, T0)).toBe("not-yours");
    expect(applyAction(row, "u3", { type: "accept" }, T0)).toBe("not-yours");
    expect((applyAction(row, "u2", { type: "accept" }, T0) as GameRow).status).toBe("active");
    expect((applyAction(row, "u1", { type: "decline" }, T0) as GameRow).status).toBe("declined");
  });

  it("неотвеченное приглашение через неделю устаревает", () => {
    const row = newGameRow({ id: "g", white: "u1", black: "u2", invitedBy: "u1", tc: tc("none"), now: T0 });
    expect(settle(row, T0 + 8 * 86_400_000).status).toBe("declined");
  });
});

describe("ходы", () => {
  it("ходят по очереди, неверный ход отклоняется", () => {
    const row = fresh();
    expect(applyAction(row, "u2", { type: "move", uci: "e7e5" }, T0)).toBe("not-your-turn");
    expect(applyAction(row, "u1", { type: "move", uci: "e2e5" }, T0)).toBe("illegal");
    expect(applyAction(row, "u1", { type: "move", uci: "xx" }, T0)).toBe("illegal");
    const next = play(row, [["u1", "e2e4"]]);
    expect(next.fen).toContain("4P3");
    expect(next.moves).toEqual(["e2e4"]);
  });

  it("мат — победа походившего; превращение пешки в указанную фигуру", () => {
    const mate = play(fresh("none"), [
      ["u1", "f2f3"],
      ["u2", "e7e5"],
      ["u1", "g2g4"],
      ["u2", "d8h4"],
    ]);
    expect(mate.status).toBe("finished");
    expect(mate.result).toBe("0-1");
    expect(mate.reason).toBe("checkmate");
    expect(applyAction(mate, "u1", { type: "move", uci: "a2a3" }, T0)).toBe("not-active");
  });

  it("повтор позиции трижды — ничья", () => {
    const shuffle: [string, string][] = [
      ["u1", "g1f3"],
      ["u2", "g8f6"],
      ["u1", "f3g1"],
      ["u2", "f6g8"],
    ];
    const row = play(
      fresh("none"),
      [...shuffle, ...shuffle].map((m) => [m[0], m[1]] as [string, string]),
    );
    expect(row.status).toBe("finished");
    expect(row.reason).toBe("repetition");
    expect(row.result).toBe("1/2-1/2");
  });
});

describe("часы", () => {
  it("не идут, пока оба не сделали по ходу; потом тратят время ходящего и прибавляют добавку", () => {
    const row = fresh("15+10");
    const two = play(row, [
      ["u1", "e2e4", T0 + 60_000],
      ["u2", "e7e5", T0 + 90_000],
    ]);
    expect(remainingMs(two, T0 + 90_000)).toEqual({ w: 900_000, b: 900_000 });
    expect(two.clockAt).toBe(T0 + 90_000);
    const three = play(two, [["u1", "g1f3", T0 + 100_000]]);
    // Белые потратили 10 с и получили 10 с добавки.
    expect(three.whiteMs).toBe(900_000);
    expect(remainingMs(three, T0 + 130_000).b).toBe(870_000);
  });

  it("упало время — проигрыш, а если у соперника нечем ставить мат — ничья", () => {
    const row = play(fresh("5+0"), [
      ["u1", "e2e4"],
      ["u2", "e7e5"],
    ]);
    const late = settle(row, T0 + 301_000);
    expect(late.status).toBe("finished");
    expect(late.reason).toBe("timeout");
    expect(late.result).toBe("0-1");
    expect(applyAction(row, "u1", { type: "move", uci: "g1f3" }, T0 + 301_000)).toBe("not-active");
    expect(canMate("8/8/8/8/8/8/k7/K7 w - - 0 1", "w")).toBe(false);
    // Один слон против голого короля мат не поставит; против короля с пешкой — теоретически может.
    expect(canMate("8/8/8/8/8/8/k7/KB6 w - - 0 1", "w")).toBe(false);
    expect(canMate("8/8/8/8/8/p7/8/KB5k w - - 0 1", "w")).toBe(true);
    expect(canMate("8/8/8/8/8/p7/8/KB5k w - - 0 1", "b")).toBe(true);
  });
});

describe("сдача, ничья, отмена", () => {
  it("сдаться, предложить и принять ничью, отменить в самом начале", () => {
    const row = fresh("none");
    expect((applyAction(row, "u1", { type: "abort" }, T0) as GameRow).reason).toBe("aborted");
    const mid = play(row, [
      ["u1", "e2e4"],
      ["u2", "e7e5"],
    ]);
    expect(applyAction(mid, "u1", { type: "abort" }, T0)).toBe("cannot-abort");
    const offered = applyAction(mid, "u1", { type: "draw-offer" }, T0) as GameRow;
    expect(offered.drawBy).toBe("w");
    expect(applyAction(offered, "u1", { type: "draw-accept" }, T0)).toBe("no-draw-offer");
    expect((applyAction(offered, "u2", { type: "draw-accept" }, T0) as GameRow).result).toBe("1/2-1/2");
    expect((applyAction(offered, "u2", { type: "draw-decline" }, T0) as GameRow).drawBy).toBeNull();
    // Любой ход снимает предложение.
    expect(play(offered, [["u1", "g1f3"]]).drawBy).toBeNull();
    const resigned = applyAction(mid, "u2", { type: "resign" }, T0) as GameRow;
    expect(resigned.result).toBe("1-0");
    expect(resigned.reason).toBe("resign");
  });

  it("посторонний ничего не может", () => {
    const actions: Action[] = [{ type: "resign" }, { type: "move", uci: "e2e4" }, { type: "draw-offer" }];
    for (const a of actions) expect(applyAction(fresh(), "stranger", a, T0)).toBe("not-yours");
  });
});

describe("вид партии", () => {
  it("показывает, за кого играет смотрящий и сколько осталось времени", () => {
    const row = fresh("5+0");
    const v = viewOf(row, "u2", { w: "ann", b: "bek" }, T0);
    expect(v.you).toBe("b");
    expect(v.white).toBe("ann");
    expect(v.fen).toBe(START_FEN);
    expect(v.clock.w).toBe(300_000);
    expect(viewOf(row, "nobody", { w: "a", b: "b" }, T0).you).toBeNull();
  });
});

describe("имена и сообщения", () => {
  it("имя: латиница, цифры, «_», 3–16 знаков; запрещённые слова и служебные имена — нет", () => {
    expect(checkUsername(" @Aziz_07 ")).toEqual({ ok: true, name: "aziz_07" });
    expect(checkUsername("ab")).toEqual({ ok: false, error: "format" });
    expect(checkUsername("1abc")).toEqual({ ok: false, error: "format" });
    expect(checkUsername("Азиз")).toEqual({ ok: false, error: "format" });
    expect(checkUsername("admin_01")).toEqual({ ok: false, error: "reserved" });
    expect(checkUsername("f_u_c_k")).toEqual({ ok: false, error: "word" });
    expect(checkUsername("chess_kid")).toEqual({ ok: true, name: "chess_kid" });
  });

  it("сообщение: без ссылок, телефонов, почты и грубых слов; лишние пробелы убираются", () => {
    expect(checkMessage("  Давай   сыграем!  ")).toEqual({ ok: true, text: "Давай сыграем!" });
    expect(checkMessage("Yaxshi yurish 👍")).toMatchObject({ ok: true });
    expect(checkMessage("   ")).toEqual({ ok: false, error: "empty" });
    expect(checkMessage("zaxodi https://x.com")).toEqual({ ok: false, error: "link" });
    expect(checkMessage("pishi mne v telegram")).toEqual({ ok: false, error: "link" });
    expect(checkMessage("мой номер 90 123 45 67")).toEqual({ ok: false, error: "contact" });
    expect(checkMessage("a@b")).toEqual({ ok: false, error: "contact" });
    expect(checkMessage("ты М У Д А К")).toEqual({ ok: false, error: "word" });
    expect(checkMessage("x".repeat(500))).toMatchObject({ ok: true });
    expect((checkMessage("x".repeat(500)) as { text: string }).text).toHaveLength(200);
  });

  it("ключ пары не зависит от порядка", () => {
    expect(pairKey("b", "a")).toBe(pairKey("a", "b"));
  });
});
