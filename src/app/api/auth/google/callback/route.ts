import { NextResponse, type NextRequest } from "next/server";
import { authConfig, availableProviders, originOf } from "@/lib/server/config";
import { exchangeGoogleCode } from "@/lib/server/google";
import { backUrl, safeBack, setSessionCookie } from "@/lib/server/request";
import { createSession } from "@/lib/server/session";

/** Шаг 2: Google вернул код — меняем его на профиль и выдаём cookie сессии. */
export async function GET(request: NextRequest) {
  const cfg = authConfig();
  const params = request.nextUrl.searchParams;
  let saved: { state?: string; verifier?: string; back?: string } = {};
  try {
    saved = JSON.parse(request.cookies.get("lab_oauth")?.value ?? "{}");
  } catch {
    saved = {};
  }
  const back = safeBack(saved.back);
  const fail = () => NextResponse.redirect(backUrl(request, back, "error"));
  const code = params.get("code");
  if (!availableProviders(cfg).google || !cfg.google || !code || !saved.state || !saved.verifier) return fail();
  if (params.get("state") !== saved.state) return fail();

  const profile = await exchangeGoogleCode({
    code,
    verifier: saved.verifier,
    clientId: cfg.google.clientId,
    clientSecret: cfg.google.clientSecret,
    redirectUri: `${originOf(request, cfg)}/api/auth/google/callback`,
  }).catch(() => null);
  if (!profile) return fail();

  const token = createSession(
    { id: `google:${profile.sub}`, provider: "google", name: profile.name || profile.email || "Google" },
    cfg.secret,
  );
  const response = NextResponse.redirect(backUrl(request, back, "ok"));
  setSessionCookie(response, request, token);
  response.cookies.set("lab_oauth", "", { path: "/api/auth/google", maxAge: 0 });
  return response;
}
