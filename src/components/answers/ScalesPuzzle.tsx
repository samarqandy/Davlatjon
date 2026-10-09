"use client";

import { useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { askExplain, praise } from "@/lib/feedback";
import { countText, useLang, useT, type Both, type Lang } from "@/lib/i18n";
import { candidates, trickyWeigh, type Weighing, type WeighingRecord } from "@/lib/scales";
import { addFound, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

type Place = "left" | "right";

const weighingsWord = (n: number, lang: Lang) =>
  countText(lang, n, ["взвешивание", "взвешивания", "взвешиваний"], "marta tortish");

const RESULT_TEXT: Both<Record<Weighing, string>> = {
  ru: {
    equal: "равновесие",
    left: "перевесила левая чаша",
    right: "перевесила правая чаша",
  },
  uz: {
    equal: "muvozanat",
    left: "chap palla ogʻir keldi",
    right: "oʻng palla ogʻir keldi",
  },
};

/** Монетка с номером — для рисунков и списков. */
export function Coin({ n, size = 28, muted = false }: { n: number; size?: number; muted?: boolean }) {
  return (
    <span
      className={cn(
        "tabular inline-flex shrink-0 items-center justify-center rounded-full border-2 font-black",
        muted ? "border-[#e5c07b] bg-[#fdf6e3] text-[#b08d57]" : "border-[#b45309] bg-[#fcd34d] text-[#78350f]",
      )}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {n}
    </span>
  );
}

/** Чашечные весы с монетами. tilt — какая чаша перевесила (опустилась). */
export function CoinScale({
  left,
  right,
  tilt = "equal",
}: {
  left: readonly number[];
  right: readonly number[];
  tilt?: Weighing;
}) {
  const t = useT();
  const w = 320;
  const pivot = { x: w / 2, y: 40 };
  const arm = 112;
  const angle = tilt === "left" ? -8 : tilt === "right" ? 8 : 0;
  const rad = (angle * Math.PI) / 180;
  const end = (side: -1 | 1) => ({
    x: pivot.x + side * arm * Math.cos(rad),
    y: pivot.y + side * arm * Math.sin(rad),
  });
  const pan = (side: -1 | 1, coins: readonly number[]) => {
    const e = end(side);
    const panY = e.y + 78;
    const perRow = 4;
    const r = 12;
    return (
      <g>
        <line x1={e.x} y1={e.y} x2={e.x - 44} y2={panY} stroke="#6b7280" strokeWidth="1.5" />
        <line x1={e.x} y1={e.y} x2={e.x + 44} y2={panY} stroke="#6b7280" strokeWidth="1.5" />
        {coins.map((c, i) => {
          const row = Math.floor(i / perRow);
          const inRow = Math.min(perRow, coins.length - row * perRow);
          const col = i % perRow;
          const cx = e.x + (col - (inRow - 1) / 2) * (r * 2 + 2);
          const cy = panY - r - 1 - row * (r * 2 - 2);
          return (
            <g key={c}>
              <circle cx={cx} cy={cy} r={r} fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
              <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f">
                {c}
              </text>
            </g>
          );
        })}
        <path
          d={`M ${e.x - 56} ${panY} Q ${e.x} ${panY + 26} ${e.x + 56} ${panY} Z`}
          fill="#e5e7eb"
          stroke="#374151"
          strokeWidth="2"
        />
      </g>
    );
  };
  const label =
    left.length === 0 && right.length === 0
      ? t("Пустые весы", "Boʻsh tarozi")
      : t(
          `Весы: слева ${left.join(", ") || "ничего"}, справа ${right.join(", ") || "ничего"}${
            tilt === "equal" ? "" : tilt === "left" ? " — перевесила левая чаша" : " — перевесила правая чаша"
          }`,
          `Tarozi: chapda ${left.join(", ") || "hech narsa"}, oʻngda ${right.join(", ") || "hech narsa"}${
            tilt === "equal" ? "" : tilt === "left" ? " — chap palla ogʻir keldi" : " — oʻng palla ogʻir keldi"
          }`,
        );
  return (
    <svg width="100%" viewBox={`0 0 ${w} 190`} className="max-w-[360px]" role="img" aria-label={label}>
      <polygon points={`${w / 2 - 40},184 ${w / 2 + 40},184 ${w / 2},156`} fill="#9ca3af" />
      <rect x={w / 2 - 4} y={36} width={8} height={126} rx={3} fill="#6b7280" />
      <line
        x1={end(-1).x}
        y1={end(-1).y}
        x2={end(1).x}
        y2={end(1).y}
        stroke="#374151"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx={pivot.x} cy={pivot.y} r={7} fill="#f59e0b" stroke="#374151" strokeWidth="2" />
      {pan(-1, left)}
      {pan(1, right)}
    </svg>
  );
}

export function ScalesPuzzle({ taskId, coins, weighings }: { taskId: string; coins: number; weighings: number }) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [history, setHistory] = useState<WeighingRecord[]>(() => {
    const saved = progress.input?.scales;
    return Array.isArray(saved) ? (saved as WeighingRecord[]) : [];
  });
  const [places, setPlaces] = useState<Record<number, Place>>({});
  const [shown, setShown] = useState<Weighing>("equal");
  const [naming, setNaming] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const all = Array.from({ length: coins }, (_, i) => i + 1);
  const left = all.filter((c) => places[c] === "left");
  const right = all.filter((c) => places[c] === "right");
  const suspects = candidates(coins, history);
  const outOfWeighings = history.length >= weighings;

  const saveHistory = (next: WeighingRecord[]) => {
    setHistory(next);
    saveTaskInput(taskId, { scales: next });
  };

  const cycle = (c: number) => {
    if (done) return;
    if (naming) {
      name(c);
      return;
    }
    const next = { ...places };
    if (!places[c]) next[c] = "left";
    else if (places[c] === "left") next[c] = "right";
    else delete next[c];
    setPlaces(next);
    setShown("equal");
    setFeedback(null);
  };

  const doWeigh = () => {
    if (left.length === 0 || right.length === 0) {
      setFeedback({
        tone: "info",
        text: t("Положи монеты на обе чаши.", "Ikkala pallaga ham tanga qoʻy."),
        sub: t("Нажимай на монеты внизу.", "Pastdagi tangalarni bos."),
      });
      return;
    }
    if (left.length !== right.length) {
      setFeedback({
        tone: "info",
        text: t("На чашах должно быть поровну монет.", "Pallalarda tangalar soni teng boʻlishi kerak."),
        sub: t(
          "Иначе перевесит та чаша, где монет больше, — и про фальшивую монету мы ничего не узнаем.",
          "Aks holda tangasi koʻp palla ogʻir keladi — qalbaki tanga haqida esa hech narsa bilolmaymiz.",
        ),
      });
      return;
    }
    // Если весам всё равно, какой ответ дать, выбираем его по раскладке монет — так ответы разнообразнее.
    const seed = (left.reduce((h, c) => h * 7 + c, 1) + right.reduce((h, c) => h * 11 + c, 3) + history.length) % 97;
    const result = trickyWeigh(suspects, left, right, seed / 97);
    const next = [...history, { left, right, result }];
    saveHistory(next);
    setShown(result);
    const rest = candidates(coins, next);
    if (next.length >= weighings && rest.length > 1) {
      attempts.current++;
      recordCheck(taskId, false);
      setFeedback({
        tone: "retry",
        text: t(
          `Взвешивания закончились, а весы ещё не доказали, какая монета фальшивая.`,
          "Tortishlar tugadi, lekin tarozi qaysi tanga qalbaki ekanini hali isbotlamadi.",
        ),
        sub: t(
          "Фальшивой может оказаться не одна монета. Начни заново и попробуй разделить монеты по-другому.",
          "Hali bir nechta tanga shubhali. Qaytadan boshla va tangalarni boshqacha guruhlarga ajratib koʻr.",
        ),
      });
      return;
    }
    setFeedback({
      tone: "info",
      text: t(`Весы: ${RESULT_TEXT.ru[result]}.`, `Tarozi: ${RESULT_TEXT.uz[result]}.`),
      sub:
        result === "equal"
          ? t(
              "Что это значит? Где может быть фальшивая монета?",
              "Bu nimani bildiradi? Qalbaki tanga qayerda boʻlishi mumkin?",
            )
          : t("Фальшивая монета легче. На какой она чаше?", "Qalbaki tanga yengilroq. U qaysi pallada?"),
    });
  };

  const name = (c: number) => {
    setNaming(false);
    if (suspects.length === 1 && suspects[0] === c) {
      const n = attempts.current++;
      recordCheck(taskId, true);
      addFound(taskId, `len:${history.length}`);
      setDone(true);
      setFeedback({
        tone: "success",
        text: t(`${praise(n, lang)} Фальшивая — монета № ${c}.`, `${praise(n, lang)} Qalbakisi — ${c}-tanga.`),
        sub: t(
          `Это доказано за ${weighingsWord(history.length, lang)}. ${askExplain(n, lang)}`,
          `Buni ${weighingsWord(history.length, lang)}da isbotlading. ${askExplain(n, lang)}`,
        ),
      });
      return;
    }
    attempts.current++;
    recordCheck(taskId, false);
    if (!suspects.includes(c)) {
      const proof = history.findIndex((h) => !candidates(coins, [h]).includes(c));
      setFeedback({
        tone: "retry",
        text: t(`Монета № ${c} точно настоящая.`, `${c}-tanga aniq haqiqiy.`),
        sub: t(
          `Посмотри ещё раз на взвешивание № ${proof + 1}: могла ли там фальшивая монета быть на этом месте?`,
          `${proof + 1}-tortishga yana bir qara: qalbaki tanga oʻshanda shu joyda boʻlishi mumkinmidi?`,
        ),
      });
      return;
    }
    setFeedback({
      tone: "retry",
      text: t(`Может быть, это монета № ${c}. А может быть, и другая.`, `Balki bu ${c}-tangadir. Balki boshqasidir.`),
      sub: t(
        "Весы пока не доказали, какая монета фальшивая. Нужно ещё взвешивание.",
        "Tarozi qaysi tanga qalbaki ekanini hali isbotlamadi. Yana tortib koʻrish kerak.",
      ),
    });
  };

  const restart = () => {
    saveHistory([]);
    setPlaces({});
    setShown("equal");
    setNaming(false);
    setDone(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">
        {t(
          "Нажимай на монету: первый раз она ляжет на левую чашу, второй — на правую, третий — вернётся на стол.",
          "Tangani bos: birinchi marta u chap pallaga tushadi, ikkinchi marta — oʻng pallaga, uchinchi marta — stolga qaytadi.",
        )}
      </p>

      <div className="flex flex-col items-center rounded-3xl bg-white p-3 shadow-card">
        <CoinScale left={left} right={right} tilt={shown} />
        <div className="mt-2 flex flex-wrap justify-center gap-1.5" role="group" aria-label={t("Монеты", "Tangalar")}>
          {all.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => cycle(c)}
              disabled={done}
              aria-label={t(
                `Монета ${c}: ${places[c] === "left" ? "на левой чаше" : places[c] === "right" ? "на правой чаше" : "на столе"}`,
                `${c}-tanga: ${places[c] === "left" ? "chap pallada" : places[c] === "right" ? "oʻng pallada" : "stolda"}`,
              )}
              className={cn(
                "flex h-16 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 transition",
                naming
                  ? "border-sun bg-sun-soft hover:bg-[#fde68a]"
                  : places[c] === "left"
                    ? "border-brand bg-brand-soft"
                    : places[c] === "right"
                      ? "border-[#d97706] bg-[#fff7ed]"
                      : "border-line bg-white hover:border-brand/40",
              )}
            >
              <Coin n={c} size={30} muted={!!places[c] && !naming} />
              <span className="text-[0.65rem] font-extrabold text-muted">
                {places[c] === "left"
                  ? t("слева", "chapda")
                  : places[c] === "right"
                    ? t("справа", "oʻngda")
                    : t("на столе", "stolda")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={doWeigh} disabled={done || outOfWeighings}>
          ⚖️ {t("Взвесить", "Tortish")}
        </Button>
        <Button
          variant={naming ? "sun" : "secondary"}
          onClick={() => {
            setNaming(!naming);
            setFeedback(
              naming
                ? null
                : {
                    tone: "info",
                    text: t("Нажми на монету, которую считаешь фальшивой.", "Qalbaki deb oʻylagan tangangni bos."),
                    sub: t(
                      "Помни: нужна полная уверенность!",
                      "Esingda boʻlsin: bunga ishonching komil boʻlishi kerak!",
                    ),
                  },
            );
          }}
          disabled={done}
        >
          🔍 {t("Это фальшивая…", "Qalbakisini topdim…")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setPlaces({});
            setShown("equal");
          }}
          disabled={done || (left.length === 0 && right.length === 0)}
        >
          {t("Снять монеты", "Tangalarni olish")}
        </Button>
        <Button variant="ghost" onClick={restart}>
          ↺ {t("Начать заново", "Qaytadan boshlash")}
        </Button>
      </div>

      <p className="flex items-center gap-2 text-sm font-extrabold text-muted">
        {t(`Взвешиваний: ${history.length} из ${weighings}`, `Tortishlar: ${weighings} tadan ${history.length} tasi`)}
        <span className="flex gap-1" aria-hidden>
          {Array.from({ length: weighings }, (_, i) => (
            <span
              key={i}
              className={cn("h-3 w-3 rounded-full", i < history.length ? "bg-brand" : "border-2 border-line")}
            />
          ))}
        </span>
      </p>

      <Feedback state={feedback} />

      {history.length > 0 && (
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">{t("Дневник взвешиваний", "Tortishlar kundaligi")}</p>
          <ol className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="w-5 text-right font-bold text-muted">{i + 1}.</span>
                <span className="flex gap-0.5">
                  {h.left.map((c) => (
                    <Coin key={c} n={c} size={24} />
                  ))}
                </span>
                <span className="font-black text-muted">{t("и", "va")}</span>
                <span className="flex gap-0.5">
                  {h.right.map((c) => (
                    <Coin key={c} n={c} size={24} />
                  ))}
                </span>
                <span className="font-bold">→ {RESULT_TEXT[lang][h.result]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
