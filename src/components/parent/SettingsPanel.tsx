"use client";

import { useRef, useState } from "react";
import { AccountPanel } from "@/components/AccountPanel";
import { BoardLookPicker } from "@/components/chess/BoardLookPicker";
import { OnlineControls } from "@/components/parent/OnlineControls";
import { Button, Card, cn } from "@/components/ui";
import { AGE_MAX, AGE_MIN, profileMeta, profileText } from "@/lib/age";
import { CHILD_NAME_MAX, cleanChildName, latinize } from "@/lib/childName";
import { LANGS, setLang, useLang, useT } from "@/lib/i18n";
import { forgetPin } from "@/lib/parentGate";
import { getState, replaceState, resetProgress, sanitize, setChildName, updateSettings, useStore } from "@/lib/store";

/** Сообщение сразу на обоих языках — чтобы оно не застряло на старом языке после переключения. */
type Message = { ru: string; uz: string };

export function SettingsPanel() {
  const t = useT();
  const settings = useStore((s) => s.settings);
  const [message, setMessage] = useState<Message | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parvozedu-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ ru: "Файл с прогрессом сохранён.", uz: "Natijalar fayli saqlandi." });
  };

  const importData = async (file: File) => {
    try {
      const data = sanitize(JSON.parse(await file.text()));
      if (
        !window.confirm(
          t(
            "Заменить прогресс на этом устройстве данными из файла?",
            "Shu qurilmadagi natijalar fayldagi maʼlumotlar bilan almashtirilsinmi?",
          ),
        )
      )
        return;
      replaceState(data);
      setMessage({ ru: "Прогресс загружен из файла.", uz: "Natijalar fayldan yuklandi." });
    } catch {
      setMessage({
        ru: "Не получилось прочитать файл. Выберите файл, сохранённый кнопкой «Сохранить в файл».",
        uz: "Faylni oʻqib boʻlmadi. «Faylga saqlash» tugmasi bilan saqlangan faylni tanlang.",
      });
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">{t("Настройки", "Sozlamalar")}</h1>

      <Card className="divide-y divide-line">
        <LangRow />
        <NameRow name={settings.childName} nameUz={settings.childNameUz} />
        <AgeRow value={settings.age} onChange={(age) => updateSettings({ age })} />
        <Toggle
          title={t("Озвучка", "Diktor ovozi")}
          text={t(
            "Диктор читает приветствие, легенды уровней и истории «Тайн шахмат» и хвалит за решения. Это записи диктора, а не голос браузера.",
            "Diktor salomlashuvni, darajalar afsonalarini va «Shaxmat sirlari» hikoyalarini oʻqib beradi, yechimlar uchun maqtaydi. Bu brauzer ovozi emas, diktor yozuvlari.",
          )}
          value={settings.sound !== false}
          onChange={(v) => updateSettings({ sound: v })}
        />
        <div className="p-5">
          <p className="font-extrabold">{t("Доска и звуки ходов", "Taxta va yurish ovozlari")}</p>
          <p className="mb-3 text-[0.95rem] text-muted">
            {t(
              "Цвета доски и звук хода: деревянные записи или мягкие. Работает и без интернета, диктору не мешает.",
              "Taxta ranglari va yurish ovozi: yogʻoch yozuvlari yoki yumshoq. Internetsiz ham ishlaydi, diktorga xalaqit bermaydi.",
            )}
          </p>
          <BoardLookPicker />
        </div>
        <Toggle
          title={t("Пауза перед следующей подсказкой", "Keyingi maslahatdan oldin pauza")}
          text={t(
            "После каждой подсказки следующая откроется через 15 секунд — чтобы ребёнок успел подумать.",
            "Har bir maslahatdan keyin navbatdagisi 15 soniyadan soʻng ochiladi — farzandingiz oʻylab olishga ulgursin.",
          )}
          value={settings.hintPause}
          onChange={(v) => updateSettings({ hintPause: v })}
        />
        <Toggle
          title={t("Крупный текст в задачах", "Masalalarda yirik matn")}
          text={t(
            "Условия и подсказки будут крупнее — удобно на телефоне или если ребёнку так легче читать.",
            "Shart va maslahatlar yirikroq boʻladi — telefonda qulay, farzandingizga ham oʻqish osonroq boʻlishi mumkin.",
          )}
          value={settings.bigText}
          onChange={(v) => updateSettings({ bigText: v })}
        />
        <Toggle
          title={t("Открыть все уровни шахматной школы", "Shaxmat maktabining barcha darajalarini ochish")}
          text={t(
            "Обычно следующий шахматный уровень открывается, когда решены все упражнения предыдущего. Включите, если ребёнок уже знает шахматы.",
            "Odatda keyingi shaxmat darajasi oldingisidagi barcha mashqlar yechilgach ochiladi. Farzandingiz shaxmatni allaqachon bilsa, buni yoqib qoʻying.",
          )}
          value={settings.chessOpenAll === true}
          onChange={(v) => updateSettings({ chessOpenAll: v })}
        />
      </Card>

      <Card id="account" className="scroll-mt-24 space-y-3 p-5">
        <h2 className="text-lg font-extrabold">👤 {t("Аккаунт", "Hisob")}</h2>
        <AccountPanel />
      </Card>

      <OnlineControls />

      <Card className="space-y-3 p-5">
        <h2 className="text-lg font-extrabold">💾 {t("Прогресс", "Natijalar")}</h2>
        <p className="text-[0.95rem] text-muted">
          {t(
            "Без входа в аккаунт всё хранится только в этом браузере. Чтобы перенести прогресс на другое устройство (или сохранить копию), сохраните его в файл, а на другом устройстве загрузите этот файл.",
            "Hisobga kirmasangiz, hammasi faqat shu brauzerda saqlanadi. Natijalarni boshqa qurilmaga koʻchirish (yoki nusxasini saqlab qoʻyish) uchun ularni faylga saqlang, soʻng boshqa qurilmada shu faylni yuklang.",
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}>
            ⬇️ {t("Сохранить в файл", "Faylga saqlash")}
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            ⬆️ {t("Загрузить из файла", "Fayldan yuklash")}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importData(f);
              e.target.value = "";
            }}
          />
        </div>
        {message && <p className="font-bold text-brand-dark">{t(message.ru, message.uz)}</p>}
      </Card>

      <Card className="space-y-3 p-5">
        <h2 className="text-lg font-extrabold">🔒 {t("PIN-код", "PIN-kod")}</h2>
        <p className="text-[0.95rem] text-muted">
          {t(
            "Можно придумать новый PIN-код: текущий удалится, и при следующем входе в раздел система попросит задать новый.",
            "Yangi PIN-kod oʻylab topishingiz mumkin: hozirgisi oʻchiriladi, boʻlimga keyingi safar kirganingizda esa yangisini soʻraydi.",
          )}
        </p>
        <Button variant="secondary" onClick={forgetPin}>
          {t("Сменить PIN-код", "PIN-kodni almashtirish")}
        </Button>
      </Card>

      <Card className="space-y-3 border-rose/30 p-5">
        <h2 className="text-lg font-extrabold text-rose">{t("Начать заново", "Qaytadan boshlash")}</h2>
        <p className="text-[0.95rem] text-muted">
          {t(
            "Удалит решения, отметки и заметки на этом устройстве. Настройки и PIN-код останутся.",
            "Shu qurilmadagi yechimlar, belgilar va qaydlar oʻchib ketadi. Sozlamalar va PIN-kod saqlanib qoladi.",
          )}
        </p>
        {!confirmReset ? (
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>
            {t("Сбросить прогресс…", "Natijalarni oʻchirish…")}
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">
              {t("Точно удалить весь прогресс?", "Barcha natijalar rostdan ham oʻchirilsinmi?")}
            </span>
            <Button
              variant="secondary"
              className="border-rose text-rose"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                setMessage({ ru: "Прогресс сброшен.", uz: "Natijalar oʻchirildi." });
              }}
            >
              {t("Да, удалить", "Ha, oʻchirilsin")}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              {t("Отмена", "Bekor qilish")}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

/** Язык платформы: переключает и раздел родителя, и всё, что видит ребёнок. */
function LangRow() {
  const t = useT();
  const lang = useLang();
  return (
    <div className="flex flex-wrap items-start gap-4 p-5">
      <span className="min-w-56 flex-1">
        <span className="block font-extrabold">Til · Язык</span>
        <span className="block text-[0.95rem] text-muted">
          {t(
            "Язык всей платформы на этом устройстве: вместе с этим разделом переключится и интерфейс ребёнка — занятия, подсказки, шахматы.",
            "Shu qurilmadagi butun platforma tili: bu boʻlim bilan birga farzandingiz koʻradigan hamma narsa — mashgʻulotlar, maslahatlar, shaxmat ham shu tilga oʻtadi.",
          )}
        </span>
      </span>
      <div className="mt-1 flex shrink-0 gap-1.5" role="group" aria-label="Til · Язык">
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLang(l.id)}
            aria-pressed={lang === l.id}
            className={cn(
              "min-h-11 rounded-xl border-2 px-3 text-sm font-black transition",
              lang === l.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Возраст ребёнка: от него зависят советы, сложность задачи дня и открытые уровни шахмат. */
/** Имя ребёнка: сохраняется, когда поле теряет фокус или нажат Enter. Кириллическое имя — ещё и латиницей для узбекского. */
function NameRow({ name, nameUz }: { name?: string; nameUz?: string }) {
  const t = useT();
  const [draft, setDraft] = useState<string | null>(null);
  const [draftUz, setDraftUz] = useState<string | null>(null);
  const value = draft ?? name ?? "";
  const cyrillic = /[\u0400-\u04FF]/.test(value);
  const save = () => {
    if (draft === null && draftUz === null) return;
    const clean = cleanChildName(value);
    if (clean) setChildName(clean, cyrillic ? (draftUz ?? nameUz) : undefined);
    setDraft(null);
    setDraftUz(null);
  };
  const input =
    "min-h-11 w-full rounded-xl border-2 border-line bg-white px-3 font-bold outline-none focus:border-brand";
  return (
    <div className="space-y-2 p-5">
      <label className="block">
        <span className="block font-extrabold">{t("Имя ребёнка", "Farzandingiz ismi")}</span>
        <span className="block text-[0.95rem] text-muted">
          {t(
            "Так Лаборатория обращается к ребёнку, и это имя носит герой задач.",
            "Laboratoriya farzandingizga shu ism bilan murojaat qiladi, masalalar qahramoni ham shu ismda.",
          )}
        </span>
        <input
          type="text"
          value={value}
          maxLength={CHILD_NAME_MAX + 8}
          autoComplete="off"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className={cn(input, "mt-2")}
        />
      </label>
      {cyrillic && (
        <label className="block">
          <span className="block text-sm font-bold text-muted">
            {t("Как писать имя по-узбекски (латиницей)", "Ismning oʻzbekcha (lotin) yozilishi")}
          </span>
          <input
            type="text"
            value={draftUz ?? nameUz ?? ""}
            placeholder={latinize(cleanChildName(value) ?? "")}
            maxLength={CHILD_NAME_MAX + 8}
            autoComplete="off"
            onChange={(e) => setDraftUz(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className={cn(input, "mt-1")}
          />
        </label>
      )}
    </div>
  );
}

function AgeRow({ value, onChange }: { value?: number; onChange: (age: number | undefined) => void }) {
  const t = useT();
  const lang = useLang();
  const meta = profileText(profileMeta(value), lang);
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);
  return (
    <div className="flex items-start gap-4 p-5">
      <span className="flex-1">
        <span className="block font-extrabold">{t("Возраст ребёнка", "Farzandingiz yoshi")}</span>
        <span className="block text-[0.95rem] text-muted">
          {t(
            `${meta.name} профиль (${meta.ages}). ${meta.about}`,
            `«${meta.name}» rejimi (${meta.ages}). ${meta.about}`,
          )}
        </span>
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        aria-label={t("Возраст ребёнка", "Farzandingiz yoshi")}
        className="mt-1 min-h-11 shrink-0 rounded-xl border-2 border-line bg-white px-3 font-bold"
      >
        <option value="">{t("не указан", "koʻrsatilmagan")}</option>
        {ages.map((a) => (
          <option key={a} value={a}>
            {t(`${a === AGE_MAX ? `${a}+` : a} лет`, `${a === AGE_MAX ? `${a}+` : a} yosh`)}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  title,
  text,
  value,
  onChange,
}: {
  title: string;
  text: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 p-5">
      <span className="flex-1">
        <span className="block font-extrabold">{title}</span>
        <span className="block text-[0.95rem] text-muted">{text}</span>
      </span>
      <input type="checkbox" className="peer sr-only" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span
        className={cn(
          "relative mt-1 h-7 w-12 shrink-0 rounded-full transition peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30",
          value ? "bg-brand" : "bg-black/15",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left]",
            value ? "left-6" : "left-1",
          )}
        />
      </span>
    </label>
  );
}
