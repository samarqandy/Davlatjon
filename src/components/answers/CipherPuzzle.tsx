"use client";

import { useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { normalizeText } from "@/lib/checks";
import { encode, shiftLetter } from "@/lib/cipher";
import { askExplain, praise, retrySub } from "@/lib/feedback";
import { countText, useLang, useT } from "@/lib/i18n";
import { recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { CheckButton } from "./CheckButton";
import { Feedback, type FeedbackState } from "./Feedback";

/** Буквы шифровки в клеточках. */
export function CipherBoxes({ text, print = false }: { text: string; print?: boolean }) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-1 sm:gap-1.5" aria-label={t(`Шифровка: ${text}`, `Shifrlangan soʻz: ${text}`)}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          className={cn(
            "flex items-center justify-center rounded-xl border-2 font-black",
            print
              ? "h-[10mm] w-[9mm] border-ink/60 text-xl"
              : "h-12 w-9 border-[#7c3aed]/50 bg-[#f5f3ff] text-2xl sm:h-14 sm:w-11 sm:text-3xl",
            ch === " " && "border-transparent bg-transparent",
          )}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

/** Таблица шифра: над каждой буквой — буква, которая её заменяет при сдвиге shift. */
export function ShiftTable({ alphabet, shift, print = false }: { alphabet: string; shift: number; print?: boolean }) {
  const t = useT();
  return (
    <div
      className="flex flex-wrap gap-0.5"
      role="table"
      aria-label={t(`Таблица шифра со сдвигом ${shift}`, `Shifr jadvali, siljish: ${shift}`)}
    >
      {[...alphabet].map((ch) => (
        <div
          key={ch}
          role="row"
          className={cn(
            "flex flex-col overflow-hidden rounded-md border text-center font-black",
            print ? "w-[6.5mm] border-ink/40 text-[9pt]" : "w-8 border-line bg-white text-sm",
          )}
        >
          <span role="cell" className={cn("py-0.5", !print && "bg-brand-soft text-brand-dark")}>
            {ch}
          </span>
          <span role="cell" className={cn("py-0.5", !print && "text-[#6d28d9]")}>
            {shiftLetter(ch, shift, alphabet)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CipherPuzzle({
  taskId,
  alphabet,
  encoded,
  answer,
  hintsLeft,
}: {
  taskId: string;
  alphabet: string;
  encoded: string;
  answer: string;
  hintsLeft: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [shift, setShift] = useState(0);
  const [value, setValue] = useState(() => String(progress.input?.word ?? ""));
  const [own, setOwn] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const n = alphabet.length;

  const change = (d: number) => setShift((s) => (s + d + n) % n);

  const check = () => {
    const i = attempts.current++;
    const given = normalizeText(value);
    const target = normalizeText(answer);
    const ok = given === target;
    recordCheck(taskId, ok);
    if (ok) {
      setFeedback({
        tone: "success",
        text: t(`${praise(i, lang)} Расшифровано: ${answer}.`, `${praise(i, lang)} Shifr ochildi: ${answer}.`),
        sub: askExplain(i, lang),
      });
      return;
    }
    const same = [...target].filter((ch, k) => given[k] === ch).length;
    const letters = countText(lang, target.length, ["буква", "буквы", "букв"], "ta harf");
    setFeedback({
      tone: "retry",
      text:
        given.length === target.length && same > 0
          ? t(`Сходится букв: ${same} из ${target.length}.`, `${target.length} ta harfdan ${same} tasi toʻgʻri.`)
          : t(
              `В шифровке ${letters} — и в ответе должно быть столько же.`,
              `Shifrlangan soʻzda ${letters} bor — javobda ham shuncha boʻlishi kerak.`,
            ),
      sub: retrySub(i, hintsLeft, lang),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-3xl bg-white p-4 shadow-card">
        <p className="text-sm font-extrabold text-muted">{t("Шифровка", "Shifrlangan soʻz")}</p>
        <CipherBoxes text={encoded} />
      </div>

      <div className="space-y-3 rounded-3xl bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-extrabold text-muted">
            {t("Шифровальная таблица. Сдвиг:", "Shifr jadvali. Siljish:")}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => change(-1)}
              aria-label={t("Сдвиг меньше", "Siljishni kamaytirish")}
            >
              −
            </Button>
            <span className="tabular w-10 text-center text-2xl font-black">{shift}</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => change(1)}
              aria-label={t("Сдвиг больше", "Siljishni oshirish")}
            >
              +
            </Button>
          </div>
        </div>
        <ShiftTable alphabet={alphabet} shift={shift} />
        <p className="text-sm font-bold text-muted">
          {t(
            "Верхняя буква при шифровании заменяется нижней. Чтобы расшифровать, найди букву шифровки в нижнем ряду.",
            "Shifrlashda yuqoridagi harf oʻrniga pastdagisi yoziladi. Shifrni ochish uchun shifrdagi harfni pastki qatordan top.",
          )}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${taskId}-word`} className="block text-sm font-extrabold text-muted">
          {t("Расшифрованное слово", "Shifri ochilgan soʻz")}
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            id={`${taskId}-word`}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              const v = e.target.value.toUpperCase().slice(0, 24);
              setValue(v);
              saveTaskInput(taskId, { word: v });
            }}
            onKeyDown={(e) => e.key === "Enter" && value.trim() && check()}
            className="h-14 w-full max-w-72 rounded-xl border-2 border-line bg-paper px-3 text-2xl font-extrabold tracking-widest uppercase outline-none focus:border-brand"
            placeholder={t("слово", "soʻz")}
          />
          <CheckButton ready={!!value.trim()} onCheck={check} onNotReady={setFeedback} />
        </div>
      </div>
      <Feedback state={feedback} />

      <details className="rounded-2xl bg-white p-3 shadow-card">
        <summary className="cursor-pointer text-sm font-extrabold text-brand">
          ✍️ {t("Зашифруй своё слово", "Oʻz soʻzingni shifrla")}
        </summary>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={own}
            onChange={(e) => setOwn(e.target.value.toUpperCase().slice(0, 16))}
            aria-label={t("Своё слово", "Oʻz soʻzing")}
            className="h-12 w-44 rounded-xl border-2 border-line bg-paper px-3 text-xl font-extrabold tracking-widest uppercase outline-none focus:border-brand"
            placeholder={t("слово", "soʻz")}
          />
          <span className="text-xl font-black text-muted">→</span>
          <span className="min-h-12 min-w-24 rounded-xl bg-[#f5f3ff] px-3 py-2 text-xl font-black tracking-widest text-[#6d28d9]">
            {encode(own, shift, alphabet) || "…"}
          </span>
        </div>
        <p className="mt-2 text-sm font-bold text-muted">
          {t(
            `Слово шифруется со сдвигом ${shift}. Загадай шифровку взрослому!`,
            `Siljish: ${shift}. Endi shifrni kattalarga topishmoq qilib ber — topa olisharmikan?`,
          )}
        </p>
      </details>
    </div>
  );
}
