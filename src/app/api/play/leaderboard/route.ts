import type { NextRequest } from "next/server";
import { parseQuery } from "@/lib/leaderboard";
import { context, fail, logError, ok } from "@/lib/server/play";

/** Таблица лидеров. Видна любому вошедшему; имя в игре для этого не нужно. */
export async function GET(request: NextRequest) {
  const ctx = context(request, false);
  if (ctx instanceof Response) return ctx;
  const params = request.nextUrl.searchParams;
  const limit = Math.min(50, Math.max(1, Math.floor(Number(params.get("limit"))) || 50));
  try {
    return ok(await ctx.store.leaderboard(ctx.userId, parseQuery(params), limit));
  } catch (error) {
    logError(error);
    return fail("storage");
  }
}
