"use client";

import { useState } from "react";
import { Card, cn } from "@/components/ui";
import { useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import { api, errorText, usePoll } from "@/lib/onlineClient";

interface Profile {
  username: string;
  onlineOk: boolean;
  chatOk: boolean;
  findable: boolean;
}

/** Родительские выключатели игры по сети: играть, переписываться, быть в поиске. Показываются после входа в аккаунт. */
export function OnlineControls() {
  const t = useT();
  const account = useAccount();
  const [error, setError] = useState<string | null>(null);
  const { data, set } = usePoll<{ profile: Profile | null }>(
    async () => {
      const res = await api<{ profile: Profile | null }>("/api/play/me");
      return res.ok ? { profile: res.data.profile } : null;
    },
    60_000,
    !!account.user,
  );
  if (!account.user) return null;

  const change = async (patch: Partial<Profile>) => {
    setError(null);
    const res = await api<{ profile: Profile }>("/api/play/me", patch);
    if (!res.ok) return setError(errorText(res.data.error, t));
    set({ profile: res.data.profile });
  };

  const profile = data?.profile;
  const rows: { key: "onlineOk" | "chatOk" | "findable"; title: string; text: string }[] = [
    {
      key: "onlineOk",
      title: t("Играть с друзьями по сети", "Doʻstlar bilan onlayn oʻynash"),
      text: t(
        "Ребёнок сможет вызывать друзей на партии и принимать вызовы. Выключите — игра по сети остановится.",
        "Farzandingiz doʻstlarini partiyaga chaqira va chaqiriqlarni qabul qila oladi. Oʻchirsangiz, onlayn oʻyin toʻxtaydi.",
      ),
    },
    {
      key: "chatOk",
      title: t("Переписка с друзьями", "Doʻstlar bilan yozishma"),
      text: t(
        "Короткие сообщения только друзьям. Ссылки, номера телефонов и грубые слова не отправляются. Выключите — писать будет нельзя.",
        "Faqat doʻstlarga qisqa xabarlar. Havola, telefon raqami va qoʻpol soʻzlar yuborilmaydi. Oʻchirsangiz, yozib boʻlmaydi.",
      ),
    },
    {
      key: "findable",
      title: t("Меня можно найти по имени", "Meni ism bilan topish mumkin"),
      text: t(
        "Другие игроки смогут найти ребёнка в поиске и попросить дружбы. Выключите — подружиться можно будет, только если ребёнок сам попросит.",
        "Boshqa oʻyinchilar farzandingizni qidiruvdan topib, doʻstlik soʻrashi mumkin. Oʻchirsangiz, faqat farzandingiz oʻzi soʻrasagina doʻst boʻlinadi.",
      ),
    },
  ];

  return (
    <Card className="space-y-3 p-5" data-online-controls>
      <h2 className="text-lg font-extrabold">👥 {t("Шахматы по сети", "Onlayn shaxmat")}</h2>
      <p className="text-[0.95rem] text-muted">
        {t(
          "Ребёнок играет только с теми, кого сам добавил в друзья, под придуманным именем (не настоящим). Здесь вы решаете, что разрешено.",
          "Farzand faqat oʻzi doʻst qilganlar bilan, oʻylab topilgan ism (haqiqiy emas) bilan oʻynaydi. Nimalar ruxsat etilishini shu yerda siz hal qilasiz.",
        )}
      </p>
      {!data ? (
        <p className="text-sm text-muted">{t("Загружаем…", "Yuklanmoqda…")}</p>
      ) : !profile ? (
        <p className="text-sm text-muted">
          {t(
            "Имя в игре ещё не выбрано. Выключатели появятся, когда ребёнок откроет раздел «Играть с друзьями» и выберет имя.",
            "Oʻyindagi ism hali tanlanmagan. Farzand «Doʻstlar bilan oʻynash» boʻlimini ochib ism tanlaganda tugmalar paydo boʻladi.",
          )}
        </p>
      ) : (
        <>
          <p className="text-sm">
            {t("Имя в игре: ", "Oʻyindagi ism: ")}
            <b className="font-mono">{profile.username}</b>
          </p>
          <div className="divide-y divide-line rounded-2xl border-2 border-line">
            {rows.map((r) => (
              <label key={r.key} className="flex cursor-pointer items-start gap-4 p-4" data-online-switch={r.key}>
                <span className="flex-1">
                  <span className="block font-extrabold">{r.title}</span>
                  <span className="block text-[0.95rem] text-muted">{r.text}</span>
                </span>
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={profile[r.key]}
                  onChange={(e) => void change({ [r.key]: e.target.checked })}
                />
                <span
                  className={cn(
                    "relative mt-1 h-7 w-12 shrink-0 rounded-full transition peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30",
                    profile[r.key] ? "bg-brand" : "bg-black/15",
                  )}
                  aria-hidden
                >
                  <span
                    className={cn(
                      "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left]",
                      profile[r.key] ? "left-6" : "left-1",
                    )}
                  />
                </span>
              </label>
            ))}
          </div>
        </>
      )}
      {error && (
        <p className="rounded-xl bg-rose/10 px-3 py-1.5 text-sm font-bold text-[#b42318]" role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}
