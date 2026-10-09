import type { NextRequest } from "next/server";
import { authConfig, weeklyReportsAvailable } from "@/lib/server/config";
import { sameOrigin, sessionFrom } from "@/lib/server/request";
import { sendTelegramMessage } from "@/lib/server/telegram";
import { messageFor } from "@/lib/server/weeklyReports";
import { isoDay, sanitize } from "@/lib/state";

const noStore = { "Cache-Control": "no-store" };
const MAX_BYTES = 3_000_000;

/**
 * Пробное сообщение: родитель, вошедший через Telegram, получает у себя итоги текущей недели —
 * так сразу видно, что бот может писать. Отправляется только самому вошедшему человеку.
 */
export async function POST(request: NextRequest) {
  const cfg = authConfig();
  const user = sessionFrom(request, cfg);
  if (!weeklyReportsAvailable(cfg) || !cfg.telegram)
    return Response.json({ error: "off" }, { status: 404, headers: noStore });
  if (!user || user.provider !== "telegram")
    return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  if (!sameOrigin(request, cfg)) return Response.json({ error: "origin" }, { status: 403, headers: noStore });
  const text = await request.text();
  if (text.length > MAX_BYTES) return Response.json({ error: "too-large" }, { status: 413, headers: noStore });
  let state: unknown;
  try {
    state = (JSON.parse(text) as { state?: unknown }).state;
  } catch {
    return Response.json({ error: "json" }, { status: 400, headers: noStore });
  }
  const uz = sanitize(state).settings.lang === "uz";
  const message =
    messageFor(state, isoDay(Date.now())) ??
    (uz
      ? "Bu hafta hozircha mashgʻulot boʻlmadi — boshlanishi bilan hafta yakunlari shu yerga keladi."
      : "Пока на этой неделе занятий не было — как только они появятся, итоги придут сюда.");
  const result = await sendTelegramMessage(cfg.telegram.botToken, user.id.replace(/^tg:/, ""), message);
  return Response.json({ result }, { status: result === "ok" ? 200 : 502, headers: noStore });
}
