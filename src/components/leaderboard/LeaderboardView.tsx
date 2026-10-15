"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink, Card, cn } from "@/components/ui";
import { loginAvailable, useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import {
  AGE_BANDS,
  CATEGORIES,
  type AgeFilter,
  type Category,
  type LeaderResponse,
  type LeaderRow,
  type Scope,
} from "@/lib/leaderboard";
import { api, errorText } from "@/lib/onlineClient";
import { useHydrated, useStore } from "@/lib/store";

const STARS = ["math", "chess", "puzzles", "quick"] as const;
const MEDALS = ["🥇", "🥈", "🥉"];

interface Loaded {
  key: string;
  main: LeaderResponse | null;
  stars: Record<string, LeaderRow[]>;
  error?: string;
}

/** Общий рейтинг: кто сколько набрал за неделю и за всё время, по направлениям и возрастным группам. */
export function LeaderboardView() {
  const t = useT();
  const account = useAccount();
  const hydrated = useHydrated();
  const ranked = useStore((s) => s.settings.leaderboard === true);
  const [scope, setScope] = useState<Scope>("week");
  const [category, setCategory] = useState<Category>("total");
  const [age, setAge] = useState<AgeFilter>("all");
  const [data, setData] = useState<Loaded | null>(null);
  const key = `${scope}/${category}/${age}`;
  const signedIn = !!account.user;

  useEffect(() => {
    if (!signedIn) return;
    let stopped = false;
    const qs = (cat: Category, limit: number) => `scope=${scope}&cat=${cat}&age=${encodeURIComponent(age)}&limit=${limit}`;
    void (async () => {
      const [main, ...stars] = await Promise.all([
        api<LeaderResponse>(`/api/play/leaderboard?${qs(category, 50)}`),
        ...STARS.map((c) => api<LeaderResponse>(`/api/play/leaderboard?${qs(c, 3)}`)),
      ]);
      if (stopped) return;
      setData({
        key,
        main: main.ok ? main.data : null,
        stars: Object.fromEntries(STARS.map((c, i) => [c, stars[i].ok ? stars[i].data.rows : []])),
        error: main.ok ? undefined : main.data.error,
      });
    })();
    return () => {
      stopped = true;
    };
  }, [signedIn, scope, category, age, key]);

  const label: Record<Category, string> = {
    total: t("Всего", "Jami"),
    math: t("Математика", "Matematika"),
    chess: t("Шахматы", "Shaxmat"),
    puzzles: t("Шахматные задачи", "Shaxmat masalalari"),
    quick: t("Быстрый счёт", "Tez hisob"),
  };
  const emoji: Record<Category, string> = { total: "⭐", math: "🔢", quick: "⚡", chess: "♞", puzzles: "🧩" };
  const ageLabel = (a: AgeFilter) => (a === "all" ? t("Все возрасты", "Barcha yoshlar") : t(`${a} лет`, `${a} yosh`));

  const chip = (active: boolean) =>
    cn(
      "min-h-10 rounded-full border-2 px-4 py-1 text-[0.95rem] font-bold transition",
      active ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-white text-muted hover:border-brand/40",
    );

  const current = data && data.key === key ? data : null;
  const rowsView = (rows: LeaderRow[], cat: Category) =>
    rows.map((r) => (
      <li
        key={`${r.username}-${r.rank}`}
        data-leader-row
        data-mine={r.mine || undefined}
        className={cn("flex items-center gap-3 px-4 py-3", r.mine && "bg-brand-soft/60")}
      >
        <span className="w-8 text-center text-lg font-extrabold tabular-nums">{MEDALS[r.rank - 1] ?? r.rank}</span>
        <span className="text-2xl" aria-hidden>
          {r.avatar ?? "🙂"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-extrabold">
            {r.username}
            {r.mine && <span className="ml-2 text-sm text-brand-dark">{t("(это ты)", "(bu sen)")}</span>}
          </span>
          <span className="block text-sm text-muted">
            {t(`Уровень ${r.level}`, `${r.level}-daraja`)}
            {r.best && cat === "total" && ` · ${emoji[r.best]} ${label[r.best]}`}
          </span>
        </span>
        <span className="text-lg font-extrabold tabular-nums">{r.value}</span>
      </li>
    ));

  let body;
  if (!hydrated || account.status === "loading") {
    body = <p className="text-muted">{t("Загружаем…", "Yuklanmoqda…")}</p>;
  } else if (!signedIn) {
    body = (
      <Card className="space-y-3 p-5" data-leaderboard-login>
        <h2 className="text-lg font-extrabold">🔐 {t("Нужен вход", "Kirish kerak")}</h2>
        <p className="text-muted">
          {loginAvailable(account)
            ? t(
                "Общий рейтинг виден после входа. Войти должен взрослый — через Google или Telegram.",
                "Umumiy reyting kirgandan keyin koʻrinadi. Kirishni kattalar — Google yoki Telegram orqali — amalga oshiradi.",
              )
            : t(
                "Рейтинг появится, когда на сайте будет подключён вход через Google или Telegram.",
                "Reyting saytda Google yoki Telegram orqali kirish ulanganda paydo boʻladi.",
              )}
        </p>
        {loginAvailable(account) && (
          <ButtonLink href="/parent#account">{t("Для взрослых", "Kattalar uchun")}</ButtonLink>
        )}
      </Card>
    );
  } else {
    body = (
      <>
        {!ranked && (
          <Card className="space-y-2 border-sun/50 bg-sun/10 p-4" data-leaderboard-optin>
            <p className="font-extrabold">🔒 {t("Тебя в рейтинге пока нет", "Sen hali reytingda yoʻqsan")}</p>
            <p className="text-[0.95rem]">
              {t(
                "Попроси взрослого включить участие: «Для взрослых» → «Настройки» → «Участвовать в общем рейтинге». Другие увидят только имя в игре, аватарку и очки.",
                "Kattalardan ishtirokni yoqishni soʻra: «Kattalar uchun» → «Sozlamalar» → «Umumiy reytingda qatnashish». Boshqalar faqat oʻyindagi ismingni, avataringni va ballaringni koʻradi.",
              )}
            </p>
          </Card>
        )}
        {ranked && current?.main && current.main.count === 0 && current.main.mine.length === 0 && (
          <p className="text-[0.95rem] text-muted" data-leaderboard-nowname>
            {t(
              "Чтобы попасть в таблицу, выбери имя в игре в разделе",
              "Jadvalga tushish uchun oʻyindagi ismni quyidagi boʻlimda tanla:",
            )}{" "}
            <Link href="/chess/online" className="font-bold text-brand-dark underline">
              {t("«Играть с друзьями»", "«Doʻstlar bilan oʻynash»")}
            </Link>
            .
          </p>
        )}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("Период", "Davr")}>
          {(["week", "all"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={scope === s}
              data-scope={s}
              className={chip(scope === s)}
              onClick={() => setScope(s)}
            >
              {s === "week" ? t("🗓️ Эта неделя", "🗓️ Shu hafta") : t("🏅 За всё время", "🏅 Butun davr")}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label={t("Направление", "Yoʻnalish")}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              data-cat={c}
              className={chip(category === c)}
              onClick={() => setCategory(c)}
            >
              {emoji[c]} {label[c]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label={t("Возраст", "Yosh")}>
          {(["all", ...AGE_BANDS] as const).map((a) => (
            <button
              key={a}
              aria-pressed={age === a}
              data-age={a}
              className={chip(age === a)}
              onClick={() => setAge(a)}
            >
              {ageLabel(a)}
            </button>
          ))}
        </div>

        {!current ? (
          <p className="text-muted">{t("Загружаем…", "Yuklanmoqda…")}</p>
        ) : current.error ? (
          <p className="rounded-xl bg-rose/10 px-3 py-2 font-bold text-[#b42318]" role="alert">
            {errorText(current.error, t)}
          </p>
        ) : (
          <>
            <Card className="overflow-hidden" data-leaderboard-table>
              {current.main && current.main.rows.length > 0 ? (
                <ol className="divide-y divide-line">
                  {rowsView(current.main.rows, category)}
                  {current.main.mine.length > 0 && (
                    <>
                      <li className="px-4 py-1 text-center text-muted" aria-hidden>
                        ⋯
                      </li>
                      {rowsView(current.main.mine, category)}
                    </>
                  )}
                </ol>
              ) : (
                <p className="p-5 text-muted" data-leaderboard-empty>
                  {scope === "week"
                    ? t(
                        "На этой неделе пока никого. Реши несколько задач — и ты будешь первым!",
                        "Bu hafta hali hech kim yoʻq. Bir nechta masala yech — birinchi sen boʻlasan!",
                      )
                    : t("Здесь пока никого.", "Bu yerda hali hech kim yoʻq.")}
                </p>
              )}
            </Card>

            <section className="space-y-3" data-leaderboard-stars>
              <h2 className="text-lg font-extrabold">💪 {t("Кто в чём силён", "Kim nimada kuchli")}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {STARS.map((c) => (
                  <Card key={c} className="p-4" data-star={c}>
                    <p className="mb-1 font-extrabold">
                      {emoji[c]} {label[c]}
                    </p>
                    {current.stars[c]?.length ? (
                      <ol className="space-y-1">
                        {current.stars[c].map((r) => (
                          <li key={r.username} className="flex items-center gap-2 text-[0.95rem]">
                            <span aria-hidden>{MEDALS[r.rank - 1]}</span>
                            <span aria-hidden>{r.avatar ?? "🙂"}</span>
                            <span className="min-w-0 flex-1 truncate font-bold">{r.username}</span>
                            <span className="tabular-nums text-muted">{r.value}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-muted">—</p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </>
    );
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">🏆 {t("Рейтинг", "Reyting")}</h1>
        <p className="text-muted">
          {t(
            "Очки за задачи, шахматы и быстрый счёт. Неделя начинается в понедельник. Видны только имя в игре, аватарка и очки.",
            "Masalalar, shaxmat va tez hisob uchun ballar. Hafta dushanbadan boshlanadi. Faqat oʻyindagi ism, avatar va ballar koʻrinadi.",
          )}
        </p>
      </header>
      {body}
    </div>
  );
}
