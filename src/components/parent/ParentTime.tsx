"use client";

import { Button, Card, cn } from "@/components/ui";
import { EXTEND_CHOICES, limitStatus, minutes } from "@/lib/activity";
import { useT } from "@/lib/i18n";
import {
  extendToday,
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
  const status = useStore((s) => limitStatus(s, today || isoDay(0)));
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
    </div>
  );
}
