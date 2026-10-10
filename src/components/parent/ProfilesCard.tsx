"use client";

import { useState } from "react";
import { Button, Card, cn } from "@/components/ui";
import { useHydrated } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { AGE_MAX, AGE_MIN } from "@/lib/age";
import { cleanChildName } from "@/lib/childName";
import {
  AVATARS,
  MAX_PROFILES,
  addProfile,
  readProfileState,
  removeProfile,
  setOtherAvatar,
  switchProfile,
} from "@/lib/profiles";
import { getState, updateSettings } from "@/lib/store";
import { useProfiles } from "@/lib/useProfiles";

/** Дети на этом устройстве: у каждого свой прогресс. Заводить и удалять профили может только родитель (раздел за PIN-кодом). */
export function ProfilesCard() {
  const t = useT();
  const hydrated = useHydrated();
  const reg = useProfiles();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState(8);
  const [avatar, setAvatar] = useState<string>(AVATARS[1]);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!hydrated || !reg) return null;

  const create = () => {
    const clean = cleanChildName(name);
    if (!clean) return setError(t("Напишите имя ребёнка.", "Farzand ismini yozing."));
    const id = addProfile({ name: clean, age, avatar }, getState());
    if (!id) return setError(t("Больше профилей завести нельзя.", "Boshqa profil qoʻshib boʻlmaydi."));
    setAdding(false);
    setName("");
    setError(null);
    switchProfile(id);
  };

  return (
    <Card className="space-y-3 p-5" data-profiles-card>
      <h2 className="text-lg font-extrabold">👨‍👩‍👧 {t("Дети на этом устройстве", "Bu qurilmadagi bolalar")}</h2>
      <p className="text-[0.95rem] text-muted">
        {t(
          "У каждого ребёнка свой прогресс, свои медали и серия. Когда профилей больше одного, в шапке сайта появляется кнопка с картинкой: ребёнок выбирает себя сам. Вход в аккаунт сохраняет прогресс каждого профиля отдельно; список профилей на другом устройстве нужно завести заново.",
          "Har bir bolaning oʻz natijasi, medallari va seriyasi bor. Profillar ikkita yoki undan koʻp boʻlsa, sayt sarlavhasida rasmli tugma paydo boʻladi: bola oʻzini oʻzi tanlaydi. Hisobga kirsangiz, har bir profilning natijasi alohida saqlanadi; boshqa qurilmada profillar roʻyxatini qaytadan yaratish kerak.",
        )}
      </p>
      <ul className="divide-y divide-line rounded-2xl border-2 border-line">
        {reg.list.map((p) => {
          const active = p.id === reg.active;
          const s = readProfileState(p.id).settings;
          const shownAvatar = s.avatar ?? "🐣";
          return (
            <li key={p.id} className="space-y-2 p-3" data-profile-row={p.id}>
              <div className="flex flex-wrap items-center gap-3">
                <span aria-hidden className="text-3xl leading-none">
                  {shownAvatar}
                </span>
                <div className="mr-auto">
                  <p className="font-extrabold">{s.childName ?? t("Без имени", "Ismsiz")}</p>
                  <p className="text-sm text-muted">
                    {s.age ? t(`${s.age} лет`, `${s.age} yosh`) : t("возраст не указан", "yoshi koʻrsatilmagan")}
                  </p>
                </div>
                {active ? (
                  <span className="rounded-full bg-mint-soft px-3 py-1 text-sm font-extrabold text-[#047857]">
                    {t("сейчас открыт", "hozir ochiq")}
                  </span>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => switchProfile(p.id)}>
                    {t("Открыть", "Ochish")}
                  </Button>
                )}
                {reg.list.length > 1 &&
                  (confirm === p.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="sun"
                        onClick={() => {
                          removeProfile(p.id);
                          setConfirm(null);
                        }}
                      >
                        {t("Да, удалить с прогрессом", "Ha, natijalari bilan oʻchirish")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirm(null)}>
                        {t("Отмена", "Bekor qilish")}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setConfirm(p.id)}>
                      🗑 {t("Удалить", "Oʻchirish")}
                    </Button>
                  ))}
              </div>
              <div className="flex flex-wrap gap-1" role="group" aria-label={t("Картинка профиля", "Profil rasmi")}>
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={shownAvatar === a}
                    onClick={() => (active ? updateSettings({ avatar: a }) : setOtherAvatar(p.id, a))}
                    className={cn(
                      "h-10 w-10 rounded-xl border-2 text-xl transition",
                      shownAvatar === a ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {adding ? (
        <form
          className="space-y-3 rounded-2xl bg-brand-soft/40 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
        >
          <label className="block text-sm font-extrabold">
            {t("Имя ребёнка", "Bolaning ismi")}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              className="mt-1 block min-h-11 w-full rounded-xl border-2 border-line bg-white px-3 text-base font-bold outline-none focus:border-brand"
              data-new-profile-name
            />
          </label>
          <label className="block text-sm font-extrabold">
            {t("Возраст", "Yoshi")}
            <select
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="mt-1 block min-h-11 rounded-xl border-2 border-line bg-white px-3 text-base font-bold"
            >
              {Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i).map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-1" role="group" aria-label={t("Картинка профиля", "Profil rasmi")}>
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={avatar === a}
                onClick={() => setAvatar(a)}
                className={cn(
                  "h-10 w-10 rounded-xl border-2 text-xl transition",
                  avatar === a ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40",
                )}
              >
                {a}
              </button>
            ))}
          </div>
          {error && (
            <p className="text-sm font-bold text-[#b42318]" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">{t("Добавить и открыть", "Qoʻshish va ochish")}</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              {t("Отмена", "Bekor qilish")}
            </Button>
          </div>
        </form>
      ) : (
        reg.list.length < MAX_PROFILES && (
          <Button variant="secondary" onClick={() => setAdding(true)} data-add-profile>
            ＋ {t("Добавить ребёнка", "Bola qoʻshish")}
          </Button>
        )
      )}
    </Card>
  );
}
