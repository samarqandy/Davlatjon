"use client";

import { LogoMark } from "@/components/Logo";
import { RichText } from "@/components/RichText";
import { BlockView } from "@/components/task/BlockView";
import { hintLabel, levelsFor, sectionsFor } from "@/content/meta";
import type { Day, PrintSpace, Task } from "@/content/types";
import { BRAND } from "@/lib/brand";
import { useLang, useT } from "@/lib/i18n";
import { PrintAnswerArea } from "./PrintAnswerArea";

const SPACE_MM: Record<PrintSpace, number> = { none: 0, lines: 0, small: 18, medium: 28, large: 40 };

function SheetHeader({ day, subtitle }: { day: Day; subtitle: string }) {
  const t = useT();
  return (
    <header className="mb-5 border-b-2 border-ink pb-3">
      <div className="flex items-center gap-3">
        <LogoMark size={34} />
        <div className="flex-1 leading-tight">
          <p className="text-[9pt] font-bold tracking-wide text-muted uppercase">
            {BRAND} · {subtitle}
          </p>
          <p className="text-[16pt] font-black">
            {t(
              `Неделя ${day.week} · День ${day.day}. ${day.title}`,
              `${day.week}-hafta · ${day.day}-kun. ${day.title}`,
            )}
          </p>
        </div>
        <span className="text-[26pt] leading-none" aria-hidden>
          {day.emoji}
        </span>
      </div>
    </header>
  );
}

function PrintTask({ task, number, withSpace }: { task: Task; number: number; withSpace: boolean }) {
  const t = useT();
  const lang = useLang();
  const section = sectionsFor(lang)[task.section];
  const level = levelsFor(lang)[task.level];
  const space = task.printSpace ?? "small";
  return (
    <section className="print-task mb-3.5 border-b border-dashed border-ink/25 pb-3">
      <div className="mb-1.5 flex items-center gap-2.5">
        <span className="flex h-[8mm] w-[8mm] shrink-0 items-center justify-center rounded-full bg-ink text-[11pt] font-black text-white">
          {number}
        </span>
        <h2 className="text-[13pt] font-black">{task.title}</h2>
        <span className="ml-auto flex shrink-0 items-center gap-2 text-[9pt] font-bold whitespace-nowrap text-muted">
          <span>
            {section.emoji} {section.name}
          </span>
          <span>
            {level.emoji} {level.name}
          </span>
        </span>
      </div>
      <div className="space-y-1.5">
        {task.body.map((b, i) => (
          <BlockView key={i} block={b} print />
        ))}
      </div>
      <div className="mt-2.5">
        <PrintAnswerArea task={task} />
      </div>
      {withSpace && space === "lines" && (
        <div className="mt-3 space-y-[7mm]">
          <div className="border-b border-ink/40" />
          <div className="border-b border-ink/40" />
        </div>
      )}
      {withSpace && SPACE_MM[space] > 0 && (
        <div className="work-area mt-2.5" style={{ height: `${SPACE_MM[space]}mm` }} aria-hidden />
      )}
      {task.followUps.length > 0 && (
        <p className="mt-2 text-[9pt] leading-snug text-muted italic">
          <b className="not-italic">{t("После решения подумай:", "Yechgandan keyin oʻylab koʻr:")}</b>{" "}
          {task.followUps.map((q, i) => (
            <span key={i}>
              <RichText text={q} />{" "}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}

/** Лист с заданиями для ребёнка — без ответов. */
export function WorksheetSheet({ day, withSpace }: { day: Day; withSpace: boolean }) {
  const t = useT();
  return (
    <article className="sheet">
      <SheetHeader day={day} subtitle={t("задания", "topshiriqlar")} />
      <div className="mb-5 grid grid-cols-[1fr_auto] gap-4 text-[10.5pt]">
        <div className="space-y-1">
          {day.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="font-bold">
            {day.habit.emoji} {t(`Привычка дня: «${day.habit.name}»`, `Bugungi odat: «${day.habit.name}»`)}
          </p>
        </div>
        <div className="space-y-2 text-[10pt] whitespace-nowrap">
          <p>
            {t("Имя:", "Ism:")} <span className="answer-line" style={{ minWidth: "38mm" }} />
          </p>
          <p>
            {t("Дата:", "Sana:")} <span className="answer-line" style={{ minWidth: "38mm" }} />
          </p>
        </div>
      </div>
      {day.tasks.map((task, i) => (
        <PrintTask key={task.id} task={task} number={i + 1} withSpace={withSpace} />
      ))}
      <footer className="print-task mt-4 rounded-[3mm] border border-ink/30 p-3 text-[10.5pt]">
        <p className="mb-2 font-black">🏁 {t("Итоги дня", "Kun yakuni")}</p>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <span>
            {t("Самая интересная задача: №", "Eng qiziq masala: №")}{" "}
            <span className="answer-line" style={{ minWidth: "12mm" }} />
          </span>
          <span>
            {t("Самая трудная: №", "Eng qiyini: №")} <span className="answer-line" style={{ minWidth: "12mm" }} />
          </span>
          <span>{t("Как было сегодня? 😀 🙂 😐 😕", "Bugun qanday oʻtdi? 😀 🙂 😐 😕")}</span>
        </div>
        <p className="mt-2">
          {t("Что нового я сегодня понял:", "Bugun nimani yangi tushundim:")}{" "}
          <span className="answer-line" style={{ minWidth: "95mm" }} />
        </p>
      </footer>
    </article>
  );
}

/** Отдельный лист для взрослого: ответы, объяснения, подсказки и заметки. */
export function AnswersSheet({ day }: { day: Day }) {
  const t = useT();
  const lang = useLang();
  const SECTIONS = sectionsFor(lang);
  const LEVELS = levelsFor(lang);
  return (
    <article className="sheet">
      <SheetHeader day={day} subtitle={t("ответы для родителя", "ota-onalar uchun javoblar")} />
      <p className="mb-4 rounded-[2mm] bg-sun-soft px-3 py-2 text-[10pt] font-bold">
        🔐{" "}
        {t(
          "Этот лист — для взрослого. Не показывайте его ребёнку до конца занятия. Не называйте ответ сразу: сначала подсказки по порядку.",
          "Bu varaq kattalar uchun. Mashgʻulot tugaguncha uni bolaga koʻrsatmang. Javobni darrov aytib qoʻymang: avval maslahatlarni tartib bilan bering.",
        )}
      </p>
      <section className="print-task mb-5 grid grid-cols-2 gap-x-6 gap-y-3 rounded-[3mm] border border-ink/25 p-3 text-[9.5pt]">
        <div>
          <p className="font-black">👨‍👩‍👦 {t("Какие навыки тренируем", "Qaysi koʻnikmalarni rivojlantiramiz")}</p>
          <ul className="list-disc pl-4">
            {day.parent.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-black">👀 {t("На что обратить внимание", "Nimaga eʼtibor berish kerak")}</p>
          <ul className="list-disc pl-4">
            {day.parent.observe.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-black">🙂 {t("Нормальные ошибки", "Tabiiy xatolar")}</p>
          <ul className="list-disc pl-4">
            {day.parent.mistakes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-black">❓ {t("Вопрос после занятия", "Mashgʻulotdan keyingi savol")}</p>
          <p>{day.parent.question}</p>
        </div>
      </section>
      {day.tasks.map((task, i) => (
        <section key={task.id} className="print-task mb-4 border-b border-dashed border-ink/25 pb-3 text-[10pt]">
          <p className="mb-1 flex items-baseline gap-2">
            <span className="font-black">
              {i + 1}. {task.title}
            </span>
            <span className="text-[9pt] text-muted">
              {SECTIONS[task.section].emoji} {SECTIONS[task.section].name} · {LEVELS[task.level].emoji}{" "}
              {LEVELS[task.level].name}
            </span>
          </p>
          <p className="mb-1">
            <b>{t("Ответ:", "Javob:")}</b> <RichText text={task.solution.answer} />
          </p>
          <div className="space-y-0.5">
            {task.solution.explanation.map((e) => (
              <p key={e}>
                <RichText text={e} />
              </p>
            ))}
          </div>
          {task.solution.discuss && task.solution.discuss.length > 0 && (
            <div className="mt-1 space-y-0.5 text-[9.5pt]">
              {task.solution.discuss.map((d) => (
                <p key={d}>
                  💬 <RichText text={d} />
                </p>
              ))}
            </div>
          )}
          <details className="mt-1 text-[9pt] text-muted" open>
            <summary className="font-bold">{t("Подсказки по порядку", "Maslahatlar tartib bilan")}</summary>
            <ol className="mt-0.5 list-decimal pl-5">
              {task.hints.map((h, j) => (
                <li key={j}>
                  <span className="font-bold">{hintLabel(j, lang)}</span> <RichText text={h} />
                </li>
              ))}
            </ol>
          </details>
        </section>
      ))}
    </article>
  );
}
