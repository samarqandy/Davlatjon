"use client";

import { useState, type FormEvent } from "react";
import { Button, Card } from "@/components/ui";
import { addProblem, removeProblem, useHydrated, useStore } from "@/lib/store";

const IDEAS = [
  "Задача про робота на клетчатом поле",
  "Числовая машина со своим правилом",
  "Ряд чисел с секретом",
  "Задача про покупки в магазине",
  "Весы с фруктами или игрушками",
  "Логическая задача: кто где живёт?",
];

export function MyProblems() {
  const hydrated = useHydrated();
  const problems = useStore((s) => s.myProblems);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addProblem({ title: title.trim() || "Моя задача", text: text.trim(), answer: answer.trim() || undefined });
    setTitle("");
    setText("");
    setAnswer("");
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Задачник Давлатжона</p>
          <h1 className="text-3xl font-black">✍️ Мои задачи</h1>
          <p className="mt-1 max-w-2xl text-lg text-muted">
            Настоящие математики не только решают задачи, но и придумывают их. Придумай свою задачу и загадай её маме,
            папе или другу!
          </p>
        </div>
        {hydrated && problems.length > 0 && (
          <Button variant="secondary" onClick={() => window.print()} className="no-print">
            🖨 Распечатать задачник
          </Button>
        )}
      </div>

      <Card className="no-print p-5 sm:p-6">
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block font-extrabold">Название</span>
            <input
              value={title}
              onChange={(e) => (setTitle(e.target.value), setSaved(false))}
              placeholder="Например: «Хитрый робот»"
              className="h-12 w-full rounded-2xl border-2 border-line bg-white px-3 text-lg outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-extrabold">Условие задачи</span>
            <textarea
              value={text}
              onChange={(e) => (setText(e.target.value), setSaved(false))}
              rows={4}
              placeholder="Напиши условие. Можно попросить взрослого записать с твоих слов."
              className="w-full rounded-2xl border-2 border-line bg-white px-3 py-2 text-lg outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-extrabold">
              Ответ (его увидит только тот, кто нажмёт «Показать ответ»)
            </span>
            <input
              value={answer}
              onChange={(e) => (setAnswer(e.target.value), setSaved(false))}
              className="h-12 w-full rounded-2xl border-2 border-line bg-white px-3 text-lg outline-none focus:border-brand"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" disabled={!text.trim()}>
              Сохранить задачу
            </Button>
            {saved && <span className="font-bold text-mint">✓ Задача сохранена!</span>}
          </div>
        </form>
        <div className="mt-5">
          <p className="mb-2 text-sm font-extrabold text-muted">Идеи, если хочется придумать, но не знаешь что:</p>
          <div className="flex flex-wrap gap-2">
            {IDEAS.map((i) => (
              <span key={i} className="rounded-xl bg-sun-soft px-3 py-1.5 text-sm font-bold text-[#7a4b00]">
                💡 {i}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {hydrated && problems.length === 0 && (
        <p className="rounded-3xl border-2 border-dashed border-line p-6 text-center text-lg text-muted">
          Здесь появятся твои задачи. Придумай первую! 🚀
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {hydrated &&
          problems.map((p, i) => (
            <Card key={p.id} className="print-task p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="text-xl font-black">
                  {problems.length - i}. {p.title}
                </h2>
                <span className="shrink-0 text-xs font-bold text-muted">
                  {new Date(p.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{p.text}</p>
              {p.answer && (
                <details className="mt-3 rounded-2xl bg-paper px-4 py-2">
                  <summary className="cursor-pointer font-bold text-brand">Показать ответ</summary>
                  <p className="mt-1 font-bold">{p.answer}</p>
                </details>
              )}
              <button
                type="button"
                onClick={() => window.confirm("Удалить эту задачу?") && removeProblem(p.id)}
                className="no-print mt-3 text-sm font-bold text-muted hover:text-rose"
              >
                Удалить
              </button>
            </Card>
          ))}
      </div>
    </div>
  );
}
