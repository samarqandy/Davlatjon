import { NextResponse, type NextRequest } from "next/server";
import { authConfig, availableProviders } from "@/lib/server/config";
import { backUrl, safeBack, setSessionCookie } from "@/lib/server/request";
import { createSession } from "@/lib/server/session";
import { verifyTelegram } from "@/lib/server/telegram";

/** Telegram Login Widget перенаправляет сюда с подписанными данными пользователя. */
export async function GET(request: NextRequest) {
  const cfg = authConfig();
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const back = safeBack(params.back);
  delete params.back;
  if (!availableProviders(cfg).telegram || !cfg.telegram) {
    return NextResponse.redirect(backUrl(request, back, "off"));
  }
  const user = verifyTelegram(params, cfg.telegram.botToken);
  if (!user) return NextResponse.redirect(backUrl(request, back, "error"));
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "Telegram";
  const token = createSession({ id: `tg:${user.id}`, provider: "telegram", name }, cfg.secret);
  const response = NextResponse.redirect(backUrl(request, back, "ok"));
  setSessionCookie(response, request, token);
  return response;
}
