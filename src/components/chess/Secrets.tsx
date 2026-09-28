"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { chessImageIn } from "@/content/chess/content";
import {
  ENVOY_ROUNDS,
  formatBig,
  grainsOn,
  grainsUpTo,
  knightMoves,
  squareName,
  warnsdorffBest,
  type EnvoyRound,
  type Secret,
  type SecretWidget,
} from "@/content/chess/secrets";
import { useAgeProfile } from "@/lib/age";
import { useChess, useChessImage } from "@/lib/useChess";
import { useHash } from "@/lib/useHash";
import { ChessBoard, PieceIcon, type SquareMark } from "./ChessBoard";
import { Figure, Portrait } from "./Figure";
import { ListenButton } from "@/components/ListenButton";
import { useLang, useT, type T } from "@/lib/i18n";
import { VOICE_CLIPS } from "@/lib/voice";

/** Страница «Тайны шахмат»: карточки-истории с крючком, картинкой и встроенной игрой; загадки про фигуры. */
export function Secrets() {
  const t = useT();
  const { secrets, riddles } = useChess();
  const hash = useHash().replace(/^#/, "");
  const profile = useAgeProfile();
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [closed, setClosed] = useState<Set<string>>(() => new Set());
  const isOpen = (id: string) => (opened.has(id) || hash === id) && !closed.has(id);
  const toggle = (id: string) => {
    if (isOpen(id)) {
      setClosed((c) => new Set(c).add(id));
      setOpened((o) => {
        const n = new Set(o);
        n.delete(id);
        return n;
      });
    } else {
      setOpened((o) => new Set(o).add(id));
      setClosed((c) => {
        const n = new Set(c);
        n.delete(id);
        return n;
      });
    }
  };

  return (
    <div className="space-y-8">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
          {t("Тайны и легенды", "Sirlar va afsonalar")}
        </p>
        <h1 className="text-3xl font-black">{t("Тайны шахмат", "Shaxmat sirlari")}</h1>
        <p className="mt-1 max-w-2xl text-muted">
          {t(
            "Учёные Хорезма и Бухары, сказания «Шахнаме», халифы Багдада, машина, которая обманула Европу, и задача, которую не могли решить тысячу лет. Нажми на вопрос — и узнай ответ.",
            "Xorazm va Buxoro olimlari, «Shohnoma» rivoyatlari, Bagʻdod xalifalari, butun Yevropani aldagan mashina va ming yil davomida hech kim yecha olmagan masala. Savolni bos — javobini bilib olasan.",
          )}
        </p>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label={t("Разделы", "Boʻlimlar")}>
          <a
            href="#stories"
            className="rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-brand-dark shadow-sm"
          >
            🔮 {t(`${secrets.length} историй`, `${secrets.length} ta hikoya`)}
          </a>
          <a
            href="#riddles"
            className="rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-brand-dark shadow-sm"
          >
            🧩 {t(`${riddles.length} загадок`, `${riddles.length} ta topishmoq`)}
          </a>
        </nav>
      </header>

      <section id="stories" className="scroll-mt-24 space-y-3" aria-label={t("Истории", "Hikoyalar")}>
        {secrets.map((s) => (
          <SecretCard
            key={s.id}
            secret={s}
            open={isOpen(s.id)}
            onToggle={() => toggle(s.id)}
            deeperOpen={profile.id !== "junior"}
          />
        ))}
      </section>

      <section id="riddles" className="scroll-mt-24 space-y-3" aria-labelledby="riddles-h">
        <h2 id="riddles-h" className="text-2xl font-black">
          {t("🧩 Загадки про фигуры", "🧩 Donalar haqida topishmoqlar")}
        </h2>
        <p className="text-muted">
          {t(
            "Угадай, о ком речь. Ошибся — не беда: под ответом написано, почему.",
            "Kim haqida gap ketayotganini top. Adashsang ham mayli: javob ostida nega shundayligi yozilgan.",
          )}
        </p>
        <Riddles />
      </section>
    </div>
  );
}

function SecretCard({
  secret: s,
  open,
  onToggle,
  deeperOpen,
}: {
  secret: Secret;
  open: boolean;
  onToggle: () => void;
  deeperOpen: boolean;
}) {
  const img = useChessImage(s.image);
  const t = useT();
  const lang = useLang();
  return (
    <article
      id={s.id}
      className={cn("scroll-mt-24 rounded-3xl bg-white shadow-card transition", open && "ring-2 ring-brand/30")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-3xl p-4 text-left hover:bg-brand-soft/30 sm:p-5"
      >
        <span className="text-3xl" aria-hidden>
          {s.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg leading-snug font-black">{s.hook}</span>
          <span className="mt-1 block text-xs font-extrabold tracking-wide text-muted uppercase">
            {s.title} · {s.when}
          </span>
        </span>
        <span className="mt-1 text-sm font-black text-muted" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-5 sm:px-5">
          <div className="gap-5 sm:flex sm:items-start">
            <div className="min-w-0 flex-1 space-y-2 text-lg leading-relaxed">
              <ListenButton
                src={VOICE_CLIPS.secret(s.id, lang)}
                text={[s.hook, ...s.story].join(" ")}
                label={t("Послушать историю", "Hikoyani tinglash")}
              />
              {s.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {img && (
              <Figure
                image={img}
                className="mt-3 sm:mt-0 sm:w-64 sm:shrink-0"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            )}
          </div>
          {s.widget && <Widget kind={s.widget} />}
          {s.deeper && (
            <details className="rounded-2xl bg-brand-soft/50 px-4 py-3" open={deeperOpen || undefined}>
              <summary className="cursor-pointer font-extrabold text-brand-dark">
                {t("🔎 Для тех, кто постарше", "🔎 Kattaroqlar uchun")}
              </summary>
              <p className="mt-2">{s.deeper}</p>
            </details>
          )}
          {s.link && (
            <Link href={s.link.href} className="inline-block text-sm font-extrabold text-brand hover:underline">
              {s.link.label} →
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

function Widget({ kind }: { kind: SecretWidget }) {
  switch (kind) {
    case "grains":
      return <GrainsBoard />;
    case "envoy":
      return <EnvoyGame />;
    case "knight-tour":
      return <KnightTour />;
    case "dilaram":
      return <DilaramStory />;
    case "turk":
      return <TurkReveal />;
    case "sages":
      return <Sages />;
  }
}

/** Сколько это зерна — по-человечески. Зерно пшеницы весит около 0,04 г. */
function grainScale(k: number, t: T): string {
  if (k < 10) return t("Пока это горсть.", "Hozircha bu bir hovuch.");
  if (k < 17) return t("Уже от горсти до пары килограммов.", "Endi bir hovuchdan bir-ikki kilogrammgacha.");
  if (k < 25) return t("Это мешки: сотни килограммов.", "Bu endi qoplar: yuzlab kilogramm.");
  if (k < 33) return t("Целый грузовик — больше ста тонн.", "Butun boshli yuk mashinasi — yuz tonnadan ham koʻp.");
  if (k < 41) return t("Это огромный корабль, полный зерна.", "Bu — donga liq toʻla ulkan kema.");
  if (k < 49)
    return t(
      "Столько пшеницы за год собирает целая страна.",
      "Shuncha bugʻdoyni butun boshli bir mamlakat bir yilda yigʻib oladi.",
    );
  if (k < 57)
    return t(
      "Больше, чем весь мир собирает за несколько лет.",
      "Butun dunyo bir necha yilda yigʻadigan hosildan ham koʻp.",
    );
  return t(
    "Больше, чем весь мир вырастил бы почти за тысячу лет. Царь разорён!",
    "Butun dunyo qariyb ming yilda yetishtiradigan hosildan ham koʻp. Podshoh xonavayron boʻldi!",
  );
}

function GrainsBoard() {
  const t = useT();
  const [n, setN] = useState(0);
  return (
    <div className="rounded-2xl bg-sun-soft/60 p-4">
      <p className="font-extrabold">
        {t(
          "🌾 Нажимай на клетки: на каждой следующей зёрен вдвое больше",
          "🌾 Kataklarni bosib chiq: har bir keyingi katakda don ikki baravar koʻp",
        )}
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <div
          className="grid w-[320px] max-w-full grid-cols-8 overflow-hidden rounded-lg border-2 border-[#8a5a2b]"
          role="group"
          aria-label={t("Доска с зёрнами", "Donlar taxtasi")}
        >
          {Array.from({ length: 64 }, (_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const k = (7 - row) * 8 + col + 1;
            const dark = (row + col) % 2 === 1;
            const on = k <= n;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setN(k)}
                aria-label={t(`Клетка ${k}`, `${k}-katak`)}
                aria-pressed={on}
                className={cn(
                  "aspect-square text-[10px] font-black transition",
                  dark ? "bg-[#b58863] text-white/80" : "bg-[#f0d9b5] text-[#7a4b00]/80",
                  on && "!bg-[#facc15] !text-[#7a4b00]",
                )}
              >
                {on ? k : ""}
              </button>
            );
          })}
        </div>
        <div className="space-y-2" aria-live="polite">
          {n === 0 ? (
            <p className="text-lg">
              {t(
                "Нажми на клетку в левом нижнем углу — это первая, a1.",
                "Chap pastki burchakdagi katakni bos — bu birinchi katak, a1.",
              )}
            </p>
          ) : (
            <>
              <p className="text-sm font-extrabold text-muted">{t(`Клетка ${n} из 64`, `${n}-katak, jami 64 ta`)}</p>
              <p className="text-lg font-black break-words">
                {t(`На ней зёрен: ${formatBig(grainsOn(n))}`, `Bu katakda: ${formatBig(grainsOn(n))} ta don`)}
              </p>
              <p className="break-words">
                {t("Всего на доске", "Taxtada jami")}: <b>{formatBig(grainsUpTo(n))}</b>
              </p>
              <p className="font-semibold text-[#7a4b00]">{grainScale(n, t)}</p>
            </>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" onClick={() => setN(Math.min(64, n + 1))} disabled={n >= 64}>
              {t("Следующая клетка", "Keyingi katak")}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setN(64)} disabled={n >= 64}>
              {t("Сразу до 64", "Birdaniga 64 gacha")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setN(0)} disabled={n === 0}>
              {t("Сначала", "Boshidan")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Варианты ответа в «Загадке посла» — в этом порядке. */
const ENVOY_PIECES: EnvoyRound["piece"][] = ["n", "b", "r", "q", "k", "p"];

function EnvoyGame() {
  const t = useT();
  const { pieceNames } = useChess();
  const options = ENVOY_PIECES.map((p) => pieceNames[p]);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  if (round >= ENVOY_ROUNDS.length) {
    return (
      <div className="rounded-2xl bg-mint-soft/70 p-4 text-center">
        <p className="text-xl font-black">
          {score === ENVOY_ROUNDS.length
            ? t("🏆 Все фигуры разгаданы — как Бузурджмихр!", "🏆 Hamma donalarni topding — xuddi Buzurgmehr kabi!")
            : t(
                `Разгадано ${score} из ${ENVOY_ROUNDS.length}.`,
                `${ENVOY_ROUNDS.length} tadan ${score} tasini topding.`,
              )}
        </p>
        <Button
          size="sm"
          className="mt-2"
          onClick={() => {
            setRound(0);
            setScore(0);
            setPicked(null);
          }}
        >
          {t("↺ Ещё раз", "↺ Yana bir marta")}
        </Button>
      </div>
    );
  }
  const r = ENVOY_ROUNDS[round];
  const answer = pieceNames[r.piece];
  const marks: Record<string, SquareMark> = { [r.from]: "selected" };
  for (const t of r.targets) marks[t] = "target";
  return (
    <div className="rounded-2xl bg-brand-soft/40 p-4">
      <p className="font-extrabold">
        {t(
          `🎁 Загадка посла ${round + 1} из ${ENVOY_ROUNDS.length}: звёздочка — таинственная фигура, точки — все клетки, куда она может пойти. Кто это?`,
          `🎁 Elchining ${round + 1}-topishmogʻi (jami ${ENVOY_ROUNDS.length} ta): yulduzcha — sirli dona, nuqtalar — u yura oladigan hamma kataklar. Bu kim?`,
        )}
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
        <ChessBoard
          id={`envoy-${round}`}
          position={{ [r.from]: "star" }}
          marks={marks}
          maxWidth={320}
          className="!mx-0"
          label={t("Загадка посла", "Elchining topishmogʻi")}
        />
        <div className="flex flex-wrap content-start gap-2">
          {options.map((o) => (
            <Button
              key={o}
              size="sm"
              variant={picked ? (o === answer ? "success" : o === picked ? "secondary" : "soft") : "soft"}
              disabled={!!picked}
              onClick={() => {
                setPicked(o);
                if (o === answer) setScore((s) => s + 1);
              }}
            >
              {o}
            </Button>
          ))}
          {picked && (
            <div className="w-full space-y-2" aria-live="polite">
              <p className="font-semibold">
                {picked === answer
                  ? t(`Верно! Это ${answer.toLowerCase()}.`, `Toʻgʻri! Bu — ${answer.toLowerCase()}.`)
                  : t(
                      `Это ${answer.toLowerCase()}: посмотри на форму ходов ещё раз.`,
                      `Bu — ${answer.toLowerCase()}. Uning yurishlari qanday shaklda ekaniga yana bir qarab koʻr.`,
                    )}
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setRound((x) => x + 1);
                  setPicked(null);
                }}
              >
                {t("Дальше →", "Keyingisi →")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KnightTour() {
  const t = useT();
  const [path, setPath] = useState<number[]>([]);
  const [best, setBest] = useState(0);
  const [hint, setHint] = useState(false);
  const current = path.length ? path[path.length - 1] : undefined;
  const visited = new Set(path);
  const legal = current === undefined ? [] : knightMoves(current).filter((s) => !visited.has(s));
  const hints = hint && current !== undefined ? warnsdorffBest(current, visited) : [];
  const stuck = current !== undefined && legal.length === 0;
  const order = new Map(path.map((s, i) => [s, i + 1]));
  const tap = (sq: number) => {
    if (current === undefined) setPath([sq]);
    else if (legal.includes(sq)) {
      const next = [...path, sq];
      setPath(next);
      if (next.length > best) setBest(next.length);
    }
  };
  return (
    <div className="rounded-2xl bg-brand-soft/40 p-4">
      <p className="font-extrabold">
        {t(
          "♞ Путешествие коня: нажми на любую клетку, потом ходи только конём",
          "♞ Otning sayohati: istalgan katakni bos, keyin faqat ot bilan yur",
        )}
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <div
          className="grid w-[320px] max-w-full grid-cols-8 overflow-hidden rounded-lg border-2 border-[#8a5a2b]"
          role="group"
          aria-label={t("Доска для коня", "Ot uchun taxta")}
        >
          {Array.from({ length: 64 }, (_, i) => {
            const row = 7 - Math.floor(i / 8);
            const col = i % 8;
            const sq = row * 8 + col;
            const dark = (row + col) % 2 === 0;
            const isCurrent = sq === current;
            const canGo = legal.includes(sq);
            return (
              <button
                key={sq}
                type="button"
                onClick={() => tap(sq)}
                aria-label={`${squareName(sq)}${
                  order.has(sq)
                    ? t(`, ход ${order.get(sq)}`, `, ${order.get(sq)}-yurish`)
                    : canGo
                      ? t(", можно пойти", ", yurish mumkin")
                      : ""
                }`}
                disabled={current !== undefined && !canGo}
                className={cn(
                  "relative flex aspect-square items-center justify-center text-[11px] font-black transition",
                  dark ? "bg-[#b58863] text-white" : "bg-[#f0d9b5] text-[#7a4b00]",
                  order.has(sq) && !isCurrent && "!bg-[#facc15]/80 !text-[#7a4b00]",
                  canGo && "ring-4 ring-brand/50 ring-inset",
                  hints.includes(sq) && "ring-4 !ring-mint ring-inset",
                )}
              >
                {isCurrent ? <PieceIcon piece="wN" className="h-[80%] w-[80%]" /> : (order.get(sq) ?? "")}
              </button>
            );
          })}
        </div>
        <div className="space-y-2" aria-live="polite">
          <p className="text-lg font-black">
            {t(`Пройдено: ${path.length} из 64`, `Bosib oʻtilgan kataklar: ${path.length} / 64`)}
            {best > 0 && t(` · рекорд ${best}`, ` · rekord: ${best}`)}
          </p>
          {path.length === 64 ? (
            <p className="rounded-2xl bg-mint-soft px-3 py-2 font-semibold">
              {t(
                "🏆 Все 64 клетки! Ты повторил подвиг аль-Адли.",
                "🏆 Hamma 64 katak! Sen al-Adliyning jasoratini takrorlading.",
              )}
            </p>
          ) : stuck ? (
            <p className="rounded-2xl bg-sun-soft px-3 py-2 font-semibold">
              {t(
                "Тупик: коню некуда прыгнуть. Попробуй ещё раз — с подсказкой будет легче.",
                "Boshi berk koʻcha: otning sakraydigan joyi qolmadi. Yana urinib koʻr — maslahat bilan osonroq boʻladi.",
              )}
            </p>
          ) : current === undefined ? (
            <p>
              {t(
                "Совет Эйлера: начни с угла и сначала обходи края.",
                "Eylerning maslahati: burchakdan boshla va avval chetlarini aylanib chiq.",
              )}
            </p>
          ) : (
            <p className="text-muted">
              {t("Подсвечены клетки, куда можно прыгнуть.", "Sakrash mumkin boʻlgan kataklar belgilab qoʻyilgan.")}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" variant={hint ? "success" : "secondary"} onClick={() => setHint((h) => !h)}>
              {hint
                ? t("✓ Подсказка включена", "✓ Maslahat yoqilgan")
                : t("Подсказка Варнсдорфа", "Varnsdorf maslahati")}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPath((p) => p.slice(0, -1))}
              disabled={!path.length}
            >
              {t("↶ Отменить", "↶ Bekor qilish")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPath([])} disabled={!path.length}>
              {t("Сначала", "Boshidan")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DilaramStory() {
  const t = useT();
  const { dilaram } = useChess();
  const [i, setI] = useState(0);
  const f = dilaram[i];
  return (
    <div className="rounded-2xl bg-white p-4 ring-2 ring-line">
      <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
        <ChessBoard
          id="dilaram"
          position={f.fen}
          maxWidth={340}
          className="!mx-0"
          label={t("Задача Дилярам", "Dilorom masalasi")}
        />
        <div>
          <p className="text-sm font-extrabold text-muted">
            {t(
              `Кадр ${i + 1} из ${dilaram.length} · старинные правила шатранджа`,
              `${i + 1}-kadr, jami ${dilaram.length} ta · shatranjning qadimiy qoidalari`,
            )}
          </p>
          <p className="mt-1 text-lg font-semibold" aria-live="polite">
            {f.text}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setI(i - 1)}
              disabled={i === 0}
              aria-label={t("Назад", "Orqaga")}
            >
              ◀
            </Button>
            <Button size="sm" onClick={() => setI(i + 1)} disabled={i === dilaram.length - 1}>
              {t("Дальше ▶", "Keyingisi ▶")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setI(0)} disabled={i === 0}>
              {t("Сначала", "Boshidan")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TurkReveal() {
  const t = useT();
  const { turkOptions, turkReveal } = useChess();
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="rounded-2xl bg-brand-soft/40 p-4">
      <p className="font-extrabold">{t("🤖 В чём был секрет «Турка»?", "🤖 «Turk»ning siri nimada edi?")}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {turkOptions.map((o, i) => (
          <Button
            key={o.text}
            size="sm"
            variant={picked === null ? "soft" : o.right ? "success" : picked === i ? "secondary" : "soft"}
            disabled={picked !== null}
            onClick={() => setPicked(i)}
          >
            {o.text}
          </Button>
        ))}
      </div>
      {picked !== null && (
        <p className="mt-3 rounded-2xl bg-white px-4 py-3 font-semibold" aria-live="polite">
          {turkOptions[picked].right
            ? t("Точно! ", "Toʻppa-toʻgʻri! ")
            : t("Нет — всё проще и хитрее. ", "Yoʻq — hammasi oddiyroq va ayyorroq. ")}
          {turkReveal}
        </p>
      )}
    </div>
  );
}

function Sages() {
  const lang = useLang();
  const { sages } = useChess();
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sages.map((s) => {
        const img = chessImageIn(lang, s.image);
        return (
          <li key={s.name} className="rounded-2xl bg-sun-soft/60 p-4">
            <div className="flex items-center gap-3">
              {img && <Portrait image={img} size={48} />}
              <div>
                <p className="font-black">{s.name}</p>
                <p className="text-xs font-bold text-muted">{s.where}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted">{s.fact}</p>
            <p className="mt-2 font-semibold">💬 {s.advice}</p>
          </li>
        );
      })}
    </ul>
  );
}

function Riddles() {
  const t = useT();
  const { riddles } = useChess();
  const [picked, setPicked] = useState<Record<number, string>>({});
  const solved = riddles.filter((r, i) => picked[i] === r.answer).length;
  return (
    <div className="space-y-3">
      <p className="text-sm font-extrabold text-brand-dark">
        {t(`Отгадано: ${solved} из ${riddles.length}`, `Topilgan topishmoqlar: ${solved} / ${riddles.length}`)}
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {riddles.map((r, i) => {
          const p = picked[i];
          return (
            <li key={r.text} className="rounded-3xl bg-white p-4 shadow-card">
              <p className="text-lg font-black">
                {i + 1}. {r.text}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {r.options.map((o) => (
                  <Button
                    key={o}
                    size="sm"
                    variant={p ? (o === r.answer ? "success" : o === p ? "secondary" : "soft") : "soft"}
                    disabled={!!p}
                    onClick={() => setPicked((x) => ({ ...x, [i]: o }))}
                  >
                    {o}
                  </Button>
                ))}
              </div>
              {p && (
                <p className="mt-2 text-sm font-semibold" aria-live="polite">
                  {p === r.answer
                    ? t("✅ Верно! ", "✅ Toʻgʻri! ")
                    : t(`Это ${r.answer.toLowerCase()}. `, `Bu — ${r.answer.toLowerCase()}. `)}
                  {r.why}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
