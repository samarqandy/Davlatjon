"use client";

import { useState, type FormEvent } from "react";
import { Button, Card } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { addProblem, removeProblem, useHydrated, useStore } from "@/lib/store";

const IDEAS = [
  { ru: "Задача про робота на клетчатом поле", uz: "Katakli maydondagi robot haqida masala" },
  { ru: "Числовая машина со своим правилом", uz: "Oʻz qoidasi bilan ishlaydigan son mashinasi" },
  { ru: "Ряд чисел с секретом", uz: "Siri bor sonlar qatori" },
  { ru: "Задача про покупки в магазине", uz: "Doʻkondagi xaridlar haqida masala" },
  { ru: "Весы с фруктами или игрушками", uz: "Mevalar yoki oʻyinchoqlar tortilgan tarozi" },
  { ru: "Логическая задача: кто где живёт?", uz: "Mantiqiy masala: kim qayerda yashaydi?" },
];

export function MyProblems() {
  const hydrated = useHydrated();
  const t = useT();
  const problems = useStore((s) => s.myProblems);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addProblem({
      title: title.trim() || t("Моя задача", "Mening masalam"),
      text: text.trim(),
      answer: answer.trim() || undefined,
    });
    setTitle("");
    setText("");
    setAnswer("");
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
            {t("Задачник Давлатжона", "Davlatjonning masalalar toʻplami")}
          </p>
          <h1 className="text-3xl font-black">✍️ {t("Мои задачи", "Masalalarim")}</h1>
          <p className="mt-1 max-w-2xl text-lg text-muted">
            {t(
              "Настоящие математики не только решают задачи, но и придумывают их. Придумай свою задачу и загадай её маме, папе или другу!",
              "Haqiqiy matematiklar masalalarni yechibgina qolmay, ularni oʻzlari ham oʻylab topadi. Sen ham oʻz masalangni tuz va uni oyingga, dadangga yoki doʻstingga yechishga ber!",
            )}
          </p>
        </div>
        {hydrated && problems.length > 0 && (
          <Button variant="secondary" onClick={() => window.print()} className="no-print">
            🖨 {t("Распечатать задачник", "Toʻplamni chop etish")}
          </Button>
        )}
      </div>

      <Card className="no-print p-5 sm:p-6">
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block font-extrabold">{t("Название", "Nomi")}</span>
            <input
              value={title}
              onChange={(e) => (setTitle(e.target.value), setSaved(false))}
              placeholder={t("Например: «Хитрый робот»", "Masalan: «Ayyor robot»")}
              className="h-12 w-full rounded-2xl border-2 border-line bg-white px-3 text-lg outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-extrabold">{t("Условие задачи", "Masala sharti")}</span>
            <textarea
              value={text}
              onChange={(e) => (setText(e.target.value), setSaved(false))}
              rows={4}
              placeholder={t(
                "Напиши условие. Можно попросить взрослого записать с твоих слов.",
                "Shartni yoz. Kattalardan aytganlaringni yozib berishni soʻrasang ham boʻladi.",
              )}
              className="w-full rounded-2xl border-2 border-line bg-white px-3 py-2 text-lg outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-extrabold">
              {t(
                "Ответ (его увидит только тот, кто нажмёт «Показать ответ»)",
                "Javob (uni faqat «Javobni koʻrsatish» tugmasini bosgan kishi koʻradi)",
              )}
            </span>
            <input
              value={answer}
              onChange={(e) => (setAnswer(e.target.value), setSaved(false))}
              className="h-12 w-full rounded-2xl border-2 border-line bg-white px-3 text-lg outline-none focus:border-brand"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" disabled={!text.trim()}>
              {t("Сохранить задачу", "Masalani saqlash")}
            </Button>
            {saved && <span className="font-bold text-mint">✓ {t("Задача сохранена!", "Masala saqlandi!")}</span>}
          </div>
        </form>
        <div className="mt-5">
          <p className="mb-2 text-sm font-extrabold text-muted">
            {t(
              "Идеи, если хочется придумать, но не знаешь что:",
              "Masala tuzging kelsa-yu, nima haqida ekanini bilmasang — mana gʻoyalar:",
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {IDEAS.map((idea) => (
              <span key={idea.ru} className="rounded-xl bg-sun-soft px-3 py-1.5 text-sm font-bold text-[#7a4b00]">
                💡 {t(idea.ru, idea.uz)}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {hydrated && problems.length === 0 && (
        <p className="rounded-3xl border-2 border-dashed border-line p-6 text-center text-lg text-muted">
          {t(
            "Здесь появятся твои задачи. Придумай первую! 🚀",
            "Masalalaring shu yerda paydo boʻladi. Birinchisini oʻylab top! 🚀",
          )}
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
                  <summary className="cursor-pointer font-bold text-brand">
                    {t("Показать ответ", "Javobni koʻrsatish")}
                  </summary>
                  <p className="mt-1 font-bold">{p.answer}</p>
                </details>
              )}
              <button
                type="button"
                onClick={() =>
                  window.confirm(t("Удалить эту задачу?", "Bu masalani oʻchirib tashlaymizmi?")) && removeProblem(p.id)
                }
                className="no-print mt-3 text-sm font-bold text-muted hover:text-rose"
              >
                {t("Удалить", "Oʻchirish")}
              </button>
            </Card>
          ))}
      </div>
    </div>
  );
}
