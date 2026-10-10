"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui";
import { loginAvailable, logout, refreshAccount, useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";

const noop = () => () => {};

/**
 * Вход в аккаунт (для родителя): Google или Telegram. Аккаунт нужен только для того,
 * чтобы прогресс был на всех устройствах; без него всё работает в этом браузере.
 */
export function AccountPanel({ back = "/parent/settings" }: { back?: string }) {
  const t = useT();
  const account = useAccount();
  const result = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("login"),
    () => null,
  );

  if (account.status === "loading") {
    return <p className="text-sm text-muted">{t("Проверяем вход…", "Kirish tekshirilmoqda…")}</p>;
  }

  if (!loginAvailable(account)) {
    return (
      <p className="text-sm text-muted">
        {t(
          "Вход через Google или Telegram на этом сайте пока не подключён. Всё работает и без аккаунта: прогресс хранится в этом браузере.",
          "Google yoki Telegram orqali kirish bu saytda hali ulanmagan. Hisobsiz ham hammasi ishlaydi: natijalar shu brauzerda saqlanadi.",
        )}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {result === "ok" && account.user && (
        <p className="rounded-2xl bg-mint-soft px-3 py-2 text-sm font-bold text-[#047857]" role="status">
          {t(
            "Вход выполнен — прогресс теперь сохраняется в аккаунте.",
            "Kirdingiz — endi natijalar hisobingizda saqlanadi.",
          )}
        </p>
      )}
      {result === "error" && (
        <p className="rounded-2xl bg-rose/10 px-3 py-2 text-sm font-bold text-[#b42318]" role="alert">
          {t("Войти не получилось. Попробуйте ещё раз.", "Kirish amalga oshmadi. Yana bir bor urinib koʻring.")}
        </p>
      )}
      {account.user ? (
        <>
          <p className="font-bold">
            {account.user.provider === "google"
              ? t(`Вы вошли через Google: ${account.user.name}`, `Siz Google orqali kirdingiz: ${account.user.name}`)
              : t(
                  `Вы вошли через Telegram: ${account.user.name}`,
                  `Siz Telegram orqali kirdingiz: ${account.user.name}`,
                )}
          </p>
          <p className="text-sm text-muted">
            {t(
              "Прогресс сохраняется в аккаунте сам. Войдите тем же способом на другом устройстве — и всё будет там.",
              "Natijalar hisobingizga oʻzi saqlanadi. Boshqa qurilmada ham xuddi shu usulda kiring — hammasi oʻsha yerda boʻladi.",
            )}
          </p>
          <Button variant="secondary" onClick={() => void logout()}>
            {t("Выйти из аккаунта", "Hisobdan chiqish")}
          </Button>
          <DeleteAccount />
        </>
      ) : (
        <>
          <p className="text-sm text-muted">
            {t(
              "Войдите, чтобы прогресс сохранялся в аккаунте и был на всех устройствах: телефоне, планшете, компьютере. Без аккаунта тоже всё работает — прогресс хранится в этом браузере.",
              "Kirsangiz, natijalar hisobingizda saqlanadi va barcha qurilmalarda — telefon, planshet va kompyuterda koʻrinadi. Hisobsiz ham hammasi ishlaydi — natijalar shu brauzerda saqlanadi.",
            )}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {account.providers.google && (
              <a
                href={`/api/auth/google?back=${encodeURIComponent(back)}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 py-2 font-extrabold shadow-card hover:border-brand/40"
              >
                <GoogleMark />
                {t("Войти через Google", "Google orqali kirish")}
              </a>
            )}
            {account.providers.telegram && account.providers.botName && (
              <TelegramButton botName={account.providers.botName} back={back} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

/** Официальная кнопка Telegram Login Widget: после входа Telegram вернёт на /api/auth/telegram. */
function TelegramButton({ botName, back }: { botName: string; back: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "14");
    // Разрешение боту писать в личные сообщения: нужно для итогов недели.
    script.setAttribute("data-request-access", "write");
    script.setAttribute(
      "data-auth-url",
      `${window.location.origin}/api/auth/telegram?back=${encodeURIComponent(back)}`,
    );
    el.replaceChildren(script);
    return () => el.replaceChildren();
  }, [botName, back]);
  return <div ref={box} className="min-h-10" />;
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

/** Удалить всё, что лежит в аккаунте. Два нажатия: случайно не получится. */
function DeleteAccount() {
  const t = useT();
  const [confirm, setConfirm] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const run = async () => {
    setState("busy");
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      setState(res.ok ? "done" : "error");
      if (res.ok) await refreshAccount();
    } catch {
      setState("error");
    }
  };
  if (state === "done")
    return (
      <p className="rounded-2xl bg-mint-soft px-3 py-2 text-sm font-bold text-[#047857]" role="status">
        {t(
          "Данные аккаунта удалены, вход завершён. Прогресс на этом устройстве остался — его можно стереть кнопкой «Сбросить прогресс».",
          "Hisob maʼlumotlari oʻchirildi, seans tugadi. Bu qurilmadagi natijalar qoldi — ularni «Natijalarni oʻchirish» tugmasi bilan tozalash mumkin.",
        )}
      </p>
    );
  return (
    <div className="space-y-2 border-t border-line pt-3" data-delete-account>
      <p className="text-sm text-muted">
        {t(
          "Удалить данные аккаунта: прогресс всех профилей, имя в игре, друзей, партии и переписку. Сначала можно сохранить прогресс файлом (ниже).",
          "Hisob maʼlumotlarini oʻchirish: barcha profillar natijalari, oʻyindagi ism, doʻstlar, partiyalar va yozishma. Avval natijalarni faylga saqlab qoʻyish mumkin (pastda).",
        )}
      </p>
      {confirm ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="sun" onClick={() => void run()} disabled={state === "busy"}>
            {t("Да, удалить данные аккаунта", "Ha, hisob maʼlumotlarini oʻchirish")}
          </Button>
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            {t("Отмена", "Bekor qilish")}
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
          🗑 {t("Удалить данные аккаунта", "Hisob maʼlumotlarini oʻchirish")}
        </Button>
      )}
      {state === "error" && (
        <p className="text-sm font-bold text-[#b42318]" role="alert">
          {t("Не получилось. Попробуйте ещё раз.", "Amalga oshmadi. Yana urinib koʻring.")}
        </p>
      )}
    </div>
  );
}
