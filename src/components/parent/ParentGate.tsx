"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui";
import { createPin, forgetPin, unlockWithPin, useParentGate } from "@/lib/parentGate";

/** Показывает содержимое только взрослому (после ввода PIN-кода). */
export function ParentGate({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  const gate = useParentGate();
  if (gate === "unknown") return <div className="h-40" aria-busy="true" />;
  if (gate === "unlocked") return <>{children}</>;
  return <PinForm mode={gate === "no-pin" ? "create" : "enter"} compact={compact} />;
}

function PinForm({ mode, compact }: { mode: "create" | "enter"; compact: boolean }) {
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [forgot, setForgot] = useState(false);
  const [resetWord, setResetWord] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{4}$/.test(pin)) return setError("PIN-код — это 4 цифры.");
    if (mode === "create") {
      if (pin !== pin2) return setError("PIN-коды не совпадают. Попробуйте ещё раз.");
      await createPin(pin);
    } else if (!(await unlockWithPin(pin))) {
      setPin("");
      setError("PIN-код не подошёл.");
    }
  };

  const input =
    "h-14 w-44 rounded-2xl border-2 border-line bg-white text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-brand";

  return (
    <div className={compact ? "py-6" : "mx-auto max-w-md py-10"}>
      <div className="rounded-[2rem] border border-line bg-white p-6 text-center shadow-card sm:p-8">
        <div className="text-5xl" aria-hidden>
          🔒
        </div>
        <h2 className="mt-2 text-2xl font-black">Раздел для взрослых</h2>
        <p className="mt-1 text-muted">
          {mode === "create"
            ? "Здесь ответы и наблюдения. Придумайте PIN-код из 4 цифр, чтобы ребёнок случайно не увидел ответы."
            : "Здесь ответы и наблюдения. Введите PIN-код."}
        </p>
        <form onSubmit={submit} className="mt-5 flex flex-col items-center gap-3">
          <label className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-muted">{mode === "create" ? "Новый PIN-код" : "PIN-код"}</span>
            <input
              className={input}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              autoFocus
            />
          </label>
          {mode === "create" && (
            <label className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-muted">Повторите PIN-код</span>
              <input
                className={input}
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={pin2}
                onChange={(e) => setPin2(e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
            </label>
          )}
          {error && <p className="font-bold text-rose">{error}</p>}
          <Button type="submit" size="lg" className="mt-1 w-44">
            {mode === "create" ? "Сохранить" : "Открыть"}
          </Button>
        </form>
        {mode === "enter" && (
          <div className="mt-5 text-sm">
            {!forgot ? (
              <button
                type="button"
                onClick={() => setForgot(true)}
                className="font-bold text-muted underline underline-offset-4"
              >
                Забыли PIN-код?
              </button>
            ) : (
              <div className="space-y-2 rounded-2xl bg-paper p-3 text-left">
                <p className="text-muted">
                  PIN-код хранится только на этом устройстве. Его можно сбросить — прогресс ребёнка не пропадёт. Для
                  подтверждения напишите слово <b>сбросить</b>.
                </p>
                <div className="flex gap-2">
                  <input
                    value={resetWord}
                    onChange={(e) => setResetWord(e.target.value)}
                    className="h-10 flex-1 rounded-xl border-2 border-line px-3 outline-none focus:border-brand"
                    aria-label="Слово для подтверждения"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={resetWord.trim().toLowerCase() !== "сбросить"}
                    onClick={forgetPin}
                  >
                    Сбросить
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
