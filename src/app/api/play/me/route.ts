import type { NextRequest } from "next/server";
import { checkUsername } from "@/lib/online";
import { context, fail, logError, ok, publicProfile, readBody } from "@/lib/server/play";

/** Мой профиль для игры по сети: имя и выключатели. Без имени profile = null. */
export async function GET(request: NextRequest) {
  const ctx = context(request, false);
  if (ctx instanceof Response) return ctx;
  try {
    const me = await ctx.store.profileById(ctx.userId);
    if (me) await ctx.store.touch(ctx.userId);
    return ok({ profile: me ? publicProfile(me) : null });
  } catch (error) {
    logError(error);
    return fail("storage");
  }
}

/** Выбрать или сменить имя; родитель включает и выключает игру, переписку и поиск. */
export async function POST(request: NextRequest) {
  const ctx = context(request, true);
  if (ctx instanceof Response) return ctx;
  const body = await readBody(request);
  if (!body) return fail("json");
  try {
    if (body.username !== undefined) {
      const checked = checkUsername(body.username);
      if (!checked.ok)
        return fail(
          checked.error === "format" ? "invalid-name" : checked.error === "reserved" ? "reserved-name" : "bad-name",
        );
      const res = await ctx.store.setUsername(ctx.userId, body.username);
      if ("error" in res) return fail(res.error);
    }
    const flag = (v: unknown) => (typeof v === "boolean" ? v : undefined);
    const prefs = { onlineOk: flag(body.onlineOk), chatOk: flag(body.chatOk), findable: flag(body.findable) };
    const me =
      prefs.onlineOk === undefined && prefs.chatOk === undefined && prefs.findable === undefined
        ? await ctx.store.profileById(ctx.userId)
        : await ctx.store.setPrefs(ctx.userId, prefs);
    return me ? ok({ profile: publicProfile(me) }) : fail("no-profile");
  } catch (error) {
    logError(error);
    return fail("storage");
  }
}
