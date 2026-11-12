"use client";

import { Dices } from "lucide-react";
import { useState } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { random } from "@/lib/random";
import { createTournament, parsePlayers, type Seeding } from "@/lib/tournament/engine";
import { bracketSize, knockoutRounds } from "@/lib/tournament/knockout";
import { saveTournament } from "@/lib/tournament/store";
import { maxSwissRounds, recommendedSwissRounds } from "@/lib/tournament/swiss";
import { FORMAT_LIMITS, type TournamentFormat } from "@/lib/tournament/types";
import { setHash } from "@/lib/useHash";
import { formatName } from "./shared";

const FORMATS: TournamentFormat[] = ["roundRobin", "doubleRoundRobin", "swiss", "knockout"];

/** Новый турнир: название, система, участники, стартовые номера — и сразу жеребьёвка первого тура. */
export function TournamentCreate() {
  const t = useT();
  const [name, setName] = useState("");
  const [format, setFormat] = useState<TournamentFormat>("roundRobin");
  const [text, setText] = useState("");
  const [seeding, setSeeding] = useState<Seeding>("lot");
  const [rounds, setRounds] = useState<number | null>(null);
  const [thirdPlace, setThirdPlace] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const players = parsePlayers(text);
  const n = players.length;
  const limits = FORMAT_LIMITS[format];
  const swissRounds = Math.min(rounds ?? recommendedSwissRounds(n), maxSwissRounds(n));
  const duplicates = [...new Set(players.map((p) => p.name).filter((x, i, all) => all.indexOf(x) !== i))];

  const about: Record<TournamentFormat, string> = {
    roundRobin: t(
      "Каждый играет с каждым. Самый честный итог; удобно до 8–10 участников.",
      "Har kim har kim bilan oʻynaydi. Eng adolatli natija; 8–10 ishtirokchigacha qulay.",
    ),
    doubleRoundRobin: t(
      "С каждым по две партии — белыми и чёрными. Для 3–6 участников.",
      "Har bir raqib bilan ikki partiya — oqlar va qoralar bilan. 3–6 ishtirokchi uchun.",
    ),
    swiss: t(
      "Несколько туров, никто не выбывает, соперники — с равными очками. Для больших турниров.",
      "Bir necha tur, hech kim chiqib ketmaydi, raqiblar — ochkosi teng oʻyinchilar. Katta turnirlar uchun.",
    ),
    knockout: t(
      "Проигравший выбывает, победитель идёт дальше. Быстрее всего, но у многих — одна партия.",
      "Yutqazgan chiqib ketadi, gʻolib keyingi bosqichga oʻtadi. Eng tez usul, lekin koʻpchilik bitta partiya oʻynaydi.",
    ),
  };

  /** Сколько туров и партий получится — чтобы организатор заранее видел объём турнира. */
  const summary = (): string | null => {
    if (n < limits.min) return null;
    if (format === "roundRobin" || format === "doubleRoundRobin") {
      const k = format === "doubleRoundRobin" ? 2 : 1;
      const r = (n % 2 === 0 ? n - 1 : n) * k;
      const g = ((n * (n - 1)) / 2) * k;
      return t(
        `${pluralize(r, "тур", "тура", "туров")}, ${pluralize(g, "партия", "партии", "партий")}`,
        `${r} ta tur, ${g} ta partiya`,
      );
    }
    if (format === "knockout") {
      const r = knockoutRounds(n);
      const free = bracketSize(n) - n;
      return t(
        `${pluralize(r, "тур", "тура", "туров")}${free ? `; в первом туре свободны от игры: ${free}` : ""}`,
        `${r} ta tur${free ? `; birinchi turda oʻyindan ozod: ${free} ta` : ""}`,
      );
    }
    return t(
      `${pluralize(swissRounds, "тур", "тура", "туров")}, в каждом — ${pluralize(Math.floor(n / 2), "партия", "партии", "партий")}`,
      `${swissRounds} ta tur, har birida ${Math.floor(n / 2)} ta partiya`,
    );
  };

  const create = () => {
    const result = createTournament(
      {
        name: name.trim() || t("Турнир", "Turnir"),
        format,
        players,
        seeding,
        rounds: format === "swiss" ? swissRounds : undefined,
        thirdPlace: format === "knockout" && thirdPlace,
      },
      random,
    );
    if ("error" in result) {
      setError(
        result.error === "tooFew"
          ? t(
              `Для этой системы нужно не меньше ${pluralize(limits.min, "участника", "участников", "участников")}.`,
              `Bu tizim uchun kamida ${limits.min} ta ishtirokchi kerak.`,
            )
          : t(
              `Для этой системы — не больше ${pluralize(limits.max, "участника", "участников", "участников")}.`,
              `Bu tizim uchun koʻpi bilan ${limits.max} ta ishtirokchi.`,
            ),
      );
      return;
    }
    saveTournament(result);
    setHash(`#t-${result.id}`);
  };

  const field =
    "w-full rounded-2xl border-2 border-line bg-surface px-4 py-3 text-lg font-bold outline-none focus:border-brand";
  const choice = (on: boolean) =>
    cn(
      "min-h-11 rounded-2xl border-2 px-4 py-2 text-left font-extrabold transition",
      on ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-surface hover:border-brand/40",
    );

  return (
    <form
      className="space-y-6"
      data-tournament-create
      onSubmit={(e) => {
        e.preventDefault();
        create();
      }}
    >
      <h1 className="text-3xl leading-tight font-black">{t("Новый турнир", "Yangi turnir")}</h1>

      <label className="block">
        <span className="mb-1 block font-extrabold">{t("Название", "Nomi")}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          placeholder={t("Например: Турнир 3 «Б» класса", "Masalan: 3-«B» sinf turniri")}
          className={field}
          data-tournament-name
        />
      </label>

      <fieldset>
        <legend className="mb-2 font-extrabold">{t("Система", "Tizim")}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {FORMATS.map((f) => (
            <label key={f} className={cn(choice(format === f), "flex cursor-pointer gap-3")}>
              <input
                type="radio"
                name="format"
                value={f}
                checked={format === f}
                onChange={() => {
                  setFormat(f);
                  setError(null);
                }}
                className="mt-1 size-5 shrink-0 accent-[var(--color-brand)]"
              />
              <span>
                <span className="block">{formatName(f, t)}</span>
                <span className="block text-sm font-semibold text-muted">{about[f]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1 flex items-baseline justify-between gap-2 font-extrabold">
          {t("Участники", "Ishtirokchilar")}
          <span className="text-sm text-muted" data-player-count={n}>
            {t(`всего: ${n}`, `jami: ${n} ta`)}
          </span>
        </span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          rows={8}
          placeholder={t("Али\nВали 1200\nГани", "Ali\nVali 1200\nGʻani")}
          className={cn(field, "font-semibold")}
          data-tournament-players
        />
        <span className="mt-1 block text-sm text-muted">
          {t(
            "По одному в строке. Рейтинг, если есть, — числом в конце строки.",
            "Har bir qatorga bittadan. Reyting boʻlsa — qator oxirida son bilan.",
          )}
        </span>
        {duplicates.length > 0 && (
          <span className="mt-1 block text-sm font-bold text-sun-ink" role="status">
            {t(
              `Одинаковые имена: ${duplicates.join(", ")}. В таблице их будет не различить — добавьте фамилию или букву.`,
              `Bir xil ismlar: ${duplicates.join(", ")}. Jadvalda ularni farqlab boʻlmaydi — familiya yoki harf qoʻshing.`,
            )}
          </span>
        )}
      </label>

      <fieldset>
        <legend className="mb-2 font-extrabold">{t("Стартовые номера", "Boshlangʻich raqamlar")}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["lot", t("По жребию", "Qurʼa boʻyicha")],
              ["rating", t("По рейтингу", "Reyting boʻyicha")],
              ["list", t("Как в списке", "Roʻyxatdagidek")],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={cn(choice(seeding === value), "flex cursor-pointer items-center gap-3")}>
              <input
                type="radio"
                name="seeding"
                value={value}
                checked={seeding === value}
                onChange={() => setSeeding(value)}
                className="size-5 shrink-0 accent-[var(--color-brand)]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {format === "swiss" && n >= limits.min && (
        <div>
          <p className="mb-2 font-extrabold" id="rounds-label">
            {t("Число туров", "Turlar soni")}
          </p>
          <div className="flex items-center gap-3" role="group" aria-labelledby="rounds-label">
            <Button
              variant="secondary"
              aria-label={t("Меньше туров", "Turlarni kamaytirish")}
              disabled={swissRounds <= 1}
              onClick={() => setRounds(swissRounds - 1)}
            >
              −
            </Button>
            <span className="min-w-10 text-center text-2xl font-black tabular-nums" data-swiss-rounds={swissRounds}>
              {swissRounds}
            </span>
            <Button
              variant="secondary"
              aria-label={t("Больше туров", "Turlarni koʻpaytirish")}
              disabled={swissRounds >= maxSwissRounds(n)}
              onClick={() => setRounds(swissRounds + 1)}
            >
              +
            </Button>
            <span className="text-sm text-muted">
              {t(
                `Для ${pluralize(n, "участника", "участников", "участников")} обычно хватает ${recommendedSwissRounds(n)}.`,
                `${n} ta ishtirokchi uchun odatda ${recommendedSwissRounds(n)} ta tur yetadi.`,
              )}
            </span>
          </div>
        </div>
      )}

      {format === "knockout" && n >= 4 && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 font-extrabold">
          <input
            type="checkbox"
            checked={thirdPlace}
            onChange={(e) => setThirdPlace(e.target.checked)}
            className="size-5 accent-[var(--color-brand)]"
          />
          {t("Матч за третье место", "Uchinchi oʻrin uchun oʻyin")}
        </label>
      )}

      <div className="space-y-2">
        {summary() && (
          <p className="font-bold text-muted" data-tournament-summary>
            {formatName(format, t)}: {summary()}
          </p>
        )}
        {error && (
          <p className="font-bold text-sun-ink" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="lg" data-tournament-start>
            <Icon icon={Dices} /> {t("Провести жеребьёвку", "Qurʼa tashlash")}
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setHash("")}>
            {t("Отмена", "Bekor qilish")}
          </Button>
        </div>
      </div>
    </form>
  );
}
