/**
 * Где хранится прогресс аккаунта: таблица lab_progress в Supabase (Postgres).
 * Доступ — только с сервера по service_role-ключу через REST (PostgREST); в браузер ключ не попадает.
 * Схема — supabase/migrations/20260928000000_lab_progress.sql.
 */
export interface StoredProgress {
  state: unknown;
  updatedAt: string;
}

export interface ProgressStore {
  get(userId: string): Promise<StoredProgress | null>;
  put(userId: string, state: unknown): Promise<void>;
}

export function supabaseStore(url: string, serviceKey: string, fetchImpl: typeof fetch = fetch): ProgressStore {
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  const table = `${url}/rest/v1/lab_progress`;
  return {
    async get(userId) {
      const res = await fetchImpl(`${table}?user_id=eq.${encodeURIComponent(userId)}&select=state,updated_at`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Supabase: ${res.status}`);
      const rows = (await res.json()) as { state: unknown; updated_at: string }[];
      return rows[0] ? { state: rows[0].state, updatedAt: rows[0].updated_at } : null;
    },
    async put(userId, state) {
      const res = await fetchImpl(`${table}?on_conflict=user_id`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ user_id: userId, state, updated_at: new Date().toISOString() }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Supabase: ${res.status}`);
    },
  };
}
