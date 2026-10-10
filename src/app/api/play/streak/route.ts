import type { NextRequest } from "next/server";
import { checkStreak } from "@/lib/online";
import { fail, ok, readBody, withProfile } from "@/lib/server/play";

/** Показать друзьям серию дней с занятиями: число дней и последний день занятий. */
export async function POST(request: NextRequest) {
  const body = await readBody(request);
  if (!body) return fail("json");
  const checked = checkStreak(body.days, body.last, Date.now());
  if (!checked.ok) return fail("json");
  return withProfile(request, true, async (store, me) => {
    await store.setStreak(me.userId, checked.days, checked.last);
    return ok({ ok: true });
  });
}
