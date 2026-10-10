import type { NextRequest } from "next/server";
import type { Action } from "@/lib/online";
import { fail, ok, readBody, withProfile } from "@/lib/server/play";

/** Одна партия: доска, часы, итог. Браузер спрашивает её раз в секунду-две. */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!/^[a-z0-9]{6,16}$/.test(id)) return fail("not-found");
  return withProfile(request, false, async (store, me) => {
    const res = await store.getGame(me, id);
    return "error" in res ? fail(res.error) : ok(res);
  });
}

const SIMPLE = ["accept", "decline", "resign", "abort", "draw-offer", "draw-accept", "draw-decline"] as const;

function parseAction(body: Record<string, unknown>): Action | null {
  if (body.action === "move") return typeof body.uci === "string" ? { type: "move", uci: body.uci } : null;
  const simple = SIMPLE.find((a) => a === body.action);
  return simple ? ({ type: simple } as Action) : null;
}

/** Действие игрока: { id, action: "move", uci } или { id, action: "resign" } и т. д. */
export async function POST(request: NextRequest) {
  const body = await readBody(request);
  const action = body && parseAction(body);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!body || !action || !/^[a-z0-9]{6,16}$/.test(id)) return fail("json");
  return withProfile(request, true, async (store, me) => {
    const res = await store.act(me, id, action);
    return "error" in res ? fail(res.error) : ok(res);
  });
}
