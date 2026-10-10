/** Общее для обработчиков /api/play: кто спрашивает, его профиль, ответы и коды ошибок. */
import type { NextRequest } from "next/server";
import { authConfig, type AuthConfig } from "./config";
import { neonPlayStore, type PlayError, type PlayStore, type Profile } from "./playStore";
import { sameOrigin, sessionFrom } from "./request";

const noStore = { "Cache-Control": "no-store" };

const STATUS: Partial<Record<PlayError | "unauthorized" | "origin" | "json" | "storage" | "off-site", number>> = {
  unauthorized: 401,
  "off-site": 404,
  origin: 403,
  json: 400,
  storage: 502,
  "no-profile": 409,
  "no-user": 404,
  "not-found": 404,
  taken: 409,
  conflict: 409,
  off: 403,
  "chat-off": 403,
  blocked: 403,
  "not-yours": 403,
  "not-friends": 403,
  rate: 429,
  limit: 429,
};

export function fail(error: PlayError | "unauthorized" | "origin" | "json" | "storage" | "off-site") {
  return Response.json({ error }, { status: STATUS[error] ?? 400, headers: noStore });
}

export function ok(body: unknown) {
  return Response.json(body, { headers: noStore });
}

export interface Ctx {
  cfg: AuthConfig;
  userId: string;
  store: PlayStore;
}

/** Ошибка базы — в журнал, но без строки подключения (в ней пароль). */
function logError(error: unknown) {
  console.error("play storage:", String(error).replace(/postgres(ql)?:\/\/\S+/g, "postgresql://***"));
}

/** Запрос от вошедшего пользователя на сайте, где есть база. Иначе — готовый ответ-отказ. */
export function context(request: NextRequest, mutating: boolean): Ctx | Response {
  const cfg = authConfig();
  if (!cfg.storage) return fail("off-site");
  const user = sessionFrom(request, cfg);
  if (!user) return fail("unauthorized");
  if (mutating && !sameOrigin(request, cfg)) return fail("origin");
  return { cfg, userId: user.id, store: neonPlayStore(cfg.storage.databaseUrl) };
}

/** Профиль с именем в игре; без имени — 409 «no-profile»: сначала надо выбрать имя. */
export async function withProfile(
  request: NextRequest,
  mutating: boolean,
  run: (store: PlayStore, me: Profile) => Promise<Response>,
): Promise<Response> {
  const ctx = context(request, mutating);
  if (ctx instanceof Response) return ctx;
  try {
    const me = await ctx.store.profileById(ctx.userId);
    if (!me) return fail("no-profile");
    await ctx.store.touch(ctx.userId);
    return await run(ctx.store, me);
  } catch (error) {
    logError(error);
    return fail("storage");
  }
}

export async function readBody(request: NextRequest): Promise<Record<string, unknown> | null> {
  const text = await request.text();
  if (text.length > 4000) return null;
  try {
    const body = JSON.parse(text);
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const publicProfile = (p: Profile) => ({
  username: p.username,
  onlineOk: p.onlineOk,
  chatOk: p.chatOk,
  findable: p.findable,
});

export { logError };
