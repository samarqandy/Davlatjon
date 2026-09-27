"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { chessImage } from "@/content/chess/images";
import {
  DILARAM,
  ENVOY_ROUNDS,
  PIECE_NAMES_RU,
  RIDDLES,
  SAGES,
  SECRETS,
  TURK_OPTIONS,
  TURK_REVEAL,
  formatBig,
  grainsOn,
  grainsUpTo,
  knightMoves,
  squareName,
  warnsdorffBest,
  type Secret,
  type SecretWidget,
} from "@/content/chess/secrets";
import { useAgeProfile } from "@/lib/age";
import { useHash } from "@/lib/useHash";
import { ChessBoard, PieceIcon, type SquareMark } from "./ChessBoard";
import { Figure, Portrait } from "./Figure";

/** Страница «Тайны шахмат»: карточки-истории с крючком, картинкой и встроенной игрой; загадки про фигуры. */
export function Secrets() {
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
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Тайны и легенды</p>
        <h1 className="text-3xl font-black">Тайны шахмат</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Учёные Хорезма и Бухары, сказания «Шахнаме», халифы Багдада, машина, которая обманула Европу, и задача,
          которую не могли решить тысячу лет. Нажми на вопрос — и узнай ответ.
        </p>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="Разделы">
          <a
            href="#stories"
            className="rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-brand-dark shadow-sm"
          >
            🔮 {SECRETS.length} историй
          </a>
          <a
            href="#riddles"
            className="rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-brand-dark shadow-sm"
          >
            🧩 {RIDDLES.length} загадок
          </a>
        </nav>
      </header>

      <section id="stories" className="scroll-mt-24 space-y-3" aria-label="Истории">
        {SECRETS.map((s) => (
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
          🧩 Загадки про фигуры
        </h2>
        <p className="text-muted">Угадай, о ком речь. Ошибся — не беда: под ответом написано, почему.</p>
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
  const img = s.image ? chessImage(s.image) : undefined;
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
              <summary className="cursor-pointer font-extrabold text-brand-dark">🔎 Для тех, кто постарше</summary>
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
function grainScale(k: number): string {
  if (k < 10) return "Пока это горсть.";
  if (k < 17) return "Уже от горсти до пары килограммов.";
  if (k < 25) return "Это мешки: сотни килограммов.";
  if (k < 33) return "Целый грузовик — больше ста тонн.";
  if (k < 41) return "Это огромный корабль, полный зерна.";
  if (k < 49) return "Столько пшеницы за год собирает целая страна.";
  if (k < 57) return "Больше, чем весь мир собирает за несколько лет.";
  return "Больше, чем весь мир вырастил бы почти за тысячу лет. Царь разорён!";
}

function GrainsBoard() {
  const [n, setN] = useState(0);
  return (
    <div className="rounded-2xl bg-sun-soft/60 p-4">
      <p className="font-extrabold">🌾 Нажимай на клетки: на каждой следующей зёрен вдвое больше</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <div
          className="grid w-[320px] max-w-full grid-cols-8 overflow-hidden rounded-lg border-2 border-[#8a5a2b]"
          role="group"
          aria-label="Доска с зёрнами"
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
                aria-label={`Клетка ${k}`}
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
            <p className="text-lg">Нажми на клетку в левом нижнем углу — это первая, a1.</p>
          ) : (
            <>
              <p className="text-sm font-extrabold text-muted">Клетка {n} из 64</p>
              <p className="text-lg font-black break-words">На ней зёрен: {formatBig(grainsOn(n))}</p>
              <p className="break-words">
                Всего на доске: <b>{formatBig(grainsUpTo(n))}</b>
              </p>
              <p className="font-semibold text-[#7a4b00]">{grainScale(n)}</p>
            </>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" onClick={() => setN(Math.min(64, n + 1))} disabled={n >= 64}>
              Следующая клетка
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setN(64)} disabled={n >= 64}>
              Сразу до 64
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setN(0)} disabled={n === 0}>
              Сначала
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ENVOY_OPTIONS = ["Конь", "Слон", "Ладья", "Ферзь", "Король", "Пешка"];

function EnvoyGame() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  if (round >= ENVOY_ROUNDS.length) {
    return (
      <div className="rounded-2xl bg-mint-soft/70 p-4 text-center">
        <p className="text-xl font-black">
          {score === ENVOY_ROUNDS.length
            ? "🏆 Все фигуры разгаданы — как Бузурджмихр!"
            : `Разгадано ${score} из ${ENVOY_ROUNDS.length}.`}
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
          ↺ Ещё раз
        </Button>
      </div>
    );
  }
  const r = ENVOY_ROUNDS[round];
  const answer = PIECE_NAMES_RU[r.piece];
  const marks: Record<string, SquareMark> = { [r.from]: "selected" };
  for (const t of r.targets) marks[t] = "target";
  return (
    <div className="rounded-2xl bg-brand-soft/40 p-4">
      <p className="font-extrabold">
        🎁 Загадка посла {round + 1} из {ENVOY_ROUNDS.length}: звёздочка — таинственная фигура, точки — все клетки, куда
        она может пойти. Кто это?
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
        <ChessBoard
          id={`envoy-${round}`}
          position={{ [r.from]: "star" }}
          marks={marks}
          maxWidth={320}
          className="!mx-0"
          label="Загадка посла"
        />
        <div className="flex flex-wrap content-start gap-2">
          {ENVOY_OPTIONS.map((o) => (
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
                  ? `Верно! Это ${answer.toLowerCase()}.`
                  : `Это ${answer.toLowerCase()}: посмотри на форму ходов ещё раз.`}
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setRound((x) => x + 1);
                  setPicked(null);
                }}
              >
                Дальше →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KnightTour() {
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
      <p className="font-extrabold">♞ Путешествие коня: нажми на любую клетку, потом ходи только конём</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <div
          className="grid w-[320px] max-w-full grid-cols-8 overflow-hidden rounded-lg border-2 border-[#8a5a2b]"
          role="group"
          aria-label="Доска для коня"
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
                aria-label={`${squareName(sq)}${order.has(sq) ? `, ход ${order.get(sq)}` : canGo ? ", можно пойти" : ""}`}
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
            Пройдено: {path.length} из 64{best > 0 && ` · рекорд ${best}`}
          </p>
          {path.length === 64 ? (
            <p className="rounded-2xl bg-mint-soft px-3 py-2 font-semibold">
              🏆 Все 64 клетки! Ты повторил подвиг аль-Адли.
            </p>
          ) : stuck ? (
            <p className="rounded-2xl bg-sun-soft px-3 py-2 font-semibold">
              Тупик: коню некуда прыгнуть. Попробуй ещё раз — с подсказкой будет легче.
            </p>
          ) : current === undefined ? (
            <p>Совет Эйлера: начни с угла и сначала обходи края.</p>
          ) : (
            <p className="text-muted">Подсвечены клетки, куда можно прыгнуть.</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" variant={hint ? "success" : "secondary"} onClick={() => setHint((h) => !h)}>
              {hint ? "✓ Подсказка включена" : "Подсказка Варнсдорфа"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPath((p) => p.slice(0, -1))}
              disabled={!path.length}
            >
              ↶ Отменить
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPath([])} disabled={!path.length}>
              Сначала
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DilaramStory() {
  const [i, setI] = useState(0);
  const f = DILARAM[i];
  return (
    <div className="rounded-2xl bg-white p-4 ring-2 ring-line">
      <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
        <ChessBoard id="dilaram" position={f.fen} maxWidth={340} className="!mx-0" label="Задача Дилярам" />
        <div>
          <p className="text-sm font-extrabold text-muted">
            Кадр {i + 1} из {DILARAM.length} · старинные правила шатранджа
          </p>
          <p className="mt-1 text-lg font-semibold" aria-live="polite">
            {f.text}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Назад">
              ◀
            </Button>
            <Button size="sm" onClick={() => setI(i + 1)} disabled={i === DILARAM.length - 1}>
              Дальше ▶
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setI(0)} disabled={i === 0}>
              Сначала
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TurkReveal() {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="rounded-2xl bg-brand-soft/40 p-4">
      <p className="font-extrabold">🤖 В чём был секрет «Турка»?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {TURK_OPTIONS.map((o, i) => (
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
          {TURK_OPTIONS[picked].right ? "Точно! " : "Нет — всё проще и хитрее. "}
          {TURK_REVEAL}
        </p>
      )}
    </div>
  );
}

function Sages() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SAGES.map((s) => {
        const img = s.image ? chessImage(s.image) : undefined;
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
  const [picked, setPicked] = useState<Record<number, string>>({});
  const solved = RIDDLES.filter((r, i) => picked[i] === r.answer).length;
  return (
    <div className="space-y-3">
      <p className="text-sm font-extrabold text-brand-dark">
        Отгадано: {solved} из {RIDDLES.length}
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {RIDDLES.map((r, i) => {
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
                  {p === r.answer ? "✅ Верно! " : `Это ${r.answer.toLowerCase()}. `}
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
