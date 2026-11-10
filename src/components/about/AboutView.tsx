"use client";

import {
  Brain,
  ChessKnight,
  ChevronDown,
  House,
  Languages,
  Lightbulb,
  Lock,
  type LucideIcon,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
  Play,
} from "lucide-react";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { ButtonLink, Icon } from "@/components/ui";
import { useT } from "@/lib/i18n";

export interface AboutStats {
  tasks: number;
  weeks: number;
  chessExercises: number;
  /** Уроков в курсе шахмат по ступеням (все пять ступеней). */
  courseLessons: number;
  puzzles: number;
  stories: number;
}

const card = "rounded-3xl bg-surface p-5 shadow-card";
const icon = "h-6 w-6";

/** Ступени шахматного курса — те же названия, что у дипломов (src/lib/course). */
const STEP_NAMES: readonly [string, string][] = [
  ["Пешка", "Piyoda"],
  ["Конь", "Ot"],
  ["Слон", "Fil"],
  ["Ладья", "Rux"],
  ["Ферзь", "Farzin"],
];

/** Страница для родителей: что это, чем отличается, как устроена безопасность. Детям она не нужна — они сразу попадают в занятия. */
export function AboutView({ stats }: { stats: AboutStats }) {
  const t = useT();
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ");

  const different: { Icon: LucideIcon; title: string; text: string }[] = [
    {
      Icon: Lightbulb,
      title: t("Не угадывать, а понимать", "Topish emas, tushunish"),
      text: t(
        "Подсказки открываются по одной — от «перечитай условие» до идеи. Ответ платформа не выдаёт: после решения она просит объяснить, почему так, и найти другой способ.",
        "Maslahatlar bittadan ochiladi — «shartni qayta oʻqi» dan gʻoyagacha. Javobning oʻzini aytmaydi: yechgach «nega shunday?» deb soʻraydi va boshqa yoʻl topishni taklif qiladi.",
      ),
    },
    {
      Icon: ChessKnight,
      title: t("Шахматная школа с историей", "Tarixi bor shaxmat maktabi"),
      text: t(
        "Курс по ступеням, игра с роботом, задачи и разбор партий. И истории Хорезма, Бухары и Самарканда: откуда пришли шахматы и что о них думали Беруни и Ибн Сина.",
        "Bosqichma-bosqich kurs, robot bilan oʻyin, masalalar va partiyalar tahlili. Va Xorazm, Buxoro, Samarqand hikoyalari: shaxmat qayerdan kelgani va Beruniy bilan Ibn Sino u haqda nima deganlari.",
      ),
    },
    {
      Icon: Languages,
      title: t("Русский и узбекский, с голосом", "Oʻzbekcha va ruscha, ovozli"),
      text: t(
        "Весь интерфейс и задачи на двух языках. Условия читает диктор — это помогает тем, кто ещё читает с трудом. Голос браузера не используется: все записи подготовлены заранее.",
        "Butun interfeys va masalalar ikki tilda. Shartlarni diktor oʻqib beradi — bu hali yaxshi oʻqiy olmaydiganlarga yordam beradi. Brauzer ovozi ishlatilmaydi: hamma yozuv oldindan tayyorlangan.",
      ),
    },
    {
      Icon: ShieldCheck,
      title: t("Безопасно для детей", "Bolalar uchun xavfsiz"),
      text: t(
        "Нет рекламы и чужих трекеров. Общий рейтинг — только с разрешения родителя, в нём виден лишь ник и очки. Играть и писать по сети можно только с друзьями, которых он добавил сам; родитель может всё это выключить.",
        "Reklama ham, begona kuzatuvchilar ham yoʻq. Umumiy reyting faqat ota-ona ruxsati bilan, unda faqat laqab va ballar koʻrinadi. Onlayn oʻynash va yozishish faqat oʻzi qoʻshgan doʻstlar bilan; ota-ona buning hammasini oʻchirib qoʻyishi mumkin.",
      ),
    },
    {
      Icon: Users,
      title: t("Для всей семьи", "Butun oila uchun"),
      text: t(
        "Несколько детей на одном планшете — у каждого свой прогресс и аватарка. Раздел для взрослых под PIN-кодом: дневной лимит, итоги недели (можно в Telegram), печатные листы и сертификаты.",
        "Bitta planshetda bir nechta bola — har birining oʻz natijasi va rasmi. Kattalar boʻlimi PIN-kod ostida: kunlik chegara, hafta yakunlari (Telegramga ham), bosma varaqlar va sertifikatlar.",
      ),
    },
  ];

  const faq = [
    {
      q: t("Для какого возраста?", "Qaysi yosh uchun?"),
      a: t(
        "Для детей 6–12 лет. При первом запуске ребёнок называет возраст, и платформа подбирает советы и сложность. Для малышей 4–5 лет отдельного раздела пока нет.",
        "6–12 yoshli bolalar uchun. Birinchi kirishda bola yoshini aytadi, platforma maslahat va qiyinlikni moslaydi. 4–5 yoshli kichkintoylar uchun alohida boʻlim hozircha yoʻq.",
      ),
    },
    {
      q: t("Нужна ли регистрация?", "Roʻyxatdan oʻtish kerakmi?"),
      a: t(
        "Нет: можно начать сразу, прогресс хранится в браузере. Вход через Google или Telegram нужен, чтобы прогресс был на всех устройствах и чтобы играть с друзьями по сети.",
        "Yoʻq: darhol boshlash mumkin, natijalar brauzerda saqlanadi. Google yoki Telegram orqali kirish natijalar hamma qurilmada boʻlishi va doʻstlar bilan onlayn oʻynash uchun kerak.",
      ),
    },
    {
      q: t("Сколько времени в день?", "Kuniga qancha vaqt?"),
      a: t(
        "Занятие дня — около 20–25 минут. Малышам после третьей задачи предлагается передохнуть, а родитель может поставить дневной лимит.",
        "Kunlik mashgʻulot taxminan 20–25 daqiqa. Kichkintoylarga uchinchi masaladan keyin dam olish taklif qilinadi, ota-ona esa kunlik chegara qoʻyishi mumkin.",
      ),
    },
    {
      q: t("Что происходит с данными ребёнка?", "Bolaning maʼlumotlari bilan nima boʻladi?"),
      a: t(
        "Подробно — на странице «Конфиденциальность». Коротко: мы не продаём данные и не показываем рекламу; настоящее имя ребёнка в играх не показывается; всё можно удалить одной кнопкой.",
        "Batafsil — «Maxfiylik» sahifasida. Qisqasi: maʼlumotlarni sotmaymiz va reklama koʻrsatmaymiz; bolaning haqiqiy ismi oʻyinlarda koʻrsatilmaydi; hammasini bitta tugma bilan oʻchirish mumkin.",
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <section className="grid items-center gap-6 rounded-[2rem] bg-linear-to-br from-[#4f46e5] via-[#5b4ff0] to-[#7c3aed] p-6 text-white shadow-lift sm:grid-cols-[1fr_auto] sm:p-10">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-white/85 uppercase">
            {t("Для родителей", "Ota-onalar uchun")}
          </p>
          <h1 className="mt-1 text-3xl leading-tight font-black sm:text-4xl">
            {t(
              "Математика, логика и шахматы для детей 6–12 лет",
              "6–12 yoshli bolalar uchun matematika, mantiq va shaxmat",
            )}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/90">
            {t(
              "Каждый день — занятие на 20–25 минут: задачи, которые учат думать, подсказки по одной и шахматная школа. Без рекламы, и начать можно без регистрации.",
              "Har kuni 20–25 daqiqalik mashgʻulot: oʻylashga oʻrgatadigan masalalar, bittadan maslahatlar va shaxmat maktabi. Reklamasiz, roʻyxatdan oʻtmasdan boshlash mumkin.",
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/" variant="sun" size="lg" data-about-start>
              {t("Начать", "Boshlash")} <Icon icon={Play} className="fill-current" />
            </ButtonLink>
            <ButtonLink href="/privacy" variant="secondary" size="lg">
              {t("Конфиденциальность", "Maxfiylik")}
            </ButtonLink>
          </div>
        </div>
        <Mascot size={150} float className="mx-auto hidden sm:block" />
      </section>

      <section
        aria-label={t("Что внутри", "Ichida nima bor")}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        data-about-stats
      >
        {[
          [fmt(stats.tasks), t(`задач в ${stats.weeks} неделях`, `${stats.weeks} haftadagi masala`)],
          [fmt(stats.chessExercises), t("упражнений шахматной школы", "shaxmat maktabi mashqlari")],
          [fmt(stats.puzzles), t("шахматных задач", "shaxmat masalalari")],
          [String(stats.stories), t("историй «Тайны и легенды»", "«Sirlar va rivoyatlar» hikoyalari")],
        ].map(([n, label]) => (
          <div key={label} className={`${card} text-center`}>
            <p className="tabular text-3xl font-black text-brand-dark">{n}</p>
            <p className="text-sm font-bold text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="programs">
        <h2 id="programs" className="text-2xl font-black">
          {t("Две программы", "Ikki dastur")}
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2" data-about-programs>
          <article className={card}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
              <Brain className={icon} strokeWidth={2.25} aria-hidden />
            </span>
            <h3 className="mt-2 text-xl font-black">{t("Математика и логика", "Matematika va mantiq")}</h3>
            <p className="mt-1 text-[0.95rem] text-muted">
              {t(
                `${stats.weeks} недели занятий, ${fmt(stats.tasks)} задач. Каждый день — одно занятие на 20–25 минут: счёт, логика, алгоритмы, измерения и маленькое исследование.`,
                `${stats.weeks} haftalik mashgʻulot, ${fmt(stats.tasks)} ta masala. Har kuni 20–25 daqiqalik bitta mashgʻulot: hisob, mantiq, algoritm, oʻlchash va kichik tadqiqot.`,
              )}
            </p>
          </article>
          <article className={card}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
              <ChessKnight className={icon} strokeWidth={2.25} aria-hidden />
            </span>
            <h3 className="mt-2 text-xl font-black">{t("Шахматы по ступеням", "Bosqichma-bosqich shaxmat")}</h3>
            <p className="mt-1 text-[0.95rem] text-muted">
              {t(
                `${STEP_NAMES.length} ступеней, ${stats.courseLessons} уроков. Темы и порядок — по методике М. И. Глотова «Ступени шахматного мастерства»; позиции составлены для школы и проверены шахматным движком. За каждую ступень — диплом.`,
                `${STEP_NAMES.length} bosqich, ${stats.courseLessons} ta dars. Mavzular va tartib — M. I. Glotovning «Shaxmat mahorati bosqichlari» metodikasi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan. Har bir bosqich uchun — diplom.`,
              )}
            </p>
            <ol className="mt-3 flex flex-wrap gap-1.5" aria-label={t("Ступени", "Bosqichlar")}>
              {STEP_NAMES.map(([ru, uz], i) => (
                <li
                  key={ru}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-sm font-extrabold text-ink"
                >
                  {i + 1}. {t(ru, uz)}
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="text-2xl font-black">
          {t("Как проходит занятие", "Mashgʻulot qanday oʻtadi")}
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            [
              "1",
              t("Занятие дня", "Kunlik mashgʻulot"),
              t(
                "Около восьми задач: счёт, логика, алгоритмы, измерения, исследование. Ребёнок идёт по порядку — без спешки и оценок.",
                "Taxminan sakkizta masala: hisob, mantiq, algoritm, oʻlchash, tadqiqot. Bola ketma-ket, shoshilmasdan va baholarsiz ishlaydi.",
              ),
            ],
            [
              "2",
              t("Подсказки и объяснение", "Maslahat va tushuntirish"),
              t(
                "Трудно — можно открыть подсказку. Задача решена — платформа спросит «почему» и предложит другой способ.",
                "Qiyin boʻlsa — maslahat ochiladi. Yechilsa — platforma «nega» deb soʻraydi va boshqa yoʻl taklif qiladi.",
              ),
            ],
          ].map(([n, title, text]) => (
            <li key={n} className={card}>
              <p className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-lg font-black text-white">
                {n}
              </p>
              <h3 className="mt-2 text-lg font-black">{title}</h3>
              <p className="mt-1 text-[0.95rem] text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="path">
        <h2 id="path" className="text-2xl font-black">
          {t("Путь ученика", "Oʻquvchi yoʻli")}
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-about-path>
          {(
            [
              [
                UserRound,
                t("Возраст", "Yosh"),
                t(
                  "При первом входе ребёнок называет возраст — от него зависят размер текста и советы.",
                  "Birinchi kirishda bola yoshini aytadi — matn oʻlchami va maslahatlar shunga qarab tanlanadi.",
                ),
              ],
              [
                House,
                t("Один шаг на экране", "Ekranda bitta qadam"),
                t(
                  "На главной — занятие дня, в шахматах — «Следующий шаг». Искать, с чего начать, не нужно.",
                  "Bosh sahifada — kunlik mashgʻulot, shaxmatda — «Keyingi qadam». Nimadan boshlashni qidirish shart emas.",
                ),
              ],
              [
                Trophy,
                t("Свои успехи", "Oʻz yutuqlari"),
                t(
                  "Опыт, серия дней, награды и дипломы ступеней собраны на одной странице «Мои успехи».",
                  "Tajriba, kunlar seriyasi, mukofotlar va bosqich diplomlari bitta «Yutuqlarim» sahifasida.",
                ),
              ],
              [
                Lock,
                t("Итоги для родителей", "Ota-onalar uchun yakunlar"),
                t(
                  "В разделе под PIN-кодом — неделя ребёнка: дни и минуты занятий, что решено, и спокойный совет. Итоги недели можно получать в Telegram.",
                  "PIN-kod ostidagi boʻlimda — bolaning haftasi: mashgʻulot kunlari va daqiqalari, nimalar yechilgani va xotirjam maslahat. Hafta yakunlarini Telegramda olish mumkin.",
                ),
              ],
            ] as [LucideIcon, string, string][]
          ).map(([Icon, title, text], i) => (
            <li key={title} className={card}>
              <p className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-muted uppercase">
                <Icon className="h-5 w-5 text-brand" strokeWidth={2.25} aria-hidden />
                {t(`Шаг ${i + 1}`, `${i + 1}-qadam`)}
              </p>
              <h3 className="mt-2 text-lg font-black">{title}</h3>
              <p className="mt-1 text-[0.95rem] text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="different">
        <h2 id="different" className="text-2xl font-black">
          {t("Чем отличается", "Nimasi bilan farq qiladi")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {different.map((d) => (
            <article key={d.title} className={card}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
                <d.Icon className={icon} strokeWidth={2.25} aria-hidden />
              </span>
              <h3 className="mt-2 text-lg font-black">{d.title}</h3>
              <p className="mt-1 text-[0.95rem] text-muted">{d.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-black">
          {t("Частые вопросы", "Tez-tez soʻraladigan savollar")}
        </h2>
        <div className="mt-4 space-y-2">
          {faq.map((f) => (
            <details key={f.q} className={`${card} group`}>
              <summary className="flex cursor-pointer list-none items-center gap-2 font-extrabold [&::-webkit-details-marker]:hidden">
                <span className="flex-1">{f.q}</span>
                <ChevronDown
                  className="h-5 w-5 text-muted transition group-open:rotate-180"
                  strokeWidth={2.25}
                  aria-hidden
                />
              </summary>
              <p className="mt-2 text-[0.95rem] text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={`${card} flex flex-wrap items-center gap-4`}>
        <p className="mr-auto text-lg font-black">
          {t(
            "Попробуйте вместе с ребёнком — первое занятие занимает полчаса.",
            "Bola bilan birga sinab koʻring — birinchi mashgʻulot yarim soat oladi.",
          )}
        </p>
        <ButtonLink href="/" size="lg">
          {t("Начать", "Boshlash")} <Icon icon={Play} className="fill-current" />
        </ButtonLink>
        <Link
          href="/parent"
          className="inline-flex min-h-11 items-center gap-1.5 font-extrabold text-brand hover:underline"
        >
          <Lock className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          {t("Раздел для взрослых", "Kattalar boʻlimi")}
        </Link>
      </section>
    </div>
  );
}
