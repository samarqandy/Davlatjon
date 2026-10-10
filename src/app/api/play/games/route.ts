import type { NextRequest } from "next/server";
import { timeControlOf } from "@/lib/online";
import { fail, ok, readBody, withProfile } from "@/lib/server/play";

/** Мои приглашения, идущие и недавно законченные партии. */
export async function GET(request: NextRequest) {
  return withProfile(request, false, async (store, me) => ok({ games: await store.myGames(me) }));
}

/** Вызвать друга на партию: { friend, color: "w" | "b" | "random", tc: "10+0" }. */
export async function POST(request: NextRequest) {
  const body = await readBody(request);
  const tc = timeControlOf(body?.tc);
  const color = body?.color === "w" || body?.color === "b" || body?.color === "random" ? body.color : null;
  if (!body || !tc || !color) return fail("json");
  return withProfile(request, true, async (store, me) => {
    const res = await store.createGame(me, body.friend, color, tc);
    return "error" in res ? fail(res.error) : ok(res);
  });
}
