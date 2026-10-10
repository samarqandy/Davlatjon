import type { NextRequest } from "next/server";
import { fail, ok, withProfile } from "@/lib/server/play";

/** Поиск по началу имени (не короче трёх знаков). */
export async function GET(request: NextRequest) {
  return withProfile(request, false, async (store, me) => {
    const res = await store.search(me, request.nextUrl.searchParams.get("q"));
    return Array.isArray(res) ? ok({ users: res }) : fail(res.error);
  });
}
