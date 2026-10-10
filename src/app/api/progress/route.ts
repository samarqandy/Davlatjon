import type { NextRequest } from "next/server";
import { authConfig } from "@/lib/server/config";
import { neonStore, progressKey } from "@/lib/server/progressStore";
import { sameOrigin, sessionFrom } from "@/lib/server/request";
import { mergeStates } from "@/lib/sync";

/** Прогресс не больше 3 МБ — с запасом на 200 партий с разбором. */
const MAX_BYTES = 3_000_000;
const noStore = { "Cache-Control": "no-store" };

/** Ошибка базы — в журнал сервера, но без строки подключения: в ней пароль. */
function logStorageError(error: unknown) {
  console.error("progress storage:", String(error).replace(/postgres(ql)?:\/\/\S+/g, "postgresql://***"));
}

function setup(request: NextRequest) {
  const cfg = authConfig();
  const user = sessionFrom(request, cfg);
  const store = cfg.storage ? neonStore(cfg.storage.databaseUrl) : null;
  const key = user ? progressKey(user.id, request.nextUrl.searchParams.get("profile")) : null;
  return { cfg, user, store, key };
}

/** Прогресс из аккаунта. */
export async function GET(request: NextRequest) {
  const { user, store, key } = setup(request);
  if (!user || !store) return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  if (!key) return Response.json({ error: "profile" }, { status: 400, headers: noStore });
  try {
    const saved = await store.get(key);
    return Response.json({ state: saved?.state ?? null, updatedAt: saved?.updatedAt ?? null }, { headers: noStore });
  } catch (error) {
    logStorageError(error);
    return Response.json({ error: "storage" }, { status: 502, headers: noStore });
  }
}

/**
 * Сохранить прогресс: сервер сливает присланное с тем, что уже лежит в аккаунте, —
 * так два устройства не затирают друг друга. Возвращает общий результат.
 */
export async function PUT(request: NextRequest) {
  const { cfg, user, store, key } = setup(request);
  if (!user || !store) return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  if (!key) return Response.json({ error: "profile" }, { status: 400, headers: noStore });
  if (!sameOrigin(request, cfg)) return Response.json({ error: "origin" }, { status: 403, headers: noStore });
  const text = await request.text();
  if (text.length > MAX_BYTES) return Response.json({ error: "too-large" }, { status: 413, headers: noStore });
  let body: { state?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "json" }, { status: 400, headers: noStore });
  }
  try {
    const saved = await store.get(key);
    const merged = mergeStates(body.state, saved?.state ?? {});
    await store.put(key, merged);
    return Response.json({ state: merged }, { headers: noStore });
  } catch (error) {
    logStorageError(error);
    return Response.json({ error: "storage" }, { status: 502, headers: noStore });
  }
}
