import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/server/config";
import { sameOrigin } from "@/lib/server/request";
import { SESSION_COOKIE } from "@/lib/server/session";

/** Выйти из аккаунта: прогресс на устройстве остаётся, просто перестаёт синхронизироваться. */
export async function POST(request: NextRequest) {
  // Чужая страница не должна уметь выводить ребёнка из аккаунта.
  if (!sameOrigin(request, authConfig()))
    return NextResponse.json({ error: "origin" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
