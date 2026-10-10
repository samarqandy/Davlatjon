import type { NextRequest } from "next/server";
import { fail, ok, readBody, withProfile } from "@/lib/server/play";

/** Мои друзья (с отметкой «в сети» и числом непрочитанных), входящие и исходящие просьбы. */
export async function GET(request: NextRequest) {
  return withProfile(request, false, async (store, me) => ok(await store.friends(me)));
}

const ACTIONS = ["request", "accept", "decline", "remove", "block", "unblock"] as const;

/** Попросить дружбы, ответить на просьбу, убрать из друзей, заблокировать. */
export async function POST(request: NextRequest) {
  const body = await readBody(request);
  if (!body) return fail("json");
  const action = ACTIONS.find((a) => a === body.action);
  if (!action) return fail("json");
  return withProfile(request, true, async (store, me) => {
    if (action === "request") {
      const res = await store.requestFriend(me, body.username);
      return "error" in res ? fail(res.error) : ok(res);
    }
    const res = await store.respondFriend(me, body.username, action);
    return "error" in res ? fail(res.error) : ok(res);
  });
}
