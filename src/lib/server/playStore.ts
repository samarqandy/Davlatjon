import { randomBytes } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  MAX_MESSAGE,
  MIN_SEARCH,
  applyAction,
  checkMessage,
  checkUsername,
  isError,
  newGameRow,
  pairKey,
  settle,
  sideOf,
  viewOf,
  type Action,
  type GameError,
  type GameRow,
  type GameView,
  type TimeControl,
} from "@/lib/online";
import { SCHEMA as PROGRESS_SCHEMA, type SqlQuery } from "./progressStore";

/**
 * Игра по сети: профили с именами, друзья, партии и переписка. Всё лежит в той же базе Neon, что и прогресс.
 * Таблицы создаются сами при первом обращении. Только для сервера.
 */
const SCHEMA = [
  PROGRESS_SCHEMA,
  `create table if not exists lab_profiles (
    user_id text primary key,
    username text not null,
    online_ok boolean not null default true,
    chat_ok boolean not null default true,
    findable boolean not null default true,
    last_seen timestamptz not null default now(),
    created_at timestamptz not null default now()
  )`,
  `create unique index if not exists lab_profiles_username on lab_profiles (username)`,
  `create table if not exists lab_friends (
    pair text primary key,
    a text not null,
    b text not null,
    status text not null,
    by text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create index if not exists lab_friends_a on lab_friends (a)`,
  `create index if not exists lab_friends_b on lab_friends (b)`,
  `create table if not exists lab_games (
    id text primary key,
    white text not null,
    black text not null,
    invited_by text not null,
    status text not null,
    moves jsonb not null default '[]'::jsonb,
    fen text not null,
    base_s int not null,
    inc_s int not null,
    white_ms bigint not null,
    black_ms bigint not null,
    clock_at bigint not null default 0,
    draw_by text,
    result text,
    reason text,
    version int not null default 0,
    created_ms bigint not null,
    updated_at timestamptz not null default now()
  )`,
  `create index if not exists lab_games_white on lab_games (white)`,
  `create index if not exists lab_games_black on lab_games (black)`,
  `create table if not exists lab_messages (
    id bigserial primary key,
    pair text not null,
    sender text not null,
    body text not null,
    created_at timestamptz not null default now()
  )`,
  `create index if not exists lab_messages_pair on lab_messages (pair, id)`,
  `create table if not exists lab_reads (
    user_id text not null,
    pair text not null,
    last_id bigint not null default 0,
    primary key (user_id, pair)
  )`,
];

/** Считаем «в сети» того, кто что-то делал на сайте в последние полторы минуты. */
export const ONLINE_MS = 90_000;
export const MAX_FRIENDS = 50;
export const MAX_PENDING_OUT = 20;
export const MAX_OPEN_GAMES = 6;
export const MESSAGES_PER_MINUTE = 15;

export interface Profile {
  userId: string;
  username: string;
  onlineOk: boolean;
  chatOk: boolean;
  findable: boolean;
}

export interface FriendEntry {
  username: string;
  online: boolean;
  chatOk: boolean;
  unread: number;
}

export interface FriendsView {
  friends: FriendEntry[];
  incoming: { username: string }[];
  outgoing: { username: string }[];
}

export interface SearchHit {
  username: string;
  relation: "none" | "friend" | "incoming" | "outgoing";
}

export type PlayError =
  | GameError
  | "no-profile"
  | "no-user"
  | "taken"
  | "invalid-name"
  | "reserved-name"
  | "bad-name"
  | "off"
  | "self"
  | "blocked"
  | "not-friends"
  | "limit"
  | "already"
  | "conflict"
  | "chat-off"
  | "rate"
  | "empty"
  | "link"
  | "contact"
  | "word"
  | "short";

export interface Message {
  id: number;
  mine: boolean;
  text: string;
  at: number;
}

const bool = (v: unknown) => v === true || v === "t" || v === "true";
const num = (v: unknown) => Number(v);
const newId = () => randomBytes(8).toString("base64url").replace(/[-_]/g, "x").toLowerCase().slice(0, 10);

function rowToGame(r: Record<string, unknown>): GameRow {
  return {
    id: String(r.id),
    white: String(r.white),
    black: String(r.black),
    invitedBy: String(r.invited_by),
    status: r.status as GameRow["status"],
    moves: (typeof r.moves === "string" ? JSON.parse(r.moves) : r.moves) as string[],
    fen: String(r.fen),
    baseS: num(r.base_s),
    incS: num(r.inc_s),
    whiteMs: num(r.white_ms),
    blackMs: num(r.black_ms),
    clockAt: num(r.clock_at),
    drawBy: (r.draw_by as GameRow["drawBy"]) ?? null,
    result: (r.result as GameRow["result"]) ?? null,
    reason: (r.reason as GameRow["reason"]) ?? null,
    version: num(r.version),
    createdAt: num(r.created_ms),
  };
}

function isUnique(error: unknown): boolean {
  const e = error as { code?: string; message?: string } | null;
  return e?.code === "23505" || /duplicate key|unique constraint/i.test(String(e?.message ?? error));
}

export function playStore(query: SqlQuery, clock: () => number = Date.now) {
  let ready: Promise<unknown> | null = null;
  const ensure = () =>
    (ready ??= (async () => {
      for (const sql of SCHEMA) await query(sql);
    })().catch(async () => {
      // Два первых запроса сразу: второй мог споткнуться о только что созданную таблицу.
      for (const sql of SCHEMA) await query(sql);
    })).catch((error: unknown) => {
      ready = null;
      throw error;
    });
  const q = async (text: string, params?: unknown[]) => {
    await ensure();
    return query(text, params);
  };

  const profileOf = (r: Record<string, unknown>): Profile => ({
    userId: String(r.user_id),
    username: String(r.username),
    onlineOk: bool(r.online_ok),
    chatOk: bool(r.chat_ok),
    findable: bool(r.findable),
  });

  const profileById = async (userId: string): Promise<Profile | null> => {
    const rows = await q("select * from lab_profiles where user_id = $1", [userId]);
    return rows[0] ? profileOf(rows[0]) : null;
  };
  const profileByName = async (username: string): Promise<Profile | null> => {
    const rows = await q("select * from lab_profiles where username = $1", [username]);
    return rows[0] ? profileOf(rows[0]) : null;
  };

  /** Отношение двух аккаунтов: строка из lab_friends или null. */
  const link = async (a: string, b: string) => {
    const rows = await q("select status, by from lab_friends where pair = $1", [pairKey(a, b)]);
    return rows[0] ? { status: String(rows[0].status), by: String(rows[0].by) } : null;
  };

  const namesOf = async (ids: string[]): Promise<Map<string, string>> => {
    const unique = [...new Set(ids)];
    const rows = unique.length
      ? await q("select user_id, username from lab_profiles where user_id = any($1)", [unique])
      : [];
    return new Map(rows.map((r) => [String(r.user_id), String(r.username)]));
  };

  const loadGame = async (id: string): Promise<GameRow | null> => {
    const rows = await q("select * from lab_games where id = $1", [id]);
    return rows[0] ? rowToGame(rows[0]) : null;
  };

  /** Записать партию, если с момента чтения никто её не менял. */
  const saveGame = async (row: GameRow): Promise<boolean> => {
    const rows = await q(
      `update lab_games set status=$2, moves=$3::jsonb, fen=$4, white_ms=$5, black_ms=$6, clock_at=$7,
         draw_by=$8, result=$9, reason=$10, version=version+1, updated_at=now()
       where id=$1 and version=$11 returning id`,
      [
        row.id,
        row.status,
        JSON.stringify(row.moves),
        row.fen,
        row.whiteMs,
        row.blackMs,
        row.clockAt,
        row.drawBy,
        row.result,
        row.reason,
        row.version,
      ],
    );
    return rows.length > 0;
  };

  return {
    ensure,
    /**
     * Удалить всё, что связано с аккаунтом: прогресс всех профилей, имя в игре, друзей, партии и переписку.
     * Возвращает, сколько записей прогресса стёрто (для проверки).
     */
    async deleteAccount(userId: string): Promise<number> {
      await q(
        `delete from lab_messages where sender = $1
           or pair in (select pair from lab_friends where a = $1 or b = $1)`,
        [userId],
      );
      await q("delete from lab_friends where a = $1 or b = $1", [userId]);
      await q("delete from lab_games where white = $1 or black = $1", [userId]);
      await q("delete from lab_reads where user_id = $1", [userId]);
      await q("delete from lab_profiles where user_id = $1", [userId]);
      const gone = await q(
        "delete from lab_progress where user_id = $1 or left(user_id, length($1) + 1) = $1 || '#' returning user_id",
        [userId],
      );
      return gone.length;
    },
    profileById,
    profileByName,

    /** Выбрать имя в игре. Меняя имя, друзья и партии остаются: они привязаны к аккаунту, а не к имени. */
    async setUsername(userId: string, raw: unknown): Promise<{ profile: Profile } | { error: PlayError }> {
      const checked = checkUsername(raw);
      if (!checked.ok) {
        return {
          error:
            checked.error === "format" ? "invalid-name" : checked.error === "reserved" ? "reserved-name" : "bad-name",
        };
      }
      try {
        await q(
          `insert into lab_profiles (user_id, username) values ($1, $2)
           on conflict (user_id) do update set username = excluded.username`,
          [userId, checked.name],
        );
      } catch (error) {
        if (isUnique(error)) return { error: "taken" };
        throw error;
      }
      return { profile: (await profileById(userId))! };
    },

    async setPrefs(userId: string, prefs: { onlineOk?: boolean; chatOk?: boolean; findable?: boolean }) {
      await q(
        `update lab_profiles set online_ok = coalesce($2, online_ok), chat_ok = coalesce($3, chat_ok),
           findable = coalesce($4, findable) where user_id = $1`,
        [userId, prefs.onlineOk ?? null, prefs.chatOk ?? null, prefs.findable ?? null],
      );
      return profileById(userId);
    },

    /** «Я на сайте»: не чаще раза в 20 секунд. */
    async touch(userId: string) {
      await q(
        "update lab_profiles set last_seen = now() where user_id = $1 and last_seen < now() - interval '20 seconds'",
        [userId],
      );
    },

    async search(me: Profile, rawQuery: unknown): Promise<SearchHit[] | { error: PlayError }> {
      const text = typeof rawQuery === "string" ? rawQuery.trim().toLowerCase().replace(/^@/, "") : "";
      if (text.length < MIN_SEARCH) return { error: "short" };
      const like = `${text.replace(/[\\%_]/g, "\\$&")}%`;
      const rows = await q(
        `select p.user_id, p.username, f.status, f.by from lab_profiles p
         left join lab_friends f on f.pair = case when p.user_id < $1 then p.user_id || '|' || $1 else $1 || '|' || p.user_id end
         where p.username like $2 and p.user_id <> $1 and p.findable and p.online_ok
           and coalesce(f.status, '') <> 'blocked'
         order by (p.username = $3) desc, p.username limit 8`,
        [me.userId, like, text],
      );
      return rows.map((r) => ({
        username: String(r.username),
        relation: !r.status
          ? "none"
          : r.status === "accepted"
            ? "friend"
            : r.by === me.userId
              ? "outgoing"
              : "incoming",
      }));
    },

    async friends(me: Profile): Promise<FriendsView> {
      const rows = await q(
        `select f.pair, f.status, f.by, p.username, p.chat_ok, p.last_seen,
           (select count(*) from lab_messages m where m.pair = f.pair and m.sender <> $1
              and m.id > coalesce((select last_id from lab_reads r where r.user_id = $1 and r.pair = f.pair), 0)) as unread
         from lab_friends f
         join lab_profiles p on p.user_id = case when f.a = $1 then f.b else f.a end
         where (f.a = $1 or f.b = $1) and f.status <> 'blocked'
         order by p.username`,
        [me.userId],
      );
      const now = clock();
      const out: FriendsView = { friends: [], incoming: [], outgoing: [] };
      for (const r of rows) {
        const username = String(r.username);
        if (r.status === "accepted") {
          out.friends.push({
            username,
            online: now - new Date(r.last_seen as string | Date).getTime() < ONLINE_MS,
            chatOk: bool(r.chat_ok),
            unread: num(r.unread),
          });
        } else if (r.by === me.userId) out.outgoing.push({ username });
        else out.incoming.push({ username });
      }
      out.friends.sort((x, y) => Number(y.online) - Number(x.online) || x.username.localeCompare(y.username));
      return out;
    },

    /** Попросить дружбы. Если человек уже просил нас — это согласие. */
    async requestFriend(
      me: Profile,
      rawName: unknown,
    ): Promise<{ status: "pending" | "accepted" } | { error: PlayError }> {
      if (!me.onlineOk) return { error: "off" };
      const name = typeof rawName === "string" ? rawName.trim().toLowerCase().replace(/^@/, "") : "";
      const target = name ? await profileByName(name) : null;
      if (!target || !target.findable || !target.onlineOk) return { error: "no-user" };
      if (target.userId === me.userId) return { error: "self" };
      const existing = await link(me.userId, target.userId);
      if (existing?.status === "blocked") return { error: "blocked" };
      if (existing?.status === "accepted") return { error: "already" };
      if (existing?.status === "pending" && existing.by === me.userId) return { status: "pending" };
      if (existing?.status === "pending") {
        await q("update lab_friends set status = 'accepted', updated_at = now() where pair = $1", [
          pairKey(me.userId, target.userId),
        ]);
        return { status: "accepted" };
      }
      const counts = await q(
        `select count(*) filter (where status = 'accepted') as friends, count(*) filter (where status = 'pending' and by = $1) as pending
         from lab_friends where a = $1 or b = $1`,
        [me.userId],
      );
      if (num(counts[0]?.friends) >= MAX_FRIENDS || num(counts[0]?.pending) >= MAX_PENDING_OUT)
        return { error: "limit" };
      const [a, b] = me.userId < target.userId ? [me.userId, target.userId] : [target.userId, me.userId];
      await q(
        `insert into lab_friends (pair, a, b, status, by) values ($1, $2, $3, 'pending', $4) on conflict (pair) do nothing`,
        [pairKey(a, b), a, b, me.userId],
      );
      return { status: "pending" };
    },

    /** Ответ на просьбу, удаление из друзей, блокировка. */
    async respondFriend(
      me: Profile,
      rawName: unknown,
      action: "accept" | "decline" | "remove" | "block" | "unblock",
    ): Promise<{ ok: true } | { error: PlayError }> {
      const name = typeof rawName === "string" ? rawName.trim().toLowerCase() : "";
      const other = name ? await profileByName(name) : null;
      if (!other) return { error: "no-user" };
      const pair = pairKey(me.userId, other.userId);
      const existing = await link(me.userId, other.userId);
      if (action === "block") {
        const [a, b] = me.userId < other.userId ? [me.userId, other.userId] : [other.userId, me.userId];
        await q(
          `insert into lab_friends (pair, a, b, status, by) values ($1, $2, $3, 'blocked', $4)
           on conflict (pair) do update set status = 'blocked', by = excluded.by, updated_at = now()`,
          [pair, a, b, me.userId],
        );
        return { ok: true };
      }
      if (!existing) return { error: "not-friends" };
      if (action === "unblock") {
        if (existing.status === "blocked" && existing.by === me.userId)
          await q("delete from lab_friends where pair = $1", [pair]);
        return { ok: true };
      }
      if (existing.status === "blocked") return { error: "blocked" };
      if (action === "accept") {
        if (existing.status !== "pending" || existing.by === me.userId) return { error: "not-friends" };
        await q("update lab_friends set status = 'accepted', updated_at = now() where pair = $1", [pair]);
        return { ok: true };
      }
      // decline / remove — одно и то же: связь исчезает (кто просил — может попросить снова).
      await q("delete from lab_friends where pair = $1", [pair]);
      return { ok: true };
    },

    /** Вызвать друга на партию. color: за кого играет вызывающий. */
    async createGame(
      me: Profile,
      rawFriend: unknown,
      color: "w" | "b" | "random",
      tc: TimeControl,
    ): Promise<{ game: GameView } | { error: PlayError }> {
      if (!me.onlineOk) return { error: "off" };
      const name = typeof rawFriend === "string" ? rawFriend.trim().toLowerCase() : "";
      const friend = name ? await profileByName(name) : null;
      if (!friend) return { error: "no-user" };
      if (friend.userId === me.userId) return { error: "self" };
      const l = await link(me.userId, friend.userId);
      if (l?.status !== "accepted") return { error: "not-friends" };
      if (!friend.onlineOk) return { error: "off" };
      const open = await q(
        `select count(*) as n from lab_games where (white = $1 or black = $1) and status in ('invited', 'active')`,
        [me.userId],
      );
      if (num(open[0]?.n) >= MAX_OPEN_GAMES) return { error: "limit" };
      const mine: "w" | "b" = color === "random" ? (randomBytes(1)[0] % 2 ? "w" : "b") : color;
      const now = clock();
      const row = newGameRow({
        id: newId(),
        white: mine === "w" ? me.userId : friend.userId,
        black: mine === "w" ? friend.userId : me.userId,
        invitedBy: me.userId,
        tc,
        now,
      });
      await q(
        `insert into lab_games (id, white, black, invited_by, status, moves, fen, base_s, inc_s, white_ms, black_ms, clock_at, created_ms)
         values ($1, $2, $3, $4, 'invited', '[]'::jsonb, $5, $6, $7, $8, $9, 0, $10)`,
        [
          row.id,
          row.white,
          row.black,
          row.invitedBy,
          row.fen,
          row.baseS,
          row.incS,
          row.whiteMs,
          row.blackMs,
          row.createdAt,
        ],
      );
      const names = await namesOf([row.white, row.black]);
      return { game: viewOf(row, me.userId, { w: names.get(row.white) ?? "?", b: names.get(row.black) ?? "?" }, now) };
    },

    /** Партия для смотрящего; время, вышедшее у игрока, фиксируется здесь же. */
    async getGame(me: Profile, id: string): Promise<{ game: GameView } | { error: PlayError }> {
      const row = await loadGame(id);
      if (!row || !sideOf(row, me.userId)) return { error: "not-found" };
      const now = clock();
      let current = row;
      const settled = settle(row, now);
      if (settled !== row) {
        if (await saveGame(settled)) current = { ...settled, version: row.version + 1 };
        else current = (await loadGame(id)) ?? row;
      }
      const names = await namesOf([current.white, current.black]);
      return {
        game: viewOf(
          current,
          me.userId,
          { w: names.get(current.white) ?? "?", b: names.get(current.black) ?? "?" },
          now,
        ),
      };
    },

    async act(me: Profile, id: string, action: Action): Promise<{ game: GameView } | { error: PlayError }> {
      for (let attempt = 0; attempt < 3; attempt++) {
        const row = await loadGame(id);
        if (!row) return { error: "not-found" };
        const now = clock();
        const next = applyAction(row, me.userId, action, now);
        if (isError(next)) {
          // Время могло выйти: фиксируем итог, чтобы следующий запрос уже показал результат.
          const settled = settle(row, now);
          if (settled !== row) await saveGame(settled);
          return { error: next };
        }
        if (action.type === "accept" || action.type === "decline") {
          // Принять приглашение можно, пока у обоих включена игра по сети.
          const other = await profileById(me.userId === row.white ? row.black : row.white);
          if (action.type === "accept" && (!me.onlineOk || !other?.onlineOk)) return { error: "off" };
        }
        if (await saveGame(next)) {
          const names = await namesOf([next.white, next.black]);
          return {
            game: viewOf(
              { ...next, version: row.version + 1 },
              me.userId,
              { w: names.get(next.white) ?? "?", b: names.get(next.black) ?? "?" },
              now,
            ),
          };
        }
      }
      return { error: "conflict" };
    },

    /** Мои приглашения, идущие партии и недавно законченные. */
    async myGames(me: Profile): Promise<GameView[]> {
      const rows = await q(
        `select * from lab_games where (white = $1 or black = $1)
           and (status in ('invited', 'active') or (status = 'finished' and updated_at > now() - interval '3 days'))
         order by updated_at desc limit 30`,
        [me.userId],
      );
      const games = rows.map(rowToGame);
      const names = await namesOf(games.flatMap((g) => [g.white, g.black]));
      const now = clock();
      const out: GameView[] = [];
      for (const g of games) {
        const settled = settle(g, now);
        if (settled !== g) await saveGame(settled);
        if (settled.status === "declined") continue;
        out.push(viewOf(settled, me.userId, { w: names.get(g.white) ?? "?", b: names.get(g.black) ?? "?" }, now));
      }
      return out;
    },

    // ─── Переписка ─────────────────────────────────────────────────────────────

    async messages(
      me: Profile,
      rawFriend: unknown,
      afterId = 0,
    ): Promise<{ messages: Message[] } | { error: PlayError }> {
      const name = typeof rawFriend === "string" ? rawFriend.trim().toLowerCase() : "";
      const friend = name ? await profileByName(name) : null;
      if (!friend) return { error: "no-user" };
      const l = await link(me.userId, friend.userId);
      if (l?.status !== "accepted") return { error: "not-friends" };
      const pair = pairKey(me.userId, friend.userId);
      const rows = await q(
        `select id, sender, body, created_at from lab_messages where pair = $1 and id > $2 order by id desc limit 60`,
        [pair, afterId],
      );
      const messages = rows
        .map((r) => ({
          id: num(r.id),
          mine: r.sender === me.userId,
          text: String(r.body),
          at: new Date(r.created_at as string | Date).getTime(),
        }))
        .reverse();
      const last = messages.at(-1)?.id;
      if (last) {
        await q(
          `insert into lab_reads (user_id, pair, last_id) values ($1, $2, $3)
           on conflict (user_id, pair) do update set last_id = greatest(lab_reads.last_id, excluded.last_id)`,
          [me.userId, pair, last],
        );
      }
      return { messages };
    },

    async sendMessage(
      me: Profile,
      rawFriend: unknown,
      rawText: unknown,
    ): Promise<{ id: number } | { error: PlayError }> {
      if (!me.onlineOk || !me.chatOk) return { error: "chat-off" };
      const name = typeof rawFriend === "string" ? rawFriend.trim().toLowerCase() : "";
      const friend = name ? await profileByName(name) : null;
      if (!friend) return { error: "no-user" };
      if (!friend.onlineOk || !friend.chatOk) return { error: "chat-off" };
      const l = await link(me.userId, friend.userId);
      if (l?.status !== "accepted") return { error: "not-friends" };
      const checked = checkMessage(rawText);
      if (!checked.ok) return { error: checked.error };
      const recent = await q(
        `select count(*) as n from lab_messages where sender = $1 and created_at > now() - interval '1 minute'`,
        [me.userId],
      );
      if (num(recent[0]?.n) >= MESSAGES_PER_MINUTE) return { error: "rate" };
      const rows = await q("insert into lab_messages (pair, sender, body) values ($1, $2, $3) returning id", [
        pairKey(me.userId, friend.userId),
        me.userId,
        checked.text.slice(0, MAX_MESSAGE),
      ]);
      return { id: num(rows[0]?.id) };
    },
  };
}

export type PlayStore = ReturnType<typeof playStore>;

const stores = new Map<string, PlayStore>();

/** Хранилище игры на Neon; одно на процесс. */
export function neonPlayStore(databaseUrl: string): PlayStore {
  let store = stores.get(databaseUrl);
  if (!store) {
    let sql: NeonQueryFunction<false, false> | undefined;
    store = playStore(async (text, params) => (sql ??= neon(databaseUrl)).query(text, params));
    stores.set(databaseUrl, store);
  }
  return store;
}
