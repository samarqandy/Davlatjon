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
    const text = messageFor(state, today);
    if (!text) {
      run.skipped++;
      continue;
    }
    const result = await send(opts.botToken, userId.replace(/^tg:/, ""), text);
    if (result === "ok") run.sent++;
    else if (result === "blocked") run.blocked++;
    else run.failed++;
  }
  return run;
}
