"use client";

import { useRef, useState } from "react";
import { Button, Card, cn } from "@/components/ui";
import { AGE_MAX, AGE_MIN, profileMeta } from "@/lib/age";
import { forgetPin } from "@/lib/parentGate";
import { getState, replaceState, resetProgress, sanitize, updateSettings, useStore } from "@/lib/store";

export function SettingsPanel() {
  const settings = useStore((s) => s.settings);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `davlatjon-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Файл с прогрессом сохранён.");
  };

  const importData = async (file: File) => {
    try {
      const data = sanitize(JSON.parse(await file.text()));
      if (!window.confirm("Заменить прогресс на этом устройстве данными из файла?")) return;
      replaceState(data);
      setMessage("Прогресс загружен из файла.");
    } catch {
      setMessage("Не получилось прочитать файл. Выберите файл, сохранённый кнопкой «Сохранить в файл».");
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Настройки</h1>

      <Card className="divide-y divide-line">
        <AgeRow value={settings.age} onChange={(age) => updateSettings({ age })} />
        <Toggle
          title="Пауза перед следующей подсказкой"
          text="После каждой подсказки следующая откроется через 15 секунд — чтобы ребёнок успел подумать."
          value={settings.hintPause}
          onChange={(v) => updateSettings({ hintPause: v })}
        />
        <Toggle
          title="Крупный текст в задачах"
          text="Условия и подсказки будут крупнее — удобно на телефоне или если ребёнку так легче читать."
          value={settings.bigText}
          onChange={(v) => updateSettings({ bigText: v })}
        />
        <Toggle
          title="Открыть все уровни шахматной школы"
          text="Обычно следующий шахматный уровень открывается, когда решены все упражнения предыдущего. Включите, если ребёнок уже знает шахматы."
          value={settings.chessOpenAll === true}
          onChange={(v) => updateSettings({ chessOpenAll: v })}
        />
      </Card>

      <Card className="space-y-3 p-5">
        <h2 className="text-lg font-extrabold">💾 Прогресс</h2>
        <p className="text-[0.95rem] text-muted">
          Всё хранится только в этом браузере. Чтобы перенести прогресс на другое устройство (или сохранить копию),
          сохраните его в файл, а на другом устройстве загрузите этот файл.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}>
            ⬇️ Сохранить в файл
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            ⬆️ Загрузить из файла
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
        {message && <p className="font-bold text-brand-dark">{message}</p>}
      </Card>

      <Card className="space-y-3 p-5">
        <h2 className="text-lg font-extrabold">🔒 PIN-код</h2>
        <p className="text-[0.95rem] text-muted">
          Можно придумать новый PIN-код: текущий удалится, и при следующем входе в раздел система попросит задать новый.
        </p>
        <Button variant="secondary" onClick={forgetPin}>
          Сменить PIN-код
        </Button>
      </Card>

      <Card className="space-y-3 border-rose/30 p-5">
        <h2 className="text-lg font-extrabold text-rose">Начать заново</h2>
        <p className="text-[0.95rem] text-muted">
          Удалит решения, отметки и заметки на этом устройстве. Настройки и PIN-код останутся.
        </p>
        {!confirmReset ? (
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>
            Сбросить прогресс…
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Точно удалить весь прогресс?</span>
            <Button
              variant="secondary"
              className="border-rose text-rose"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                setMessage("Прогресс сброшен.");
              }}
            >
              Да, удалить
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Отмена
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

/** Возраст ребёнка: от него зависят советы, сложность задачи дня и открытые уровни шахмат. */
function AgeRow({ value, onChange }: { value?: number; onChange: (age: number | undefined) => void }) {
  const meta = profileMeta(value);
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);
  return (
    <div className="flex items-start gap-4 p-5">
      <span className="flex-1">
        <span className="block font-extrabold">Возраст ребёнка</span>
        <span className="block text-[0.95rem] text-muted">
          {meta.name} профиль ({meta.ages}). {meta.about}
        </span>
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        aria-label="Возраст ребёнка"
        className="mt-1 min-h-11 shrink-0 rounded-xl border-2 border-line bg-white px-3 font-bold"
      >
        <option value="">не указан</option>
        {ages.map((a) => (
          <option key={a} value={a}>
            {a === AGE_MAX ? `${a}+` : a} лет
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
