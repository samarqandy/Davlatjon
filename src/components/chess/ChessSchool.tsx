"use client";

import { courseLessons } from "@/content/chess/courseLessons";
import { COURSE_PART } from "@/content/chess/parts/course";
import { COURSE2_PART } from "@/content/chess/parts/course2";
import { COURSE3_PART } from "@/content/chess/parts/course3";
import { COURSE4_PART } from "@/content/chess/parts/course4";
import { COURSE5_PART } from "@/content/chess/parts/course5";
import { LEVELS } from "@/content/chess/parts/levels";
import { PUZZLE_PART } from "@/content/chess/parts/puzzles";
import { TACTIC_PART } from "@/content/chess/parts/tactics";
import Link from "next/link";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { TodayCard } from "@/components/progress/TodayCard";
import { cn, ProgressBar } from "@/components/ui";
import { chessLevelHref } from "@/content/chess";
import { dailyPuzzleFor } from "@/content/chess/puzzles";
import { profileText, useAgeProfile } from "@/lib/age";
import { awards, earned } from "@/lib/awards";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { COLLECTION_TOTAL, cardsOpen } from "@/lib/collection";
import { useLang, useT } from "@/lib/i18n";
import { plural, thousands } from "@/lib/plural";
import { PUZZLE_TOTAL, solvedCount } from "@/lib/puzzleStats";
import { useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { xpTotal } from "@/lib/xp";
import { ChessBoard, PieceIcon } from "./ChessBoard";
import { DidYouKnow } from "./DidYouKnow";
import { Check, ChevronDown, Dumbbell, Lock, Play, Route } from "lucide-react";

/**
 * Сколько всего в разделах, куда ведут карточки школы. Считает сервер (app/[lang]/chess/page.tsx):
 * ради чисел школа не тянет в браузер тексты дебютов, партий, тайн, эндшпиля и тестов.
 */
export interface ChessSchoolCounts {
  openings: number;
  games: number;
  endgameDrills: number;
  secrets: number;
  riddles: number;
  /** id упражнений всех тестов — чтобы посчитать, сколько решено. */
  testExercises: string[];
}

export function ChessSchool({ counts }: { counts: ChessSchoolCounts }) {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const { levels, school } = useChessPart(LEVELS);
  const { puzzles } = useChessPart(PUZZLE_PART);
  const { tactics } = useChessPart(TACTIC_PART);
  const { course1, course1Lessons } = useChessPart(COURSE_PART);
  const { course2, course2Lessons } = useChessPart(COURSE2_PART);
  const { course3, course3Lessons } = useChessPart(COURSE3_PART);
  const { course4, course4Lessons } = useChessPart(COURSE4_PART);
  const { course5, course5Lessons } = useChessPart(COURSE5_PART);
  const state = useStore((s) => s);
  const statuses = levelStatuses(levels, state);
  const rank = hydrated ? currentRank(levels, state) : null;
  // Словарик шахматиста: все термины всех уровней — на языке интерфейса.
  const glossary = levels.flatMap((level) => level.terms.map((term) => ({ ...term, level })));
  const profile = useAgeProfile();
  const robotName = profileText(profile, lang).robotName;
  const dailyRu = dailyPuzzleFor(profile.minStars);
  const daily = puzzles.find((p) => p.id === dailyRu.id) ?? dailyRu;
  const puzzlesSolved = hydrated ? solvedCount(state.chessPuzzles) : 0;
  const openingsLearned = hydrated ? new Set(Object.keys(state.chessOpenings).map((k) => k.split(":")[0])).size : 0;
  const tacticsTotal = tactics.reduce((n, x) => n + x.exercises.length, 0);
  const tacticsSolved = hydrated
    ? tactics.reduce((n, x) => n + x.exercises.filter((e) => state.chess[e.id]?.solvedAt).length, 0)
    : 0;
  const course1List = courseLessons({ levels, tactics }, course1Lessons);
  const course2List = courseLessons({ levels, tactics }, course2Lessons);
  const course3List = courseLessons({ levels, tactics }, course3Lessons);
  const course4List = courseLessons({ levels, tactics }, course4Lessons);
  const course5List = courseLessons({ levels, tactics }, course5Lessons);
  const solvedIn = (list: typeof course1List) =>
    hydrated ? list.reduce((n, x) => n + x.exercises.filter((e) => state.chess[e.id]?.solvedAt).length, 0) : 0;
  const totalIn = (list: typeof course1List) => list.reduce((n, x) => n + x.exercises.length, 0);
  const firstOpen = (list: typeof course1List) =>
    list.findIndex((l) => l.exercises.some((e) => !state.chess[e.id]?.solvedAt));
  // Продолжаем первую непройденную ступень по порядку.
  const steps = [
    { n: 1, list: course1List, href: "/chess/course" },
    { n: 2, list: course2List, href: "/chess/course-2" },
    { n: 3, list: course3List, href: "/chess/course-3" },
    { n: 4, list: course4List, href: "/chess/course-4" },
    { n: 5, list: course5List, href: "/chess/course-5" },
  ];
  const current = (hydrated && steps.find((st) => firstOpen(st.list) >= 0)) || steps[0];
  const onStep2 = current.n > 1;
  const course = current.list;
  const courseHref = current.href;
  const courseTotal = course.reduce((n, x) => n + x.exercises.length, 0);
  const courseSolved = hydrated
    ? course.reduce((n, x) => n + x.exercises.filter((e) => state.chess[e.id]?.solvedAt).length, 0)
    : 0;
  // Курс — главный путь новичка: показываем следующий незаконченный урок прямо под приветствием.
  const courseNext = hydrated ? course.findIndex((l) => l.exercises.some((e) => !state.chess[e.id]?.solvedAt)) : 0;
  const courseLesson = courseNext >= 0 ? course[courseNext] : null;
  const testsTotal = counts.testExercises.length;
  const testsDone = hydrated ? counts.testExercises.filter((id) => state.chess[id]?.solvedAt).length : 0;
  const gamesViewed = hydrated ? Object.keys(state.chessGamesViewed).length : 0;
  const played = hydrated ? state.chessGames.length : 0;
  const wins = hydrated ? state.chessGames.filter((g) => g.mode === "robot" && g.result === "win").length : 0;
  const reviewable = hydrated
    ? state.chessGames.filter((g) => (g.mode === "robot" || g.mode === "two") && (g.ucis?.length ?? 0) > 1).length
    : 0;

  const sections = [
    {
      href: "/chess/course",
      emoji: "🪜",
      title: course1.title,
      text: t(
        "Урок за уроком: каждая фигура, шах и мат, рокировка, дебют, вилка и связка, пат, лабиринты и итоговый тест.",
        "Darsma-dars: har bir dona, shoh va mot, rokirovka, debyut, vilka va bogʻlash, pat, labirintlar va yakuniy test.",
      ),
      stat: hydrated
        ? t(
            `${solvedIn(course1List)} из ${totalIn(course1List)} упражнений`,
            `${totalIn(course1List)} ta mashqdan ${solvedIn(course1List)} tasi`,
          )
        : t(`${course1List.length} уроков`, `${course1List.length} ta dars`),
    },
    {
      href: "/chess/course-2",
      emoji: "🐴",
      title: course2.title,
      text: t(
        "Мат с помощью связки, открытого нападения и двойного шаха, атака на короля, ловля фигур, эндшпиль, лабиринты и итоговый тест.",
        "Bogʻlash, ochiq hujum va qoʻsh shoh yordamida mot, shohga hujum, donalarni tutish, endshpil, labirintlar va yakuniy test.",
      ),
      stat: hydrated
        ? t(
            `${solvedIn(course2List)} из ${totalIn(course2List)} упражнений`,
            `${totalIn(course2List)} ta mashqdan ${solvedIn(course2List)} tasi`,
          )
        : t(`${course2List.length} уроков`, `${course2List.length} ta dars`),
    },
    {
      href: "/chess/course-3",
      emoji: "🎯",
      title: course3.title,
      text: t(
        "Связка и рентген, открытый и двойной шах, открытое нападение — тактика атаки на короля.",
        "Bogʻlash va rentgen, ochiq va qoʻsh shoh, ochiq hujum — shohga hujum taktikasi.",
      ),
      stat: hydrated
        ? t(
            `${solvedIn(course3List)} из ${totalIn(course3List)} упражнений`,
            `${totalIn(course3List)} ta mashqdan ${solvedIn(course3List)} tasi`,
          )
        : t(`${course3List.length} уроков`, `${course3List.length} ta dars`),
    },
    {
      href: "/chess/course-4",
      emoji: "🏰",
      title: course4.title,
      text: t(
        "Слоны Горвица, обжорный ряд, проходная пешка, слабые поля, пешечный эндшпиль, пат, вечный шах и мат двумя слонами.",
        "Gorvits fillari, ochkoʻz qator, oʻtuvchi piyoda, kuchsiz kataklar, piyodali endshpil, pat, abadiy shoh va ikki fil bilan mot.",
      ),
      stat: hydrated
        ? t(
            `${solvedIn(course4List)} из ${totalIn(course4List)} упражнений`,
            `${totalIn(course4List)} ta mashqdan ${solvedIn(course4List)} tasi`,
          )
        : t(`${course4List.length} уроков`, `${course4List.length} ta dars`),
    },
    {
      href: "/chess/course-5",
      emoji: "👑",
      title: course5.title,
      text: t(
        "Связка и двойная связка, развязывание, двойной шах и «мельница», отвлечение, завлечение и шедевр Эдварда Ласкера.",
        "Bogʻlash va qoʻsh bogʻlash, bogʻlashdan chiqish, qoʻsh shoh va «tegirmon», chalgʻitish, jalb qilish va Edvard Laskerning durdonasi.",
      ),
      stat: hydrated
        ? t(
            `${solvedIn(course5List)} из ${totalIn(course5List)} упражнений`,
            `${totalIn(course5List)} ta mashqdan ${solvedIn(course5List)} tasi`,
          )
        : t(`${course5List.length} уроков`, `${course5List.length} ta dars`),
    },
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
        `Пять правил дебюта и ${counts.openings} дебютов с идеями, историей и тренажёром ходов.`,
        `Debyutning beshta qoidasi va ${counts.openings} ta debyut — gʻoyalari, tarixi va yurishlar trenajyori bilan.`,
      ),
      stat: t(
        `${openingsLearned} из ${counts.openings} выучено`,
        `${counts.openings} tadan ${openingsLearned} tasi oʻrganildi`,
      ),
    },
    {
      href: "/chess/games",
      emoji: "🏛️",
      title: t("Знаменитые партии", "Mashhur partiyalar"),
      text: t(
        `${counts.games} легендарных партий с объяснениями и картинками главных моментов.`,
        `${counts.games} ta afsonaviy partiya — izohlar va eng muhim lahzalarning rasmlari bilan.`,
      ),
      stat: t(
        `${gamesViewed} из ${counts.games} разобрано`,
        `${counts.games} tadan ${gamesViewed} tasi koʻrib chiqildi`,
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
      href: "/chess/tests",
      emoji: "📝",
      title: t("Контрольные тесты", "Nazorat testlari"),
      text: t(
        "Три теста по двенадцать вопросов без подсказок: фигуры и ходы, шах и мат, тактика. За каждый тест — до трёх звёзд.",
        "Oʻn ikki savoldan iborat uchta test, maslahatsiz: donalar va yurishlar, shoh va mot, taktika. Har bir test uchun — uchtagacha yulduz.",
      ),
      stat: hydrated
        ? t(`${testsDone} из ${testsTotal} вопросов`, `${testsTotal} ta savoldan ${testsDone} tasi`)
        : t("Проверь себя", "Oʻzingni sinab koʻr"),
    },
    {
      href: "/chess/tactics",
      emoji: "⚔️",
      title: t("Тактика", "Taktika"),
      text: t(
        "Вилка, связка, сквозной удар и открытый шах: короткие уроки и упражнения, в которых нужно найти выигрывающий ход.",
        "Vilka, bogʻlash, rentgen va ochiq shoh: qisqa darslar va yutuqli yurishni topish kerak boʻlgan mashqlar.",
      ),
      stat: hydrated
        ? t(`${tacticsSolved} из ${tacticsTotal} упражнений`, `${tacticsTotal} ta mashqdan ${tacticsSolved} tasi`)
        : t("Начни с вилки", "Vilkadan boshla"),
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
            `${Object.keys(state.chessEndgames).length} из ${counts.endgameDrills} заданий`,
            `${counts.endgameDrills} ta topshiriqdan ${Object.keys(state.chessEndgames).length} tasi`,
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
      href: "/chess/collection",
      emoji: "🃏",
      title: t("Коллекция героев", "Qahramonlar kolleksiyasi"),
      text: t(
        "Мудрецы Востока и чемпионы мира: карточки открываются сами, пока ты занимаешься.",
        "Sharq donishmandlari va jahon chempionlari: shugʻullanishing bilan kartochkalar oʻzi ochiladi.",
      ),
      stat: hydrated
        ? t(
            `Открыто ${cardsOpen(xpTotal(state), COLLECTION_TOTAL)} из ${COLLECTION_TOTAL}`,
            `${COLLECTION_TOTAL} tadan ${cardsOpen(xpTotal(state), COLLECTION_TOTAL)} tasi ochiq`,
          )
        : t("Собери всех героев", "Hamma qahramonni yigʻ"),
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
        "Учёные Хорезма и Бухары, большие шахматы Тимура, Абдусатторов и Самарканд, мысли великих, разговоры и загадки.",
        "Xorazm va Buxoro olimlari, Temurning katta shaxmati, Abdusattorov va Samarqand, buyuklarning fikrlari, suhbatlar va topishmoqlar.",
      ),
      stat: t(
        `${counts.secrets} историй · ${counts.riddles} загадок`,
        `${counts.secrets} ta hikoya · ${counts.riddles} ta topishmoq`,
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

  // Учиться — одна дорога: ступени курса. Тренироваться — всё остальное; первые три раздела видны сразу.
  const stepTitles = [course1.title, course2.title, course3.title, course4.title, course5.title];
  const practiceFirst = ["/chess/play", "/chess/puzzles", "/chess/tactics"];
  const practice = sections.filter((x) => !steps.some((st) => st.href === x.href));
  const orderedPractice = [
    ...practiceFirst.map((href) => practice.find((x) => x.href === href)!),
    ...practice.filter((x) => !practiceFirst.includes(x.href)),
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <ChildNameBanner />
      <header className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-muted">
            {hydrated && state.settings.childName ? t("Привет, {name}!", "Salom, {name}!") : t("Привет!", "Salom!")}
          </p>
          <h1 className="text-3xl leading-tight font-black">{school.title}</h1>
        </div>
        {rank && (
          <div className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2 shadow-card">
            <PieceIcon piece={rank.piece} className="h-10 w-10 rounded-xl bg-[#f0d9b5] p-0.5" />
            <div>
              <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                {t("Твоё звание", "Sening unvoning")}
              </p>
              <p className="leading-tight font-black">{rank.name}</p>
            </div>
          </div>
        )}
      </header>

      {courseLesson && (
        <Link
          href={`${courseHref}#${courseLesson.id}`}
          data-course-continue
          className="block rounded-[2rem] bg-linear-to-br from-[#3b2f23] to-[#6b4f33] p-5 text-white shadow-lift transition hover:-translate-y-0.5 sm:p-6"
        >
          <span className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-white/80 uppercase">
            <Route className="h-4 w-4" aria-hidden />
            {t("Следующий шаг", "Keyingi qadam")}
          </span>
          <span className="mt-2 block text-sm font-bold text-white/80">
            {t(
              `${onStep2 ? `Ступень ${current.n}` : "Курс"} · урок ${courseNext + 1} из ${course.length}`,
              `${onStep2 ? `${current.n}-bosqich` : "Kurs"} · ${course.length} tadan ${courseNext + 1}-dars`,
            )}
          </span>
          <span className="mt-1 block text-2xl leading-tight font-black sm:text-3xl">{courseLesson.title}</span>
          <span className="mt-4 flex items-center gap-4">
            <ProgressBar value={courseSolved} max={courseTotal} className="flex-1 bg-white/20" />
            <span className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-sun px-5 py-3 text-lg font-black text-on-sun shadow-[0_4px_0_0_#b45309]">
              <Play className="h-5 w-5 fill-current" aria-hidden />
              {courseSolved > 0 ? t("Дальше", "Davom") : t("Начать", "Boshlash")}
            </span>
          </span>
        </Link>
      )}

      <TodayCard />

      <section aria-labelledby="learn-path">
        <h2 id="learn-path" className="mb-3 flex items-center gap-2 text-2xl font-black">
          <Route className="h-6 w-6 text-brand" aria-hidden />
          {t("Учиться: ступени курса", "Oʻrganish: kurs bosqichlari")}
        </h2>
        <ol className="grid gap-2" data-learn-path>
          {steps.map((st, i) => {
            const done = hydrated && firstOpen(st.list) < 0;
            const isCurrent = st.href === courseHref;
            return (
              <li key={st.href}>
                <Link
                  href={st.href}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card transition hover:-translate-y-0.5",
                    isCurrent && "ring-2 ring-brand",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-black",
                      done ? "bg-mint text-white" : isCurrent ? "bg-brand text-white" : "bg-line/60 text-muted",
                    )}
                    aria-hidden
                  >
                    {done ? <Check className="h-5 w-5" /> : st.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block leading-tight font-black">{stepTitles[i]}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <ProgressBar value={solvedIn(st.list)} max={totalIn(st.list)} className="flex-1" />
                      <span className="text-xs font-extrabold whitespace-nowrap text-muted">
                        {hydrated
                          ? `${solvedIn(st.list)}/${totalIn(st.list)}`
                          : t(`${st.list.length} уроков`, `${st.list.length} ta dars`)}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="chess-sections">
        <h2 id="chess-sections" className="mb-3 flex items-center gap-2 text-2xl font-black">
          <Dumbbell className="h-6 w-6 text-brand" aria-hidden />
          {t("Тренироваться", "Mashq qilish")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {orderedPractice.slice(0, MAIN_SECTIONS).map((s) => (
            <SectionCard key={s.href} s={s} />
          ))}
        </div>

        <h3 id="daily-home" className="mt-6 mb-2 text-lg font-black">
          {t("Уровни и звания", "Darajalar va unvonlar")}
        </h3>
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {levels.map((level, i) => {
            const st = statuses[i];
            const open = !hydrated || st.unlocked;
            const tile = (
              <>
                <PieceIcon
                  piece={level.piece}
                  className={cn("mx-auto h-12 w-12 rounded-xl bg-[#f0d9b5] p-0.5", !open && "opacity-40 grayscale")}
                />
                <p className="mt-1 text-sm leading-tight font-black">{level.name}</p>
                {open ? (
                  <ProgressBar value={hydrated ? st.solved : 0} max={st.total} className="mt-1" />
                ) : (
                  <Lock className="mx-auto mt-1 h-4 w-4 text-muted" aria-label={t("закрыт", "yopiq")} />
                )}
                {hydrated && st.passed && (
                  <p className="mt-1 text-xs font-extrabold text-sun-ink">{t("🏅 звание", "🏅 unvon")}</p>
                )}
              </>
            );
            return (
              <li key={level.id}>
                {open ? (
                  <Link
                    href={chessLevelHref(level.id)}
                    className="block h-full rounded-2xl bg-surface p-2 text-center shadow-card transition hover:-translate-y-0.5"
                  >
                    {tile}
                  </Link>
                ) : (
                  <div
                    className="h-full rounded-2xl border-2 border-dashed border-line bg-surface/70 p-2 text-center"
                    aria-disabled
                  >
                    {tile}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <details className="group mt-4 rounded-3xl border border-line bg-surface p-3 shadow-card" data-more-sections>
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-2xl px-3 text-lg font-black select-none [&::-webkit-details-marker]:hidden">
            <span className="flex-1">{t("Ещё разделы", "Yana boʻlimlar")}</span>
            <ChevronDown className="h-5 w-5 text-muted transition group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orderedPractice.slice(MAIN_SECTIONS).map((s) => (
              <SectionCard key={s.href} s={s} />
            ))}
          </div>
        </details>
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-label={t("Полезное", "Foydali")}>
        <DidYouKnow />
        <Link
          href="/chess/puzzles#daily"
          className="block rounded-3xl bg-surface p-4 shadow-card transition hover:-translate-y-0.5"
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
            maxWidth={240}
            className="!mx-0"
          />
        </Link>
        <details className="rounded-3xl bg-surface p-4 shadow-card md:col-span-2">
          <summary className="cursor-pointer text-lg font-black">
            {t("О школе и как заниматься", "Maktab haqida va qanday shugʻullanish")}
          </summary>
          <p className="mt-2 text-muted">{school.about}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>{t("📖 Прочитай урок и понажимай на фигуры.", "📖 Darsni oʻqi va donalarni bosib koʻr.")}</li>
            <li>
              🖨{" "}
              <Link href="/chess/print" className="font-extrabold text-brand hover:underline">
                {t("Распечатай задачи", "Masalalarni chop et")}
              </Link>{" "}
              {t("— решай на бумаге.", "— qogʻozda yech.")}
            </li>
            <li>
              {t(
                `🤖 Сыграй с роботом «${robotName}» — он тебе по силам.`,
                `🤖 «${robotName}» roboti bilan oʻyna — u aynan sening darajangda.`,
              )}
            </li>
            <li>
              {t(
                "♟ И играй с папой или мамой — записывай партии в дневник.",
                "♟ Dadang yoki oying bilan ham oʻyna — partiyalarni kundalikka yozib bor.",
              )}
            </li>
          </ul>
        </details>
        <details className="rounded-3xl bg-surface p-4 shadow-card md:col-span-2">
          <summary className="cursor-pointer text-lg font-black">
            <span className="deco" aria-hidden>
              📚{" "}
            </span>
            {t("Словарик", "Lugʻat")}{" "}
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
      </section>
    </div>
  );
}

/** Сколько разделов видно сразу; остальные — под «Ещё разделы». */
const MAIN_SECTIONS = 3;

function SectionCard({ s }: { s: { href: string; emoji: string; title: string; text: string; stat: string } }) {
  return (
    <Link
      href={s.href}
      className="flex flex-col rounded-3xl border-2 border-transparent bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand/30"
    >
      <p className="text-3xl" aria-hidden>
        {s.emoji}
      </p>
      <p className="mt-1 text-xl font-black">{s.title}</p>
      <p className="mt-1 flex-1 text-sm text-muted">{s.text}</p>
      <p className="mt-3 text-xs font-extrabold text-brand-dark">{s.stat}</p>
    </Link>
  );
}
