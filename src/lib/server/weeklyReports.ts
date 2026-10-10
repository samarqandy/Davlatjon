/**
 * Еженедельная рассылка итогов в Telegram: берём аккаунты, где родитель включил её,
 * считаем итоги недели из сохранённого прогресса и отправляем. Имя ребёнка в сообщение не попадает.
 */
import type { Lang } from "@/lib/lang";
import { telegramText, weeklyReport } from "@/lib/report";
import { isoDay, sanitize } from "@/lib/state";
import type { ProgressStore } from "./progressStore";
import { sendTelegramMessage, type SendResult } from "./telegram";

export interface WeeklyRun {
  sent: number;
  skipped: number;
  blocked: number;
  failed: number;
}

/** Текст для одного аккаунта: null — недели с занятиями не было, рассылать нечего. */
export function messageFor(state: unknown, today: string): string | null {
  const s = sanitize(state);
  const report = weeklyReport(s, today);
  if (report.quiet) return null;
  const lang: Lang = s.settings.lang === "uz" ? "uz" : "ru";
  return telegramText(report, lang);
}

export async function sendWeeklyReports(opts: {
  store: ProgressStore;
  botToken: string;
  now?: number;
  send?: (token: string, chatId: string, text: string) => Promise<SendResult>;
}): Promise<WeeklyRun> {
  const today = isoDay(opts.now ?? Date.now());
  const send = opts.send ?? ((token, chat, text) => sendTelegramMessage(token, chat, text));
  const run: WeeklyRun = { sent: 0, skipped: 0, blocked: 0, failed: 0 };
  for (const { userId, state } of await opts.store.telegramRecipients()) {
    // «tg:123» — первый профиль, «tg:123#p3k9x» — другие дети на том же аккаунте: письмо идёт в один чат,
    // а чтобы родитель различал детей, в начале — аватарка профиля.
    const [account] = userId.split("#");
    const body = messageFor(state, today);
    const avatar = sanitize(state).settings.avatar;
    const text = body && avatar ? `${avatar} ${body}` : body;
    if (!text) {
      run.skipped++;
      continue;
    }
    const result = await send(opts.botToken, account.replace(/^tg:/, ""), text);
    if (result === "ok") run.sent++;
    else if (result === "blocked") run.blocked++;
    else run.failed++;
  }
  return run;
}
