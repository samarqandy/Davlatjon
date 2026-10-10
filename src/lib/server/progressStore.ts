import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Где хранится прогресс аккаунта: таблица lab_progress в Postgres на Neon.
 * Запросы идут с сервера по HTTP (драйвер @neondatabase/serverless); строка подключения в браузер не попадает.
 * Таблицу создавать вручную не нужно: сервер создаёт её сам при первом обращении.
 */
export interface StoredProgress {
  state: unknown;
  updatedAt: string;
}

export interface ProgressStore {
  get(userId: string): Promise<StoredProgress | null>;
  put(userId: string, state: unknown): Promise<void>;
  /** Аккаунты Telegram, где родитель включил итоги недели (для еженедельной рассылки). */
  telegramRecipients(): Promise<{ userId: string; state: unknown }[]>;
}

/** Один SQL-запрос с параметрами $1, $2… — возвращает строки. */
export type SqlQuery = (text: string, params?: unknown[]) => Promise<Record<string, unknown>[]>;

export const SCHEMA = `create table if not exists lab_progress (
  user_id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
)`;

/** Символ \0 Postgres в jsonb не принимает: из-за одной такой буквы в дневнике не должна ломаться вся синхронизация. */
const dropNul = (_key: string, value: unknown) => (typeof value === "string" ? value.replaceAll("\0", "") : value);

export function sqlStore(query: SqlQuery): ProgressStore {
  let ready: Promise<unknown> | null = null;
  const ensureTable = () =>
    (ready ??= query(SCHEMA)
      // Два первых запроса одновременно: второй может споткнуться о только что созданную таблицу.
      .catch(() => query(SCHEMA))
      .catch((error: unknown) => {
        ready = null;
        throw error;
      }));
  return {
    async get(userId) {
      await ensureTable();
      const rows = await query("select state, updated_at from lab_progress where user_id = $1", [userId]);
      if (!rows[0]) return null;
      const { state, updated_at } = rows[0];
      return { state, updatedAt: new Date(updated_at as string | Date).toISOString() };
    },
    async telegramRecipients() {
      await ensureTable();
      const rows = await query(
        `select user_id, state from lab_progress
         where user_id like 'tg:%' and state -> 'settings' ->> 'reportToTelegram' = 'true'`,
      );
      return rows.map((r) => ({ userId: String(r.user_id), state: r.state }));
    },
    async put(userId, state) {
      await ensureTable();
      await query(
        `insert into lab_progress (user_id, state, updated_at) values ($1, $2::jsonb, now())
         on conflict (user_id) do update set state = excluded.state, updated_at = excluded.updated_at`,
        [userId, JSON.stringify(state, dropNul)],
      );
    },
  };
}

/**
 * Чей прогресс: аккаунт или один из профилей детей на устройстве (?profile=p3k9x). У первого профиля
 * запись прежняя — «google:123», у остальных — «google:123#p3k9x».
 */
export function progressKey(userId: string, profile: string | null): string | null {
  if (!profile || profile === "main") return userId;
  return /^[a-z0-9]{3,12}$/.test(profile) ? `${userId}#${profile}` : null;
}

const stores = new Map<string, ProgressStore>();

/** Хранилище на Neon; одно на процесс, чтобы таблица проверялась один раз, а не на каждый запрос. */
export function neonStore(databaseUrl: string): ProgressStore {
  let store = stores.get(databaseUrl);
  if (!store) {
    let sql: NeonQueryFunction<false, false> | undefined;
    // Драйвер — при первом запросе: ошибка в строке подключения станет ответом 502, а не падением маршрута.
    store = sqlStore(async (text, params) => (sql ??= neon(databaseUrl)).query(text, params));
    stores.set(databaseUrl, store);
  }
  return store;
}
