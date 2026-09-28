/**
 * Вход в аккаунт без сторонних библиотек: подписанная cookie с id пользователя.
 * Подпись — HMAC-SHA256 секретом AUTH_SECRET; подделать cookie без секрета нельзя.
 * Только для сервера.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "lab_session";
/** Полгода: ребёнку не нужно входить заново каждую неделю. */
export const SESSION_DAYS = 180;

export interface SessionUser {
  /** «google:1234…» или «tg:5678…». */
  id: string;
  provider: "google" | "telegram";
  name: string;
  /** Когда выдана и до какого момента действует (секунды). */
  iat: number;
  exp: number;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSession(
  user: Omit<SessionUser, "iat" | "exp">,
  secret: string,
  now = Math.floor(Date.now() / 1000),
): string {
  const payload: SessionUser = { ...user, iat: now, exp: now + SESSION_DAYS * 86400 };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body, secret)}`;
}

export function readSession(
  token: string | undefined,
  secret: string,
  now = Math.floor(Date.now() / 1000),
): SessionUser | null {
  if (!token || !secret) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const user = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionUser;
    if (typeof user.id !== "string" || typeof user.exp !== "number" || user.exp < now) return null;
    return user;
  } catch {
    return null;
  }
}
