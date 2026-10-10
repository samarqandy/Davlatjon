"use client";

import { useEffect, useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { api, errorText, usePoll } from "@/lib/onlineClient";
import { MAX_MESSAGE } from "@/lib/online";

interface Msg {
  id: number;
  mine: boolean;
  text: string;
  at: number;
}

/** Переписка с другом: короткие сообщения без ссылок и номеров. Новые приходят сами раз в несколько секунд. */
export function FriendChat({ friend, className }: { friend: string; className?: string }) {
  const t = useT();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [all, setAll] = useState<Msg[]>([]);
  const lastId = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  const { data, reload } = usePoll<{ messages: Msg[] } | { error: string }>(async () => {
    const res = await api<{ messages: Msg[] }>(
      `/api/play/messages?friend=${encodeURIComponent(friend)}&after=${lastId.current}`,
    );
    if (!res.ok) return { error: res.data.error ?? "network" };
    return { messages: res.data.messages };
  }, 3000);

  useEffect(() => {
    if (!data || !("messages" in data) || !data.messages.length) return;
    const fresh = data.messages;
    lastId.current = Math.max(lastId.current, ...fresh.map((m) => m.id));
    // Ответ пришёл из сети; в состояние кладём уже после него, а не при отрисовке.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAll((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      return [...prev, ...fresh.filter((m) => !seen.has(m.id))].slice(-100);
    });
  }, [data]);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [all.length]);

  const blocked = data && "error" in data ? data.error : null;

  const send = async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError(null);
    const res = await api("/api/play/messages", { friend, text: body });
    setSending(false);
    if (!res.ok) {
      setError(errorText(res.data.error, t));
      return;
    }
    setText("");
    reload();
  };

  return (
    <section className={cn("flex flex-col rounded-3xl bg-white p-4 shadow-card", className)} data-chat={friend}>
      <h3 className="text-lg font-black">💬 {friend}</h3>
      <div
        ref={box}
        className="mt-2 h-56 space-y-1.5 overflow-y-auto rounded-2xl bg-brand-soft/40 p-2"
        aria-live="polite"
      >
        {all.length === 0 && (
          <p className="p-2 text-sm text-muted">
            {blocked ? errorText(blocked, t) : t("Пока пусто. Поздоровайся!", "Hozircha boʻsh. Salom ber!")}
          </p>
        )}
        {all.map((m) => (
          <p
            key={m.id}
            className={cn(
              "max-w-[85%] rounded-2xl px-3 py-1.5 text-sm break-words",
              m.mine ? "ml-auto bg-brand text-white" : "bg-white text-ink shadow-card",
            )}
          >
            {m.text}
          </p>
        ))}
      </div>
      {error && (
        <p className="mt-2 rounded-xl bg-rose/10 px-3 py-1.5 text-sm font-bold text-[#b42318]" role="alert">
          {error}
        </p>
      )}
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          value={text}
          maxLength={MAX_MESSAGE}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("Написать другу…", "Doʻstga yozish…")}
          aria-label={t("Сообщение", "Xabar")}
          className="min-h-11 min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-3 text-base outline-none focus:border-brand"
          autoComplete="off"
        />
        <Button type="submit" disabled={sending || !text.trim() || !!blocked}>
          {t("Отправить", "Yuborish")}
        </Button>
      </form>
      <p className="mt-1.5 text-xs text-muted">
        {t(
          "Здесь можно писать только друзьям. Ссылки, номера телефонов и грубые слова не отправляются.",
          "Bu yerda faqat doʻstlarga yoziladi. Havola, telefon raqami va qoʻpol soʻzlar yuborilmaydi.",
        )}
      </p>
    </section>
  );
}
