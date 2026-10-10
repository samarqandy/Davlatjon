import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/server/config";
import { neonPlayStore } from "@/lib/server/playStore";
import { sameOrigin, sessionFrom } from "@/lib/server/request";
import { SESSION_COOKIE } from "@/lib/server/session";

const noStore = { "Cache-Control": "no-store" };

/**
 * Удалить данные аккаунта: прогресс всех профилей детей, имя в игре, друзей, партии и переписку.
 * Вход при этом завершается. Прогресс на самом устройстве остаётся — его стирают в настройках.
 */
export async function DELETE(request: NextRequest) {
  const cfg = authConfig();
  if (!cfg.storage) return Response.json({ error: "off" }, { status: 404, headers: noStore });
  const user = sessionFrom(request, cfg);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  if (!sameOrigin(request, cfg)) return Response.json({ error: "origin" }, { status: 403, headers: noStore });
  try {
    await neonPlayStore(cfg.storage.databaseUrl).deleteAccount(user.id);
  } catch (error) {
    console.error("account delete:", String(error).replace(/postgres(ql)?:\/\/\S+/g, "postgresql://***"));
    return Response.json({ error: "storage" }, { status: 502, headers: noStore });
  }
  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
