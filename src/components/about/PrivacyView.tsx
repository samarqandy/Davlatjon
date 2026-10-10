"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

const card = "rounded-3xl bg-white p-5 shadow-card";

/** Какие данные есть, где лежат и как их удалить — простыми словами, для родителей. */
export function PrivacyView({ contact }: { contact: string }) {
  const t = useT();
  const sections: { id: string; title: string; body: string[] }[] = [
    {
      id: "device",
      title: t("На устройстве (без входа)", "Qurilmada (kirmasdan)"),
      body: [
        t(
          "Прогресс, настройки, имя и возраст ребёнка, аватарка, PIN-код (в виде отпечатка, не самим числом) хранятся только в браузере этого устройства. Пока вы не вошли в аккаунт, эти данные никуда не отправляются.",
          "Natijalar, sozlamalar, bolaning ismi va yoshi, rasmi, PIN-kod (raqamning oʻzi emas, balki izi) faqat shu qurilma brauzerida saqlanadi. Hisobga kirmaguningizcha bu maʼlumotlar hech qayoqqa yuborilmaydi.",
        ),
        t(
          "Удалить: в разделе для взрослых → «Настройки» → «Сбросить прогресс…», либо очистите данные сайта в браузере.",
          "Oʻchirish: kattalar boʻlimi → «Sozlamalar» → «Natijalarni oʻchirish…», yoki brauzerda sayt maʼlumotlarini tozalang.",
        ),
      ],
    },
    {
      id: "account",
      title: t("Если вы вошли через Google или Telegram", "Google yoki Telegram orqali kirsangiz"),
      body: [
        t(
          "Мы получаем от Google или Telegram только идентификатор аккаунта и отображаемое имя — этого достаточно, чтобы узнать вас при следующем входе. Пароли мы не видим и не храним. Сеанс держится в защищённом cookie (до 180 дней), его можно завершить кнопкой «Выйти».",
          "Google yoki Telegram’dan faqat hisob identifikatori va koʻrinadigan ismni olamiz — keyingi kirishda sizni tanish uchun shu yetarli. Parollarni koʻrmaymiz va saqlamaymiz. Seans himoyalangan cookie’da saqlanadi (180 kungacha), uni «Chiqish» tugmasi bilan tugatish mumkin.",
        ),
        t(
          "Прогресс каждого ребёнка (задачи, ответы, время занятий, имя и возраст, если вы их указали) хранится в базе данных Neon (Postgres), чтобы быть на всех устройствах. Данные доступны только по вашему аккаунту.",
          "Har bir bolaning natijalari (masalalar, javoblar, mashgʻulot vaqti, ism va yosh — agar koʻrsatgan boʻlsangiz) barcha qurilmalarda boʻlishi uchun Neon (Postgres) maʼlumotlar bazasida saqlanadi. Maʼlumotlar faqat sizning hisobingiz orqali ochiladi.",
        ),
      ],
    },
    {
      id: "play",
      title: t("Игра с друзьями по сети", "Doʻstlar bilan onlayn oʻyin"),
      body: [
        t(
          "Для игры ребёнок выбирает придуманное имя (не настоящее — подсказка об этом есть при выборе). Хранятся: это имя, список друзей и просьб, сыгранные партии, короткие сообщения друзьям (до 200 знаков, без ссылок, телефонов и грубых слов), время последнего посещения — оно нужно для отметки «в сети», и серия дней с занятиями (одно число, его видят только друзья).",
          "Oʻynash uchun bola oʻylab topilgan ismni tanlaydi (haqiqiy emas — tanlashda bu haqda eslatma bor). Saqlanadi: shu ism, doʻstlar va soʻrovlar roʻyxati, oʻynalgan partiyalar, doʻstlarga qisqa xabarlar (200 belgigacha, havola, telefon va qoʻpol soʻzlarsiz) hamda oxirgi kirish vaqti — «onlayn» belgisi uchun kerak — hamda shugʻullangan kunlar seriyasi (bitta raqam, uni faqat doʻstlar koʻradi).",
        ),
        t(
          "Случайных соперников нет: играть и писать можно только с теми, кого ребёнок добавил в друзья. Родитель в настройках может выключить игру, переписку и поиск по имени.",
          "Tasodifiy raqiblar yoʻq: faqat bola doʻstlar roʻyxatiga qoʻshganlar bilan oʻynash va yozish mumkin. Ota-ona sozlamalarda oʻyin, yozishma va ism boʻyicha qidiruvni oʻchirishi mumkin.",
        ),
      ],
    },
    {
      id: "telegram",
      title: t("Итоги недели в Telegram", "Telegramdagi hafta yakunlari"),
      body: [
        t(
          "Это включает только родитель, и только при входе через Telegram. Раз в неделю бот присылает вам короткие итоги (сколько дней занимались, сколько задач решено). Имя ребёнка в сообщение не попадает.",
          "Buni faqat ota-ona yoqadi va faqat Telegram orqali kirganda. Haftada bir marta bot sizga qisqa yakunlarni yuboradi (necha kun shugʻullanildi, nechta masala yechildi). Bolaning ismi xabarga kirmaydi.",
        ),
      ],
    },
    {
      id: "not",
      title: t("Чего мы не делаем", "Nimalarni qilmaymiz"),
      body: [
        t(
          "Не показываем рекламу. Не подключаем аналитику и чужие трекеры. Не продаём и не передаём данные для рекламы. Не просим настоящее имя, фото, адрес или телефон ребёнка. Озвучку задач записали заранее с помощью сервиса синтеза речи — в него не отправляются никакие данные пользователей.",
          "Reklama koʻrsatmaymiz. Tahlil va begona kuzatuvchilarni ulamaymiz. Maʼlumotlarni reklama uchun sotmaymiz va bermaymiz. Bolaning haqiqiy ismi, rasmi, manzili yoki telefonini soʻramaymiz. Masalalar ovozini oldindan nutq sintezi xizmati bilan yozib qoʻyganmiz — unga foydalanuvchilarning hech qanday maʼlumoti yuborilmaydi.",
        ),
        t(
          "Технически сайт работает на хостинге Vercel: как и у любого сайта, там остаются обычные служебные журналы запросов (адрес, время).",
          "Texnik jihatdan sayt Vercel hostingida ishlaydi: har qanday sayt kabi u yerda oddiy xizmat soʻrovlari jurnali (manzil, vaqt) qoladi.",
        ),
      ],
    },
    {
      id: "delete",
      title: t("Как удалить данные", "Maʼlumotlarni qanday oʻchirish"),
      body: [
        t(
          "Войдите в аккаунт, откройте раздел для взрослых → «Настройки» → «Аккаунт» и нажмите «Удалить данные аккаунта». Будут стёрты прогресс всех профилей, имя в игре, друзья, партии и сообщения. Копию прогресса можно сохранить файлом там же — до удаления.",
          "Hisobga kiring, kattalar boʻlimi → «Sozlamalar» → «Hisob» ga oʻting va «Hisob maʼlumotlarini oʻchirish» ni bosing. Barcha profillarning natijalari, oʻyindagi ism, doʻstlar, partiyalar va xabarlar oʻchiriladi. Natijalar nusxasini oʻchirishdan oldin shu yerning oʻzida faylga saqlab qoʻyish mumkin.",
        ),
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="text-3xl font-black">{t("Конфиденциальность", "Maxfiylik")}</h1>
        <p className="mt-1 text-muted">
          {t(
            "Простыми словами: какие данные есть, где лежат и как их удалить. Страница написана для родителей.",
            "Oddiy tilda: qanday maʼlumotlar bor, qayerda saqlanadi va qanday oʻchiriladi. Sahifa ota-onalar uchun yozilgan.",
          )}
        </p>
      </header>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className={card} aria-labelledby={`${s.id}-h`}>
          <h2 id={`${s.id}-h`} className="text-xl font-black">
            {s.title}
          </h2>
          {s.body.map((p) => (
            <p key={p.slice(0, 24)} className="mt-2 text-[0.97rem]">
              {p}
            </p>
          ))}
        </section>
      ))}
      <p className="text-sm text-muted">
        {contact ? (
          <>
            {t("Вопросы: ", "Savollar: ")}
            <b>{contact}</b>.{" "}
          </>
        ) : null}
        {t("Обновлено: 10 октября 2026.", "Yangilangan: 2026-yil 10-oktabr.")}{" "}
        <Link href="/about" className="font-extrabold text-brand hover:underline">
          {t("О платформе", "Platforma haqida")}
        </Link>
      </p>
    </div>
  );
}
