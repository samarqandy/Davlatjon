/**
 * Вход через Google (OAuth 2.0, код авторизации + PKCE). Библиотеки не нужны:
 * два запроса — перенаправление на Google и обмен кода на id_token.
 * id_token приходит напрямую от Google по HTTPS в обмен на секрет клиента, поэтому
 * его подпись можно не проверять (OpenID Connect Core, 3.1.3.7), но издателя, получателя
 * и срок мы всё равно сверяем.
 */
import { createHash, randomBytes } from "node:crypto";

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function pkceChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function googleAuthUrl(opts: {
  clientId: string;
  redirectUri: string;
  state: string;
  verifier: string;
}): string {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", opts.clientId);
  url.searchParams.set("redirect_uri", opts.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", opts.state);
  url.searchParams.set("code_challenge", pkceChallenge(opts.verifier));
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export interface GoogleProfile {
  sub: string;
  name?: string;
  email?: string;
}

/** Разобрать id_token и проверить издателя, получателя и срок. */
export function parseGoogleIdToken(
  idToken: string,
  clientId: string,
  now = Math.floor(Date.now() / 1000),
): GoogleProfile | null {
  const part = idToken.split(".")[1];
  if (!part) return null;
  try {
    const claims = JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as Record<string, unknown>;
    const issOk = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
    const audOk = claims.aud === clientId || (Array.isArray(claims.aud) && claims.aud.includes(clientId));
    if (!issOk || !audOk || typeof claims.sub !== "string") return null;
    if (typeof claims.exp !== "number" || claims.exp < now) return null;
    return {
      sub: claims.sub,
      name: typeof claims.name === "string" ? claims.name : undefined,
      email: typeof claims.email === "string" ? claims.email : undefined,
    };
  } catch {
    return null;
  }
}

export async function exchangeGoogleCode(opts: {
  code: string;
  verifier: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<GoogleProfile | null> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: opts.code,
      code_verifier: opts.verifier,
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
      redirect_uri: opts.redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { id_token?: string };
  return data.id_token ? parseGoogleIdToken(data.id_token, opts.clientId) : null;
}
