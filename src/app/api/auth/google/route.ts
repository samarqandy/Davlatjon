import { NextResponse, type NextRequest } from "next/server";
import { authConfig, availableProviders, originOf } from "@/lib/server/config";
import { googleAuthUrl, randomToken } from "@/lib/server/google";
import { backUrl, safeBack } from "@/lib/server/request";

const OAUTH_COOKIE = "lab_oauth";

/** Шаг 1: отправляем на страницу входа Google (с защитой state + PKCE). */
export async function GET(request: NextRequest) {
  const cfg = authConfig();
  const back = safeBack(request.nextUrl.searchParams.get("back"));
  if (!availableProviders(cfg).google || !cfg.google) {
    return NextResponse.redirect(backUrl(request, back, "off"));
  }
  const state = randomToken(16);
  const verifier = randomToken(32);
  const origin = originOf(request, cfg);
  const response = NextResponse.redirect(
    googleAuthUrl({
      clientId: cfg.google.clientId,
      redirectUri: `${origin}/api/auth/google/callback`,
      state,
      verifier,
    }),
  );
  response.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, verifier, back }), {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/api/auth/google",
    maxAge: 600,
  });
  return response;
}
