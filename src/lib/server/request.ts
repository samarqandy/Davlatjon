/** Общее для обработчиков входа: cookie сессии, адрес возврата, проверка «запрос с нашего сайта». */
import type { NextRequest, NextResponse } from "next/server";
import type { AuthConfig } from "./config";
import { SESSION_COOKIE, SESSION_DAYS, readSession, type SessionUser } from "./session";

export function sessionFrom(request: NextRequest, cfg: AuthConfig): SessionUser | null {
  return readSession(request.cookies.get(SESSION_COOKIE)?.value, cfg.secret);
}

export function setSessionCookie(response: NextResponse, request: NextRequest, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

/** Куда вернуться после входа: только путь на этом же сайте. */
export function safeBack(back: string | null | undefined, fallback = "/parent/settings"): string {
  if (!back || !back.startsWith("/") || back.startsWith("//") || back.includes("\\")) return fallback;
  return back;
}

/** Запрос на изменение данных пришёл с этого же сайта (а не с чужой страницы). */
export function sameOrigin(request: NextRequest, cfg: AuthConfig): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const own = cfg.appUrl || new URL(request.url).origin;
  return origin === own || origin === new URL(request.url).origin;
}

/** Адрес возврата с отметкой о результате входа: «/parent/settings?login=ok». */
export function backUrl(request: NextRequest, back: string, result: "ok" | "error" | "off"): URL {
  const url = new URL(back, request.url);
  url.searchParams.set("login", result);
  return url;
}
