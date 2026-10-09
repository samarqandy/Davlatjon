"use client";

import Link from "next/link";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { TodayCard } from "@/components/progress/TodayCard";
import { cn, ProgressBar } from "@/components/ui";
import { chessLevelHref } from "@/content/chess";
import { dailyPuzzleFor } from "@/content/chess/puzzles";
import { profileText, useAgeProfile } from "@/lib/age";
import { awards, earned } from "@/lib/awards";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { useLang, useT } from "@/lib/i18n";
import { plural, thousands } from "@/lib/plural";
import { PUZZLE_TOTAL, solvedCount } from "@/lib/puzzleStats";
import { useHydrated, useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { ChessBoard, PieceIcon } from "./ChessBoard";
import { DidYouKnow } from "./DidYouKnow";

export function ChessSchool() {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const { levels, school, puzzles, openings, games, secrets, riddles, endgames } = useChess();
  const state = useStore((s) => s);
  const statuses = levelStatuses(levels, state);
  const rank = hydrated ? currentRank(levels, state) : null;
  const solved = statuses.reduce((s, x) => s + x.solved, 0);
  const total = statuses.reduce((s, x) => s + x.total, 0);
  // Словарик шахматиста: все термины всех уровней — на языке интерфейса.
  const glossary = levels.flatMap((level) => level.terms.map((term) => ({ ...term, level })));
  const profile = useAgeProfile();
  const robotName = profileText(profile, lang).robotName;
  const dailyRu = dailyPuzzleFor(profile.minStars);
  const daily = puzzles.find((p) => p.id === dailyRu.id) ?? dailyRu;
  const puzzlesSolved = hydrated ? solvedCount(state.chessPuzzles) : 0;
  const openingsLearned = hydrated ? new Set(Object.keys(state.chessOpenings).map((k) => k.split(":")[0])).size : 0;
  const gamesViewed = hydrated ? Object.keys(state.chessGamesViewed).length : 0;
  const played = hydrated ? state.chessGames.length : 0;
  const wins = hydrated ? state.chessGames.filter((g) => g.mode === "robot" && g.result === "win").length : 0;
  const reviewable = hydrated
    ? state.chessGames.filter((g) => (g.mode === "robot" || g.mode === "two") && (g.ucis?.length ?? 0) > 1).length
    : 0;

  const sections = [
    {
      href: "/chess/play",
      emoji: "🤖",
      title: t("Играть", "Oʻynash"),
      text: t(
        "С роботом пяти уровней, вдвоём на одном экране, пешечный бой, тренировка мата.",
        "Besh darajali robotga qarshi, bitta ekranda ikki kishi boʻlib, piyodalar jangi va mot qoʻyish mashqi.",
      ),
      stat: played
        ? t(`${played} партий · ${wins} побед`, `${played} ta partiya · ${wins} ta gʻalaba`)
        : t("Сыграй первую партию!", "Birinchi partiyangni oʻyna!"),
    },
    {
      href: "/chess/puzzles",
      emoji: "🎯",
      title: t("Задачи", "Masalalar"),
      text: t(
        `${thousands(PUZZLE_TOTAL)} ${plural(PUZZLE_TOTAL, "задача", "задачи", "задач")}: маты, вилки, связки, комбинации. Подбираются по силам; задача дня, серия и «Дятел».`,
        `${thousands(PUZZLE_TOTAL)} ta masala: motlar, vilkalar, bogʻlashlar, kombinatsiyalar. Kuchingga qarab tanlanadi; kun masalasi, «Ketma-ket» va «Qizilishton».`,
      ),
      stat: puzzlesSolved
        ? t(`решено ${puzzlesSolved}`, `${puzzlesSolved} ta yechildi`)
        : t("Реши первую задачу!", "Birinchi masalangni yech!"),
    },
    {
      href: "/chess/openings",
      emoji: "📖",
      title: t("Дебюты", "Debyutlar"),
      text: t(
        `Пять правил дебюта и ${openings.length} дебютов с идеями, историей и тренажёром ходов.`,
        `Debyutning beshta qoidasi va ${openings.length} ta debyut — gʻoyalari, tarixi va yurishlar trenajyori bilan.`,
      ),
      stat: t(
        `${openingsLearned} из ${openings.length} выучено`,
        `${openings.length} tadan ${openingsLearned} tasi oʻrganildi`,
      ),
    },
    {
      href: "/chess/games",
      emoji: "🏛️",
      title: t("Знаменитые партии", "Mashhur partiyalar"),
      text: t(
        `${games.length} легендарных партий с объяснениями и картинками главных моментов.`,
        `${games.length} ta afsonaviy partiya — izohlar va eng muhim lahzalarning rasmlari bilan.`,
      ),
      stat: t(
        `${gamesViewed} из ${games.length} разобрано`,
        `${games.length} tadan ${gamesViewed} tasi koʻrib chiqildi`,
      ),
    },
    {
      href: "/chess/review",
      emoji: "🔎",
      title: t("Разбор партий", "Partiyalar tahlili"),
      text: t(
        "Робот-тренер находит в твоих партиях лучшие ходы и ошибки, объясняет их и делает из них задачи.",
        "Robot-murabbiy partiyalaringdagi eng yaxshi yurishlar va xatolarni topadi, ularni tushuntiradi va ulardan masala tuzadi.",
      ),
      stat: reviewable
        ? t(`${reviewable} партий можно разобрать`, `${reviewable} ta partiyani tahlil qilsa boʻladi`)
        : t("Сыграй — и разбери партию", "Oʻyna — keyin partiyangni tahlil qil"),
    },
    {
      href: "/chess/endgames",
      emoji: "♔",
      title: t("Эндшпиль", "Endshpil"),
      text: t(
        "Король и пешка против короля: правило квадрата, оппозиция, ключевые поля — и робот, который защищается без ошибок.",
        "Shoh va piyoda yolgʻiz shohga qarshi: kvadrat qoidasi, oppozitsiya, kalit kataklar — va xato qilmaydigan robot.",
      ),
      stat: hydrated
        ? t(
            `${Object.keys(state.chessEndgames).length} из ${endgames.flatMap((l) => l.drills).length} заданий`,
            `${endgames.flatMap((l) => l.drills).length} ta topshiriqdan ${Object.keys(state.chessEndgames).length} tasi`,
          )
        : t("Начни с правила квадрата", "Kvadrat qoidasidan boshla"),
    },
    {
      href: "/chess/analysis",
      emoji: "🧪",
      title: t("Доска анализа", "Tahlil taxtasi"),
      text: t(
        "Расставь позицию или вставь партию, ходи за обе стороны — робот оценит и покажет лучший ход.",
        "Holatni joylashtir yoki partiyani qoʻy, ikkala tomon uchun yur — robot baholaydi va eng yaxshi yurishni koʻrsatadi.",
      ),
      stat: t("Проверь свою идею", "Gʻoyangni sinab koʻr"),
    },
    {
      href: "/chess/coordinates",
      emoji: "🎯",
      title: t("Координаты", "Koordinatalar"),
      text: t(
        "Найди клетку, назови клетку, угадай цвет, прочитай запись хода — по 30 секунд на скорость.",
        "Katakni top, katakning nomini ayt, rangini top, yurish yozuvini oʻqi — hammasi tezlikka, har biriga 30 soniya.",
      ),
      stat:
        hydrated && state.chessDrills.find
          ? t(`рекорд ${state.chessDrills.find}`, `rekord: ${state.chessDrills.find}`)
          : t("Побей свой рекорд", "Oʻz rekordingni yangila"),
    },
    {
      href: "/chess/drills",
      emoji: "🛡️",
      title: t("Тренажёры", "Trenajyorlar"),
      text: t(
        "Кто в опасности? Запомни доску. Путь коня. Пять минут — и глаз шахматиста становится зорче.",
        "Kim xavf ostida? Taxtani eslab qol. Ot yoʻli. Besh daqiqa — va shaxmatchining koʻzi oʻtkirlashadi.",
      ),
      stat:
        hydrated && (state.chessDrills.safety || state.chessDrills.memory || state.chessDrills.knight)
          ? t("Побей свои рекорды", "Oʻz rekordlaringni yangila")
          : t("Три новые тренировки", "Uchta yangi mashgʻulot"),
    },
    {
      href: "/chess/awards",
      emoji: "🏅",
      title: t("Награды", "Mukofotlar"),
      text: t(
        "Медали за задачи, партии и дебюты и календарь занятий: сколько дней подряд ты тренируешься.",
        "Masalalar, partiyalar va debyutlar uchun medallar hamda mashgʻulotlar taqvimi: necha kun ketma-ket shugʻullanayotganing.",
      ),
      stat: hydrated
        ? t(
            `${awards(state).filter(earned).length} из ${awards(state).length} наград`,
            `${awards(state).length} ta mukofotdan ${awards(state).filter(earned).length} tasi`,
          )
        : t("Собери все", "Hammasini yigʻ"),
    },
    {
      href: "/chess/secrets",
      emoji: "🔮",
      title: t("Тайны и легенды", "Sirlar va afsonalar"),
      text: t(
        "Учёные Хорезма и Бухары, сказания «Шахнаме», машина «Турок», путешествие коня и загадки про фигуры.",
        "Xorazm va Buxoro olimlari, «Shohnoma» rivoyatlari, «Turk» mashinasi, otning sayohati va donalar haqida topishmoqlar.",
      ),
      stat: t(
        `${secrets.length} историй · ${riddles.length} загадок`,
        `${secrets.length} ta hikoya · ${riddles.length} ta topishmoq`,
      ),
    },
    {
      href: "/chess/history",
      emoji: "🗺️",
      title: t("Энциклопедия", "Ensiklopediya"),
      text: t(
        "История от Индии до Самарканда, чемпионы мира, имена фигур, рекорды, шахматы и математика.",
        "Hindistondan Samarqandgacha tarix, jahon chempionlari, donalarning nomlari, rekordlar, shaxmat va matematika.",
      ),
      stat: t("Открывай и читай", "Och va oʻqi"),
    },
    {
      href: "/chess/diary",
      emoji: "✍️",
      title: t("Дневник партий", "Partiyalar kundaligi"),
      text: t(
        "Записывай партии с папой, мамой и друзьями — и что в них удалось понять.",
        "Dadang, oying va doʻstlaring bilan oʻynagan partiyalaringni yozib bor — ulardan nimani tushunganingni ham.",
      ),
      stat:
        hydrated && state.chessDiary.length
          ? t(`${state.chessDiary.length} записей`, `${state.chessDiary.length} ta yozuv`)
          : t("Пока пусто", "Hozircha boʻsh"),
    },
  ];

  return (
    <div className="space-y-8">
      <ChildNameBanner />
      <section className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-6 text-white shadow-lift sm:p-8">
        <div className="absolute -top-6 -right-4 flex gap-2 opacity-20" aria-hidden>
          <PieceIcon piece="bN" className="h-40 w-40" />
        </div>
        <p className="text-lg font-bold text-white/80">
          {hydrated && state.settings.childName
            ? t("♞ Привет, {name}!", "♞ Salom, {name}!")
            : t("♞ Привет!", "♞ Salom!")}
        </p>
        <h1 className="mt-1 text-3xl leading-tight font-black sm:text-4xl">{school.title}</h1>
        <p className="mt-1 text-xl font-bold text-white/85">{school.subtitle}</p>
        <p className="mt-3 max-w-2xl text-white/85">{school.about}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25">
          {rank ? (
            <>
              <PieceIcon piece={rank.piece} className="h-14 w-14 rounded-2xl bg-[#f0d9b5] p-1" />
              <div>
                <p className="text-sm font-extrabold tracking-wide text-white/70 uppercase">
                  {t("Твоё звание", "Sening unvoning")}
                </p>
                {lang === "uz" ? (
                  <p className="text-2xl font-black">{rank.name}</p>
                ) : (
                  <p className="text-2xl font-black">
                    {rank.name} <span className="text-base font-bold text-white/70">· {rank.uz}</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-lg font-bold">
              {t("Звания пока нет — начни с уровня «Пешка»!", "Hozircha unvoning yoʻq — «Piyoda» darajasidan boshla!")}
            </p>
          )}
          <div className="ml-auto min-w-48 flex-1 sm:max-w-64">
            <p className="text-sm font-bold text-white/80">
              {t(
                `Упражнений решено: ${hydrated ? solved : 0} из ${total}`,
                `Yechilgan mashqlar: ${total} tadan ${hydrated ? solved : 0} tasi`,
              )}
            </p>
            <ProgressBar value={hydrated ? solved : 0} max={total} className="mt-1 bg-white/20" />
          </div>
        </div>
      </section>
      <TodayCard />

      <section aria-labelledby="chess-sections">
        <h2 id="chess-sections" className="mb-3 text-2xl font-black">
          {t("Разделы школы", "Maktab boʻlimlari")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col rounded-3xl border-2 border-transparent bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand/30"
            >
              <p className="text-3xl" aria-hidden>
                {s.emoji}
              </p>
              <p className="mt-1 text-xl font-black">{s.title}</p>
              <p className="mt-1 flex-1 text-sm text-muted">{s.text}</p>
              <p className="mt-3 text-xs font-extrabold text-brand-dark">{s.stat}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]" aria-labelledby="daily-home">
        <div>
          <h2 id="daily-home" className="mb-3 text-2xl font-black">
            {t("Уровни и звания", "Darajalar va unvonlar")}
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2">
            {levels.map((level, i) => {
              const st = statuses[i];
              const open = !hydrated || st.unlocked;
              const inner = (
                <>
                  <div className="flex items-center gap-3">
                    <PieceIcon
                      piece={level.piece}
                      className={cn("h-16 w-16 shrink-0 rounded-2xl bg-[#f0d9b5] p-1", !open && "opacity-40 grayscale")}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                        {t(`Уровень ${level.order}`, `${level.order}-daraja`)} · {"⭐".repeat(level.order)}
                      </p>
                      <p className="text-xl font-black">{level.name}</p>
                      {/* По-узбекски название уровня уже узбекское — подпись с ним нужна только русскому тексту. */}
                      {lang === "ru" && (
                        <p lang="uz" className="text-sm font-bold text-muted">
                          {level.uz}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold",
                        hydrated && st.passed
                          ? "bg-sun-soft text-[#7a4b00]"
                          : open
                            ? "bg-brand-soft text-brand-dark"
                            : "bg-line/60 text-muted",
                      )}
                    >
                      {hydrated && st.passed
                        ? t("🏅 звание", "🏅 unvon")
                        : open
                          ? t("открыт", "ochiq")
                          : t("🔒 закрыт", "🔒 yopiq")}
                    </span>
                  </div>
                  <p className="mt-3 font-bold">{level.title}</p>
                  <p className="mt-1 text-sm text-muted">{level.goal}</p>
                  {hydrated && open && i > 0 && !statuses[i - 1].passed && (
                    <p className="mt-1 text-xs font-bold text-muted">
                      {t(
                        `Звание «${levels[i - 1].name}» — после всех её упражнений.`,
                        `«${levels[i - 1].name}» unvoni — hamma mashqlar yechilgach.`,
                      )}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <ProgressBar value={hydrated ? st.solved : 0} max={st.total} className="flex-1" />
                    <span className="text-xs font-extrabold whitespace-nowrap text-muted">
                      {t(`${hydrated ? st.solved : 0} из ${st.total}`, `${hydrated ? st.solved : 0} / ${st.total}`)}
                    </span>
                  </div>
                </>
              );
              return (
                <li key={level.id}>
                  {open ? (
                    <Link
                      href={chessLevelHref(level.id)}
                      className="block h-full rounded-3xl border-2 border-transparent bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand/30"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div
                      className="h-full rounded-3xl border-2 border-dashed border-line bg-white/70 p-4"
                      aria-disabled
                    >
                      {inner}
                      <p className="mt-2 text-xs font-bold text-muted">
                        {t(
                          `Откроется после звания «${levels[i - 1]?.name}».`,
                          `«${levels[i - 1]?.name}» unvonidan keyin ochiladi.`,
                        )}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <aside className="space-y-4">
          <DidYouKnow />
          <Link
            href="/chess/puzzles#daily"
            className="block rounded-3xl bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
              {t("📅 Задача дня", "📅 Kun masalasi")}
            </p>
            <p className="text-lg font-black">{daily.title}</p>
            <p className="mb-2 text-xs font-bold text-muted">
              {"⭐".repeat(daily.stars)} ·{" "}
              {daily.fen.split(" ")[1] === "w" ? t("ходят белые", "oqlar yuradi") : t("ходят чёрные", "qoralar yuradi")}
              {hydrated && state.chessPuzzles[daily.id]?.solvedAt ? " · ✅" : ""}
            </p>
            <ChessBoard
              id="hub-daily"
              position={daily.fen}
              orientation={daily.fen.split(" ")[1] === "w" ? "white" : "black"}
              maxWidth={280}
              className="!mx-0"
            />
          </Link>
          <div className="rounded-3xl bg-white p-4 shadow-card">
            <h2 className="text-lg font-black">{t("🧭 Как заниматься", "🧭 Qanday shugʻullanamiz")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                {t("📖 Прочитай урок уровня и понажимай на фигуры.", "📖 Daraja darsini oʻqi va donalarni bosib koʻr.")}
              </li>
              <li>
                🖨{" "}
                <Link href="/chess/print" className="font-extrabold text-brand hover:underline">
                  {t("Распечатай задачи", "Masalalarni chop et")}
                </Link>{" "}
                {t("— решай на бумаге.", "— qogʻozda yech.")}
              </li>
              <li>
                {t(
                  "🎯 Реши упражнения — получишь звание и следующий уровень.",
                  "🎯 Mashqlarni yech — unvon va keyingi darajani olasan.",
                )}
              </li>
              <li>
                {t(
                  `🤖 Сыграй с роботом «${robotName}» — он тебе по силам.`,
                  `🤖 «${robotName}» roboti bilan oʻyna — u aynan sening darajangda.`,
                )}
              </li>
              <li>
                {t(
                  "🏛️ Разбери знаменитую партию — там самые красивые идеи.",
                  "🏛️ Mashhur partiyani koʻrib chiq — eng chiroyli gʻoyalar oʻsha yerda.",
                )}
              </li>
              <li>
                {t(
                  "♟ И играй с папой или мамой — записывай партии в дневник.",
                  "♟ Dadang yoki oying bilan ham oʻyna — partiyalarni kundalikka yozib bor.",
                )}
              </li>
            </ul>
          </div>
          <details className="rounded-3xl bg-white p-4 shadow-card">
            <summary className="cursor-pointer text-lg font-black">
              {t("📚 Словарик", "📚 Lugʻat")}{" "}
              <span className="text-sm font-bold text-muted">
                {t(`(${glossary.length} слов)`, `(${glossary.length} ta soʻz)`)}
              </span>
            </summary>
            <dl className="mt-3 space-y-2">
              {glossary.map((term, i) => (
                <div key={i}>
                  <dt className="font-black">
                    {term.term}
                    {term.uz && lang === "ru" && (
                      <span lang="uz" className="ml-2 text-sm font-extrabold text-brand-dark">
                        {term.uz}
                      </span>
                    )}
                  </dt>
                  <dd className="text-sm text-muted">{term.text}</dd>
                </div>
              ))}
            </dl>
          </details>
        </aside>
      </section>
    </div>
  );
}
