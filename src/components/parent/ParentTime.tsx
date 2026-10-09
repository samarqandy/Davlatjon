"use client";

import { useState } from "react";
import { Button, Card, cn } from "@/components/ui";
import { EXTEND_CHOICES, limitStatus, minutes } from "@/lib/activity";
import { useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import {
  extendToday,
  getState,
  GOAL_DAYS_DEFAULT,
  GOAL_DAYS_MAX,
  GOAL_DAYS_MIN,
  isoDay,
  LIMIT_CHOICES,
  updateSettings,
  useStore,
} from "@/lib/store";
import { useToday } from "@/lib/useToday";

const GOALS = Array.from({ length: GOAL_DAYS_MAX - GOAL_DAYS_MIN + 1 }, (_, i) => GOAL_DAYS_MIN + i);

function Pill({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-xl border-2 px-3.5 text-sm font-extrabold transition",
        on ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
      )}
    >
      {children}
    </button>
  );
}

/** Для родителя: сколько времени в день достаточно, добавить время на сегодня, приглашение на неделю. */
export function ParentTime() {
  const t = useT();
  const today = useToday();
  const settings = useStore((s) => s.settings);
  const state = useStore((s) => s);
  const status = limitStatus(state, today || isoDay(0));
  const limit = settings.dailyLimitMin || 0;
  const goal = settings.goalDays ?? GOAL_DAYS_DEFAULT;

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5 sm:p-6" data-time>
        <div>
          <h2 className="text-xl font-black">⏳ {t("Время в день", "Kunlik vaqt")}</h2>
          <p className="mt-1 text-muted">
            {t(
              "Когда время закончится, ребёнок доделает начатое и увидит спокойную карточку «На сегодня хватит». Таймера и обратного отсчёта он не видит. Продлить можно здесь или по PIN-коду прямо на карточке.",
              "Vaqt tugagach, bola boshlagan ishini tugatadi va tinch «Bugunga yetarli» kartasini koʻradi. Taymer va teskari sanoqni koʻrmaydi. Uzaytirishni shu yerda yoki kartaning oʻzida PIN-kod bilan qilsa boʻladi.",
            )}
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t("Сколько минут в день", "Kuniga necha daqiqa")}
        >
          <Pill on={limit === 0} onClick={() => updateSettings({ dailyLimitMin: 0 })}>
            {t("Без ограничения", "Cheklovsiz")}
          </Pill>
          {LIMIT_CHOICES.map((m) => (
            <Pill key={m} on={limit === m} onClick={() => updateSettings({ dailyLimitMin: m })}>
              {t(`${m} мин`, `${m} daqiqa`)}
            </Pill>
          ))}
        </div>
        <p className="font-bold" data-time-today>
          {t(`Сегодня активно: ${minutes(status.usedMs)} мин`, `Bugun faol: ${minutes(status.usedMs)} daqiqa`)}
          {status.remainingMs !== null &&
            (status.reached
              ? t(" · время на сегодня вышло", " · bugungi vaqt tugadi")
              : t(
                  ` · осталось ${Math.max(1, minutes(status.remainingMs))} мин`,
                  ` · ${Math.max(1, minutes(status.remainingMs))} daqiqa qoldi`,
                ))}
        </p>
        {limit > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-muted">{t("Добавить на сегодня:", "Bugunga qoʻshish:")}</span>
            {EXTEND_CHOICES.map((m) => (
              <Button key={m} variant="soft" size="sm" className="min-h-11" onClick={() => extendToday(m * 60_000)}>
                +{m} {t("мин", "daq")}
              </Button>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-black">🎯 {t("Приглашение на неделю", "Haftalik taklif")}</h2>
          <p className="mt-1 text-muted">
            {t(
              "Сколько дней в неделю хорошо бы заниматься. Ребёнок видит заполняющиеся точки — без сроков и без «пропущено». Любой день — уже хорошо.",
              "Haftada necha kun shugʻullanish yaxshi. Bola toʻladigan nuqtalarni koʻradi — muddatsiz va «oʻtkazib yubording»siz. Har bir kun — allaqachon yaxshi.",
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("Дней в неделю", "Haftada necha kun")}>
          {GOALS.map((g) => (
            <Pill key={g} on={goal === g} onClick={() => updateSettings({ goalDays: g })}>
              {t(`${g} дн.`, `${g} kun`)}
            </Pill>
          ))}
        </div>
      </Card>
      <TelegramReport />
    </div>
  );
}

/** Итоги недели в Telegram: по желанию, без имени ребёнка. Показывается тем, кто вошёл через Telegram. */
function TelegramReport() {
  const t = useT();
  const account = useAccount();
  const on = useStore((s) => s.settings.reportToTelegram === true);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "blocked">("idle");
  if (!account.reports) return null;
  const viaTelegram = account.user?.provider === "telegram";

  const test = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/report/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: getState() }),
      });
      setStatus(res.ok ? "ok" : "blocked");
    } catch {
      setStatus("blocked");
    }
  };

  return (
    <Card className="space-y-4 p-5 sm:p-6" data-telegram-report>
      <div>
        <h2 className="text-xl font-black">✈️ {t("Итоги недели в Telegram", "Hafta yakunlari Telegram'da")}</h2>
        <p className="mt-1 text-muted">
          {t(
            "Раз в неделю, в воскресенье вечером, бот пришлёт короткие итоги — без имени ребёнка и без оценок. Выключить можно в любой момент.",
            "Haftada bir marta, yakshanba kechqurun, bot qisqa xulosa yuboradi — bolaning ismisiz va baholarsiz. Istalgan payt oʻchirib qoʻyish mumkin.",
          )}
        </p>
      </div>
      {!viaTelegram ? (
        <p className="font-bold">
          {t(
            "Чтобы получать итоги, войдите через Telegram в разделе «Настройки» (и разрешите боту писать вам).",
            "Xulosalarni olish uchun «Sozlamalar» boʻlimida Telegram orqali kiring (va botga yozishga ruxsat bering).",
          )}
        </p>
      ) : (
        <>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={t("Присылать итоги недели", "Hafta yakunlarini yuborish")}
          >
            <Pill on={on} onClick={() => updateSettings({ reportToTelegram: true })}>
              {t("Присылать", "Yuborilsin")}
            </Pill>
            <Pill on={!on} onClick={() => updateSettings({ reportToTelegram: false })}>
              {t("Не присылать", "Yuborilmasin")}
            </Pill>
          </div>
          {on && (
            <div className="space-y-2">
              <Button variant="soft" className="min-h-11" onClick={test} disabled={status === "sending"}>
                {t("Прислать пробное сообщение", "Sinov xabarini yuborish")}
              </Button>
              <p role="status" className="text-sm font-bold" data-telegram-status={status}>
                {status === "ok" && t("Отправлено — проверьте Telegram. ✅", "Yuborildi — Telegram'ni tekshiring. ✅")}
                {status === "blocked" &&
                  t(
                    "Не получилось. Выйдите и войдите через Telegram снова, разрешив боту писать, или нажмите «Start» в чате с ботом.",
                    "Boʻlmadi. Telegram orqali chiqib, qaytadan kiring va botga yozishga ruxsat bering yoki bot bilan chatda «Start» tugmasini bosing.",
                  )}
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
