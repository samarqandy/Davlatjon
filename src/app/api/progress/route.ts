import type { NextRequest } from "next/server";
import { authConfig } from "@/lib/server/config";
import { supabaseStore } from "@/lib/server/progressStore";
import { sameOrigin, sessionFrom } from "@/lib/server/request";
import { mergeStates } from "@/lib/sync";

/** Прогресс не больше 3 МБ — с запасом на 200 партий с разбором. */
const MAX_BYTES = 3_000_000;
const noStore = { "Cache-Control": "no-store" };

function setup(request: NextRequest) {
  const cfg = authConfig();
  const user = sessionFrom(request, cfg);
  const store = cfg.storage ? supabaseStore(cfg.storage.url, cfg.storage.serviceKey) : null;
  return { cfg, user, store };
}

/** Прогресс из аккаунта. */
export async function GET(request: NextRequest) {
  const { user, store } = setup(request);
  if (!user || !store) return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  try {
    const saved = await store.get(user.id);
    return Response.json({ state: saved?.state ?? null, updatedAt: saved?.updatedAt ?? null }, { headers: noStore });
  } catch {
    return Response.json({ error: "storage" }, { status: 502, headers: noStore });
  }
}

/**
 * Сохранить прогресс: сервер сливает присланное с тем, что уже лежит в аккаунте, —
 * так два устройства не затирают друг друга. Возвращает общий результат.
 */
export async function PUT(request: NextRequest) {
  const { cfg, user, store } = setup(request);
  if (!user || !store) return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
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
    const saved = await store.get(user.id);
    const merged = mergeStates(body.state, saved?.state ?? {});
    await store.put(user.id, merged);
    return Response.json({ state: merged }, { headers: noStore });
  } catch {
    return Response.json({ error: "storage" }, { status: 502, headers: noStore });
  }
}
