"use client";

import { useRef, useState } from "react";
import { RichText } from "@/components/RichText";
import { Button, cn } from "@/components/ui";
import type { AnswerSpec } from "@/content/types";
import { signsValue } from "@/lib/checks";
import { evaluate, prettyExpression, usesForbidden } from "@/lib/expression";
import { askExplain, praise, retrySub } from "@/lib/feedback";
import { useLang, useT } from "@/lib/i18n";
import { addFound, markSolved, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

type SignsSpec = Extract<AnswerSpec, { kind: "signs" }>;
type RulesSpec = Extract<AnswerSpec, { kind: "rules" }>;

// ---------------------------------------------------------------------------
// Знаки + и −
// ---------------------------------------------------------------------------

export function SignsPuzzle({ taskId, spec, hintsLeft }: { taskId: string; spec: SignsSpec; hintsLeft: boolean }) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [signs, setSigns] = useState<("+" | "−" | "")[][]>(
    () => (progress.input?.signs as ("+" | "−" | "")[][]) ?? spec.rows.map((r) => r.answer.map(() => "")),
  );
  const [results, setResults] = useState<(number | null)[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const toggle = (row: number, i: number) => {
    const next = signs.map((r) => [...r]);
    next[row][i] = next[row][i] === "+" ? "−" : "+";
    setSigns(next);
    setResults([]);
    setFeedback(null);
    saveTaskInput(taskId, { signs: next });
  };

  const filled = signs.every((r) => r.every((s) => s !== ""));

  const check = () => {
    const n = attempts.current++;
    const values = spec.rows.map((row, i) => signsValue(row.numbers, signs[i] as ("+" | "−")[]));
    setResults(values);
    const ok = values.every((v, i) => v === spec.rows[i].result);
    recordCheck(taskId, ok);
    setFeedback(
      ok
        ? { tone: "success", text: praise(n, lang), sub: askExplain(n, lang) }
        : {
            tone: "retry",
            text: t("Посмотри, что получается в каждой строчке.", "Har bir qatorda nima chiqayotganiga qara."),
            sub: retrySub(n, hintsLeft, lang),
          },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">{t("Нажимай на окошки: + или −.", "Katakchalarni bos: + yoki −.")}</p>
      <div className="space-y-3">
        {spec.rows.map((row, ri) => (
          <div key={ri} className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white px-3 py-2.5 shadow-card">
            {row.numbers.map((num, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="tabular text-3xl font-black">{num}</span>
                {i < row.numbers.length - 1 && (
                  <button
                    type="button"
                    onClick={() => toggle(ri, i)}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border-2 text-3xl font-black transition",
                      signs[ri][i]
                        ? "border-brand bg-brand-soft text-brand-dark"
                        : "border-dashed border-brand/60 bg-white text-brand/40",
                    )}
                    aria-label={t(
                      `Знак ${i + 1}: ${signs[ri][i] || "пусто"}`,
                      `${i + 1}-belgi: ${signs[ri][i] || "boʻsh"}`,
                    )}
                  >
                    {signs[ri][i] || "?"}
                  </button>
                )}
              </span>
            ))}
            <span className="text-3xl font-black">= {row.result}</span>
            {results[ri] !== undefined && results[ri] !== null && (
              <span
                className={cn(
                  "ml-2 rounded-lg px-2 py-0.5 text-sm font-extrabold",
                  results[ri] === row.result ? "bg-mint-soft text-[#047857]" : "bg-sun-soft text-[#7a4b00]",
                )}
              >
                {results[ri] === row.result
                  ? t("✓ верно", "✓ toʻgʻri")
                  : t(`получается ${results[ri]}`, `${results[ri]} chiqyapti`)}
              </span>
            )}
          </div>
        ))}
      </div>
      <Button onClick={check} size="lg" disabled={!filled}>
        {t("Проверить", "Tekshirish")}
      </Button>
      <Feedback state={feedback} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Сломанный калькулятор
// ---------------------------------------------------------------------------

const KEYS = ["7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", "(", ")", "⌫"];

export function ExpressionsPuzzle({
  taskId,
  target,
  forbidden,
}: {
  taskId: string;
  target: number;
  forbidden: string[];
}) {
  const t = useT();
  const progress = useTask(taskId);
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const found = (progress.found ?? []).filter((f) => !f.startsWith("?"));

  const press = (k: string) => {
    setResult(null);
    setFeedback(null);
    if (k === "⌫") setExpr((e) => e.slice(0, -1));
    else if (expr.length < 24) setExpr((e) => e + k);
  };

  const equals = () => {
    const r = evaluate(expr);
    if (!r.ok) {
      setResult("…");
      setFeedback({
        tone: "info",
        text: t("Пример записан не до конца.", "Misol oxirigacha yozilmagan."),
        sub: t("Проверь, чтобы после каждого знака стояло число.", "Har bir belgidan keyin son turganini tekshir."),
      });
      return;
    }
    setResult(String(r.value));
    if (usesForbidden(expr, forbidden)) return;
    const pretty = prettyExpression(expr);
    if (r.value !== target) {
      setFeedback({
        tone: "retry",
        text: t(`Получилось ${r.value}, а нужно ${target}.`, `${r.value} chiqdi, lekin ${target} kerak.`),
        sub: t(
          "Что нужно изменить, чтобы получилось ровно столько?",
          "Aynan shuncha chiqishi uchun nimani oʻzgartirish kerak?",
        ),
      });
      return;
    }
    if (found.includes(pretty)) {
      setFeedback({
        tone: "info",
        text: t("Этот способ у тебя уже есть!", "Bu usulni allaqachon topgansan!"),
        sub: t("Найди другой.", "Boshqasini top."),
      });
      return;
    }
    addFound(taskId, pretty);
    const total = found.length + 1;
    if (total >= 2) markSolved(taskId);
    setFeedback({
      tone: "success",
      text: t(`Получилось ${target}! Найдено способов: ${total}.`, `${target} chiqdi! Topilgan usullar: ${total} ta.`),
      sub:
        total === 1
          ? t("Отлично! А теперь найди другой способ.", "Zoʻr! Endi boshqa usulini top.")
          : t("А есть способ ещё короче или необычнее?", "Bundan ham qisqaroq yoki gʻaroyibroq usul bormi?"),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="w-[15.5rem] rounded-3xl bg-[#1f2937] p-3 shadow-card">
          <div className="mb-2 min-h-16 rounded-xl bg-[#d9f99d] px-3 py-2 text-right font-mono text-[#1a2e05]">
            <div className="min-h-6 text-lg break-all">{expr || " "}</div>
            <div className="text-2xl font-black">{result !== null ? `= ${result}` : " "}</div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {KEYS.map((k) => {
              const broken = forbidden.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  disabled={broken}
                  onClick={() => press(k)}
                  className={cn(
                    "relative h-11 rounded-lg text-xl font-bold transition active:scale-95",
                    broken ? "bg-[#4b5563] text-[#9ca3af]" : "bg-[#f3f4f6] text-[#111827] hover:bg-white",
                  )}
                  aria-label={
                    broken
                      ? t(`кнопка ${k} сломана`, `${k} tugmasi buzilgan`)
                      : k === "⌫"
                        ? t("стереть", "oʻchirish")
                        : k
                  }
                >
                  {k}
                  {broken && (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[#ef4444]">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => (setExpr(""), setResult(null), setFeedback(null))}
              className="h-11 rounded-lg bg-[#f87171] text-lg font-bold text-white"
            >
              C
            </button>
            <button
              type="button"
              onClick={equals}
              disabled={!expr}
              className="h-11 rounded-lg bg-sun text-xl font-black text-ink disabled:opacity-50"
            >
              =
            </button>
          </div>
        </div>
        {found.length > 0 && (
          <div className="min-w-48 flex-1 rounded-2xl bg-white p-3 shadow-card">
            <p className="mb-2 text-sm font-extrabold text-muted">
              {t(`Мои способы: ${found.length}`, `Usullarim: ${found.length}`)}
            </p>
            <ul className="flex flex-wrap gap-2">
              {found.map((f) => (
                <li key={f} className="tabular rounded-xl bg-mint-soft px-3 py-1 font-extrabold text-[#065f46]">
                  {f} = {target}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Feedback state={feedback} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Несколько правил
// ---------------------------------------------------------------------------

export function RulesAnswer({ taskId, spec }: { taskId: string; spec: RulesSpec }) {
  const t = useT();
  const progress = useTask(taskId);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const found = progress.found ?? [];
  const knownFound = found.filter((f) => !f.startsWith("?"));

  const check = () => {
    const v = Number(value);
    if (!Number.isFinite(v) || value === "") return;
    const known = spec.known.find((k) => k.value === v);
    if (known) {
      if (knownFound.includes(String(v))) {
        setFeedback({
          tone: "info",
          text: t(`Число ${v} у тебя уже есть.`, `${v} soni senda allaqachon bor.`),
          sub: t("Придумай другое правило — и другое число!", "Boshqa qoida oʻylab top — shunda boshqa son chiqadi!"),
        });
      } else {
        addFound(taskId, String(v));
        recordCheck(taskId, knownFound.length + 1 >= 2);
        setFeedback({
          tone: "success",
          text: t(
            `Да, следующим может быть ${v}! Расскажи взрослому своё правило.`,
            `Ha, keyingi son ${v} boʻlishi mumkin! Qoidangni kattalarga aytib ber.`,
          ),
          sub:
            knownFound.length + 1 >= 2
              ? t(
                  "Ты нашёл разные правила — значит, по трём числам нельзя точно узнать правило!",
                  "Sen har xil qoidalar topding — demak, uchta songa qarab qoidani aniq bilib boʻlmaydi!",
                )
              : t("А теперь придумай ДРУГОЕ правило.", "Endi BOSHQA qoida oʻylab top."),
        });
      }
    } else {
      addFound(taskId, `?${v}`);
      setFeedback({
        tone: "info",
        text: t(
          `Интересно! Объясни взрослому, по какому правилу получается ${v}.`,
          `Qiziq! Qaysi qoida boʻyicha ${v} chiqishini kattalarga tushuntirib ber.`,
        ),
        sub: t(
          "Если правило подходит к числам 1, 2, 4 — это тоже верный ответ.",
          "Agar qoida 1, 2, 4 sonlariga mos kelsa — bu ham toʻgʻri javob.",
        ),
      });
    }
    setValue("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <label className="block">
          <span className="mb-1 block text-sm font-extrabold text-muted">{spec.label}</span>
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 3))}
            onKeyDown={(e) => e.key === "Enter" && check()}
            className="tabular h-12 w-28 rounded-xl border-2 border-line bg-white px-3 text-center text-2xl font-extrabold outline-none focus:border-brand"
            placeholder="?"
          />
        </label>
        <Button onClick={check} size="lg" disabled={!value}>
          {t("Проверить", "Tekshirish")}
        </Button>
      </div>
      <Feedback state={feedback} />
      {found.length > 0 && (
        <p className="text-sm font-bold text-muted">
          {t("Мои ответы:", "Javoblarim:")}{" "}
          {found.map((f) => (
            <span
              key={f}
              className="mr-1.5 inline-block rounded-lg bg-brand-soft px-2 py-0.5 font-extrabold text-brand-dark"
            >
              {f.replace("?", "")}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Открытая задача
// ---------------------------------------------------------------------------

export function OpenAnswer({ taskId, prompt }: { taskId: string; prompt: string }) {
  const t = useT();
  const progress = useTask(taskId);
  const [notes, setNotes] = useState<string>(() => (progress.input?.notes as string) ?? "");
  const solved = progress.status === "solved";
  return (
    <div className="space-y-3">
      <p className="font-bold">
        <RichText text={prompt} />
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-muted">
          {t(
            "Можешь записать здесь свои мысли (необязательно):",
            "Fikrlaringni shu yerga yozib qoʻyishing mumkin (shart emas):",
          )}
        </span>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            saveTaskInput(taskId, { notes: e.target.value });
          }}
          rows={3}
          className="w-full rounded-2xl border-2 border-line bg-white px-3 py-2 text-lg outline-none focus:border-brand"
        />
      </label>
      <Button variant={solved ? "success" : "primary"} size="lg" onClick={() => markSolved(taskId)} disabled={solved}>
        {solved
          ? t("✓ Готово", "✓ Tayyor")
          : t("✅ Я решил и рассказал взрослому", "✅ Yechdim va kattalarga aytib berdim")}
      </Button>
    </div>
  );
}
