/**
 * Настройки входа — из переменных окружения. Если чего-то нет, соответствующая кнопка
 * просто не показывается, а платформа работает как раньше: прогресс хранится в браузере.
 * Как всё подключить — docs/login-setup.md.
 */
export interface AuthConfig {
  secret: string;
  google?: { clientId: string; clientSecret: string };
  telegram?: { botToken: string; botName: string };
  /** Строка подключения к Postgres на Neon. */
  storage?: { databaseUrl: string };
  /** Адрес сайта для ссылок возврата (если прокси подменяет хост). */
  appUrl?: string;
}

export function authConfig(env: Record<string, string | undefined> = process.env): AuthConfig {
  const google =
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }
      : undefined;
  const botName = (env.TELEGRAM_BOT_NAME ?? env.NEXT_PUBLIC_TELEGRAM_BOT_NAME ?? "").replace(/^@/, "");
  const telegram = env.TELEGRAM_BOT_TOKEN && botName ? { botToken: env.TELEGRAM_BOT_TOKEN, botName } : undefined;
  // Интеграция Neon в Vercel сама кладёт DATABASE_URL (и копию в POSTGRES_URL).
  const databaseUrl = [env.DATABASE_URL, env.POSTGRES_URL].find((url) => url && /^postgres(ql)?:\/\//.test(url));
  const storage = databaseUrl ? { databaseUrl } : undefined;
  return { secret: env.AUTH_SECRET ?? "", google, telegram, storage, appUrl: env.APP_URL?.replace(/\/$/, "") };
}

/** Какие способы входа доступны: нужен секрет для cookie, хранилище и сам провайдер. */
export function availableProviders(cfg: AuthConfig): { google: boolean; telegram: boolean; botName?: string } {
  const base = cfg.secret.length >= 32 && !!cfg.storage;
  return {
    google: base && !!cfg.google,
    telegram: base && !!cfg.telegram,
    botName: base && cfg.telegram ? cfg.telegram.botName : undefined,
  };
}

/** Адрес сайта: из APP_URL или из самого запроса. */
export function originOf(request: Request, cfg: AuthConfig): string {
  return cfg.appUrl || new URL(request.url).origin;
}
