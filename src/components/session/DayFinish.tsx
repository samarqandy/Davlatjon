"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MascotSays } from "@/components/Mascot";
import { ShareButton } from "@/components/ShareButton";
import { Button, ButtonLink, cn } from "@/components/ui";
import { SECTIONS } from "@/content/meta";
import type { Day } from "@/content/types";
import { countText, useLang, useT } from "@/lib/i18n";
import { updateDay, useHydrated, useStore } from "@/lib/store";

const MOODS = [
  { emoji: "😀", ru: "Было здорово", uz: "Zoʻr boʻldi" },
  { emoji: "🙂", ru: "Хорошо", uz: "Yaxshi" },
  { emoji: "😐", ru: "Так себе", uz: "Oʻrtacha" },
  { emoji: "😕", ru: "Было трудно", uz: "Qiyin boʻldi" },
];

export function DayFinish({ day, nextDayHref }: { day: Day; nextDayHref: string | null }) {
  const router = useRouter();
  const t = useT();
  const lang = useLang();
  const hydrated = useHydrated();
  const tasks = useStore((s) => s.tasks);
  const progress = useStore((s) => s.days[day.id]);

  const list = day.tasks.map((task) => ({ task, p: hydrated ? tasks[task.id] : undefined }));
  const solved = list.filter((x) => x.p?.status === "solved").length;
  const explained = list.filter((x) => x.p?.marks.explained).length;
  const anotherWay = list.filter((x) => x.p?.marks.anotherWay).length;
  const persisted = list.filter(
    (x) => x.p?.status === "solved" && (x.p.hints >= 2 || x.p.missed >= 2 || x.p.marks.hard),
  );
  const done = Boolean(progress?.completedAt);
  const left = countText(lang, day.tasks.length - solved, ["задача", "задачи", "задач"], "ta masala");

  const finish = () => {
    updateDay(day.id, { completedAt: progress?.completedAt ?? Date.now() });
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="animate-pop rounded-[2rem] border border-line bg-white p-6 text-center shadow-card sm:p-8">
        <MascotSays className="mx-auto mb-3 w-fit" size={80}>
          {solved === day.tasks.length
            ? t("Парвоз гордится тобой! Все задачи решены!", "Parvoz sen bilan faxrlanadi! Hamma masala yechildi!")
            : t("Парвоз рад: отличная работа!", "Parvoz xursand: zoʻr ishlading!")}
        </MascotSays>
        <h1 className="text-3xl font-black">🏁 {t("Итоги дня", "Kun yakuni")}</h1>
        <p className="mt-2 text-lg text-muted">
          {t(
            "Хорошая работа! Посмотри, что сегодня получилось.",
            "Yaxshi ishlading! Qani, bugun nimalarni uddalaganingni koʻramiz.",
          )}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            value={solved}
            label={t(`из ${day.tasks.length} задач решено`, `${day.tasks.length} ta masaladan yechildi`)}
            emoji="✅"
          />
          <Stat value={explained} label={t("решений объяснено", "ta yechimni tushuntirding")} emoji="💬" />
          <Stat value={anotherWay} label={t("других способов найдено", "ta boshqa yoʻl topding")} emoji="🔁" />
          <Stat
            value={persisted.length}
            label={t("трудных задач доведено до конца", "ta qiyin masala oxirigacha yechildi")}
            emoji="🧗"
          />
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-sun-soft px-4 py-2 font-extrabold text-[#7a4b00]">
          <span aria-hidden>{day.habit.emoji}</span>{" "}
          {t(`Новая привычка мыслителя: «${day.habit.name}»`, `Yangi fikrlash odati: «${day.habit.name}»`)}
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="mb-3 text-xl font-extrabold">
          {t("Какая задача была самой интересной?", "Qaysi masala eng qiziq boʻldi?")}
        </h2>
        <TaskPicker day={day} value={progress?.favorite} onPick={(id) => updateDay(day.id, { favorite: id })} />
        <h2 className="mt-5 mb-3 text-xl font-extrabold">
          {t("А над какой пришлось подумать дольше всего?", "Qaysi birining ustida eng uzoq bosh qotirding?")}
        </h2>
        <TaskPicker day={day} value={progress?.hardest} onPick={(id) => updateDay(day.id, { hardest: id })} />
        <h2 className="mt-5 mb-3 text-xl font-extrabold">
          {t("Как тебе сегодняшнее занятие?", "Bugungi mashgʻulot qanday oʻtdi?")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.emoji}
              type="button"
              onClick={() => updateDay(day.id, { mood: m.emoji })}
              aria-pressed={progress?.mood === m.emoji}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-2 transition",
                progress?.mood === m.emoji
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-white hover:border-brand/40",
              )}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs font-bold text-muted">{t(m.ru, m.uz)}</span>
            </button>
          ))}
        </div>
        <p className="mt-5 rounded-2xl bg-brand-soft px-4 py-3 font-bold text-brand-dark">
          🗣{" "}
          {t(
            "Расскажи маме или папе: что нового тебе сегодня открылось?",
            "Oyingga yoki dadangga aytib ber: bugun nimani yangi tushunding?",
          )}
        </p>
        <p className="mt-3 text-[0.95rem] text-muted">
          {t("Придумал свою задачу?", "Oʻzing masala oʻylab topdingmi?")}{" "}
          <Link href="/my-problems" className="font-extrabold text-brand hover:underline">
            ✍️ {t("Запиши её в «Мои задачи»", "Uni «Masalalarim» boʻlimiga yozib qoʻy")}
          </Link>
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="success" onClick={finish}>
          {done ? t("На главную", "Bosh sahifaga") : t("Завершить день ✓", "Kunni yakunlash ✓")}
        </Button>
        <ShareButton
          text={t(
            `Сегодня на Parvoz Edu: ${solved} из ${day.tasks.length} задач решено! ⭐`,
            `Bugun Parvoz Edu da: ${day.tasks.length} ta masaladan ${solved} tasi yechildi! ⭐`,
          )}
        />
        {nextDayHref && done && (
          <ButtonLink href={nextDayHref} size="lg" variant="secondary">
            {t("Следующий день →", "Keyingi kun →")}
          </ButtonLink>
        )}
      </div>
      {solved < day.tasks.length && (
        <p className="text-center text-sm text-muted">
          {t(
            `Осталось ${left} — к ним можно вернуться в любой день.`,
            `Yana ${left} qoldi — ularga istalgan kuni qaytishing mumkin.`,
          )}
        </p>
      )}
    </div>
  );
}

function Stat({ value, label, emoji }: { value: number; label: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-paper px-3 py-3">
      <div className="text-2xl" aria-hidden>
        {emoji}
      </div>
      <div className="tabular text-3xl font-black">{value}</div>
      <div className="text-xs font-bold text-muted">{label}</div>
    </div>
  );
}

function TaskPicker({ day, value, onPick }: { day: Day; value?: string; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {day.tasks.map((task, i) => (
        <button
          key={task.id}
          type="button"
          onClick={() => onPick(task.id)}
          aria-pressed={value === task.id}
          className={cn(
            "flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-sm font-bold transition",
            value === task.id
              ? "border-brand bg-brand-soft text-brand-dark"
              : "border-line bg-white hover:border-brand/40",
          )}
        >
          {/* Значок раздела одинаковый на обоих языках. */}
          <span aria-hidden>{SECTIONS[task.section].emoji}</span>
          {i + 1}. {task.title}
        </button>
      ))}
    </div>
  );
}
