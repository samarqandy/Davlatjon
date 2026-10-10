/** Друзья, партии и переписка поверх настоящего Postgres (PGlite — тот же SQL, что на Neon). */
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { timeControlOf } from "@/lib/online";
import { playStore, type PlayStore, type Profile } from "@/lib/server/playStore";

let db: PGlite;
let now: number;
let store: PlayStore;

// Запуск Postgres в памяти занимает несколько секунд — один раз на файл, а между тестами таблицы очищаются.
beforeAll(async () => {
  db = new PGlite();
  store = playStore(
    async (text, params) => (await db.query(text, params as unknown[])).rows as Record<string, unknown>[],
    () => now,
  );
  await store.ensure();
}, 60_000);

beforeEach(async () => {
  now = 1_800_000_000_000;
  await db.exec("truncate lab_profiles, lab_friends, lab_games, lab_messages, lab_reads restart identity");
});

afterAll(async () => {
  await db.close();
});

async function user(id: string, name: string): Promise<Profile> {
  const res = await store.setUsername(id, name);
  if ("error" in res) throw new Error(res.error);
  return res.profile;
}

async function befriend(a: Profile, b: Profile) {
  await store.requestFriend(a, b.username);
  await store.respondFriend(b, a.username, "accept");
}

describe("имя в игре", () => {
  it("уникально без учёта регистра; свой аккаунт может сменить имя", async () => {
    const ann = await user("google:1", "Ann_K");
    expect(ann.username).toBe("ann_k");
    expect(await store.setUsername("tg:2", "ANN_K")).toEqual({ error: "taken" });
    expect(await store.setUsername("tg:2", "ab")).toEqual({ error: "invalid-name" });
    expect(await store.setUsername("tg:2", "admin1")).toEqual({ error: "reserved-name" });
    const renamed = await store.setUsername("google:1", "ann_new");
    expect("profile" in renamed && renamed.profile.username).toBe("ann_new");
    expect((await user("tg:2", "ann_k")).username).toBe("ann_k");
  });
});

describe("поиск и дружба", () => {
  it("ищет по началу имени, не показывает себя, скрытых и заблокировавших", async () => {
    const ann = await user("u1", "anna_chess");
    const bek = await user("u2", "bek_king");
    await user("u3", "bekzod");
    const hidden = await user("u4", "bek_hidden");
    await store.setPrefs(hidden.userId, { findable: false });
    expect(await store.search(ann, "be")).toEqual({ error: "short" });
    const hits = (await store.search(ann, "BEK")) as { username: string; relation: string }[];
    expect(hits.map((h) => h.username)).toEqual(["bek_king", "bekzod"]);
    expect((await store.search(bek, "bek")) as unknown[]).toHaveLength(1);
    await store.respondFriend(bek, "anna_chess", "block");
    expect(((await store.search(ann, "bek")) as { username: string }[]).map((h) => h.username)).toEqual(["bekzod"]);
    expect(await store.requestFriend(ann, "bek_king")).toEqual({ error: "blocked" });
  });

  it("просьба → согласие; встречная просьба сразу делает друзьями; нельзя себя и скрытых", async () => {
    const ann = await user("u1", "anna");
    const bek = await user("u2", "bekzod");
    expect(await store.requestFriend(ann, "anna")).toEqual({ error: "self" });
    expect(await store.requestFriend(ann, "nobody")).toEqual({ error: "no-user" });
    expect(await store.requestFriend(ann, "bekzod")).toEqual({ status: "pending" });
    expect(await store.requestFriend(ann, "bekzod")).toEqual({ status: "pending" });
    expect((await store.friends(ann)).outgoing).toEqual([{ username: "bekzod" }]);
    expect((await store.friends(bek)).incoming).toEqual([{ username: "anna" }]);
    expect(await store.respondFriend(ann, "bekzod", "accept")).toEqual({ error: "not-friends" });
    expect(await store.requestFriend(bek, "anna")).toEqual({ status: "accepted" });
    expect((await store.friends(ann)).friends.map((f) => f.username)).toEqual(["bekzod"]);
    expect(await store.requestFriend(ann, "bekzod")).toEqual({ error: "already" });
    await store.respondFriend(ann, "bekzod", "remove");
    expect((await store.friends(bek)).friends).toEqual([]);
  });

  it("«в сети» — кто был на сайте в последние полторы минуты", async () => {
    const ann = await user("u1", "anna");
    const bek = await user("u2", "bekzod");
    await befriend(ann, bek);
    await db.query("update lab_profiles set last_seen = to_timestamp($1 / 1000.0) where user_id = 'u2'", [
      now - 30_000,
    ]);
    expect((await store.friends(ann)).friends[0].online).toBe(true);
    await db.query("update lab_profiles set last_seen = to_timestamp($1 / 1000.0) where user_id = 'u2'", [
      now - 200_000,
    ]);
    expect((await store.friends(ann)).friends[0].online).toBe(false);
  });
});

describe("партии", () => {
  it("вызвать можно только друга; принять — только приглашённый; ходы по очереди", async () => {
    const ann = await user("u1", "anna");
    const bek = await user("u2", "bekzod");
    const eve = await user("u3", "eve_x");
    const tc = timeControlOf("10+0")!;
    expect(await store.createGame(ann, "bekzod", "w", tc)).toEqual({ error: "not-friends" });
    await befriend(ann, bek);
    const made = await store.createGame(ann, "bekzod", "w", tc);
    if (!("game" in made)) throw new Error(made.error);
    const id = made.game.id;
    expect(made.game).toMatchObject({ status: "invited", you: "w", white: "anna", black: "bekzod" });
    expect(await store.act(ann, id, { type: "accept" })).toEqual({ error: "not-yours" });
    expect(await store.getGame(eve, id)).toEqual({ error: "not-found" });
    const accepted = await store.act(bek, id, { type: "accept" });
    expect("game" in accepted && accepted.game.status).toBe("active");
    expect(await store.act(bek, id, { type: "move", uci: "e7e5" })).toEqual({ error: "not-your-turn" });
    const moved = await store.act(ann, id, { type: "move", uci: "e2e4" });
    expect("game" in moved && moved.game.moves).toEqual(["e2e4"]);
    const seen = await store.getGame(bek, id);
    expect("game" in seen && seen.game).toMatchObject({ you: "b", turn: "b", moves: ["e2e4"] });
    expect((await store.myGames(bek)).map((g) => g.id)).toEqual([id]);
  });

  it("время игрока, закрывшего вкладку, всё равно выходит", async () => {
    const ann = await user("u1", "anna");
    const bek = await user("u2", "bekzod");
    await befriend(ann, bek);
    const made = await store.createGame(ann, "bekzod", "w", timeControlOf("5+0")!);
    if (!("game" in made)) throw new Error("no game");
    const id = made.game.id;
    await store.act(bek, id, { type: "accept" });
    await store.act(ann, id, { type: "move", uci: "e2e4" });
    await store.act(bek, id, { type: "move", uci: "e7e5" });
    now += 301_000;
    const after = await store.getGame(bek, id);
    expect("game" in after && after.game).toMatchObject({ status: "finished", result: "0-1", reason: "timeout" });
    expect(await store.act(ann, id, { type: "move", uci: "g1f3" })).toEqual({ error: "not-active" });
  });

  it("лимит одновременных партий и выключатель «играть по сети»", async () => {
    const ann = await user("u1", "anna");
    const bek = await user("u2", "bekzod");
    await befriend(ann, bek);
    const tc = timeControlOf("none")!;
    for (let i = 0; i < 6; i++) expect("game" in (await store.createGame(ann, "bekzod", "random", tc))).toBe(true);
    expect(await store.createGame(ann, "bekzod", "w", tc)).toEqual({ error: "limit" });
    const off = (await store.setPrefs("u2", { onlineOk: false }))!;
    expect(off.onlineOk).toBe(false);
    expect(await store.createGame(await user("u1", "anna"), "bekzod", "w", tc)).toEqual({ error: "off" });
  });
});

describe("переписка", () => {
  it("только друзья, чистый текст, непрочитанные, ограничение частоты, выключатель", async () => {
    const ann = await user("u1", "anna");
    const bek = await user("u2", "bekzod");
    expect(await store.sendMessage(ann, "bekzod", "Salom")).toEqual({ error: "not-friends" });
    await befriend(ann, bek);
    expect(await store.sendMessage(ann, "bekzod", "mening raqamim 90 123 45 67")).toEqual({ error: "contact" });
    expect("id" in (await store.sendMessage(ann, "bekzod", "Salom!"))).toBe(true);
    expect("id" in (await store.sendMessage(ann, "bekzod", "Сыграем?"))).toBe(true);
    expect((await store.friends(bek)).friends[0].unread).toBe(2);
    const read = await store.messages(bek, "anna");
    expect("messages" in read && read.messages.map((m) => [m.mine, m.text])).toEqual([
      [false, "Salom!"],
      [false, "Сыграем?"],
    ]);
    expect((await store.friends(bek)).friends[0].unread).toBe(0);
    const again = await store.messages(ann, "bekzod", 0);
    expect("messages" in again && again.messages.every((m) => m.mine)).toBe(true);
    for (let i = 0; i < 13; i++) await store.sendMessage(ann, "bekzod", `m${i}`);
    expect(await store.sendMessage(ann, "bekzod", "ещё")).toEqual({ error: "rate" });
    await store.setPrefs("u2", { chatOk: false });
    expect(await store.sendMessage(ann, "bekzod", "hello")).toEqual({ error: "chat-off" });
  });
});
