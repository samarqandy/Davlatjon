import type { NextRequest } from "next/server";
import { fail, ok, readBody, withProfile } from "@/lib/server/play";

/** Переписка с другом: новые сообщения после номера `after`. */
export async function GET(request: NextRequest) {
  const after = Number(request.nextUrl.searchParams.get("after") ?? 0);
  return withProfile(request, false, async (store, me) => {
    const res = await store.messages(
      me,
      request.nextUrl.searchParams.get("friend"),
      Number.isFinite(after) ? after : 0,
    );
    return "error" in res ? fail(res.error) : ok(res);
  });
}

/** Отправить сообщение другу: { friend, text }. */
export async function POST(request: NextRequest) {
  const body = await readBody(request);
  if (!body) return fail("json");
  return withProfile(request, true, async (store, me) => {
    const res = await store.sendMessage(me, body.friend, body.text);
    return "error" in res ? fail(res.error) : ok(res);
  });
}
