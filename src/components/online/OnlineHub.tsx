"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccountPanel } from "@/components/AccountPanel";
import { Button, cn } from "@/components/ui";
import { loginAvailable, useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import { TIME_CONTROLS, timeControlLabel, type GameView } from "@/lib/online";
import { api, errorText, usePoll } from "@/lib/onlineClient";
import { FriendChat } from "./FriendChat";

interface Profile {
  username: string;
  onlineOk: boolean;
  chatOk: boolean;
  findable: boolean;
}
interface Friend {
  username: string;
  online: boolean;
  chatOk: boolean;
  unread: number;
}
interface Hit {
  username: string;
  relation: "none" | "friend" | "incoming" | "outgoing";
}
interface Dash {
  friends: Friend[];
  incoming: { username: string }[];
  outgoing: { username: string }[];
  games: GameView[];
}

const card = "rounded-3xl bg-white p-5 shadow-card";
const chip = (on: boolean) =>
  cn(
    "min-h-9 rounded-xl border-2 px-3 py-1 text-sm font-bold transition",
    on ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-white hover:border-brand/40",
  );

/** Игра по сети: вход, имя, друзья и партии. */
export function OnlineHub() {
  const t = useT();
  const account = useAccount();

  if (account.status === "loading")
    return <p className="text-muted">{t("Проверяем вход…", "Kirish tekshirilmoqda…")}</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header>
        <h1 className="text-3xl font-black">👥 {t("Играть с друзьями", "Doʻstlar bilan oʻynash")}</h1>
        <p className="mt-1 text-muted">
          {t(
            "Найди друга по имени, подружитесь и играйте партии по сети — как на больших шахматных сайтах.",
            "Doʻstingni ismi bilan top, doʻst boʻling va katta shaxmat saytlaridagidek tarmoq orqali oʻynang.",
          )}
        </p>
      </header>
      {!loginAvailable(account) ? (
        <p className={cn(card, "text-muted")}>
          {t(
            "Игра по сети появится, когда на сайте будет подключён вход через Google или Telegram.",
            "Onlayn oʻyin saytda Google yoki Telegram orqali kirish ulangach paydo boʻladi.",
          )}
        </p>
      ) : !account.user ? (
        <section className={card}>
          <p className="mb-3 font-bold">
            {t(
              "Чтобы играть по сети, нужен вход. Войдёт родитель — один раз на этом устройстве.",
              "Onlayn oʻynash uchun kirish kerak. Ota-ona bir marta shu qurilmada kiradi.",
            )}
          </p>
          <AccountPanel back="/chess/online" />
        </section>
      ) : (
        <Signed />
      )}
    </div>
  );
}

function Signed() {
  const t = useT();
  const { data, reload } = usePoll<{ profile: Profile | null }>(async () => {
    const res = await api<{ profile: Profile | null }>("/api/play/me");
    return res.ok ? { profile: res.data.profile } : null;
  }, 30_000);
  if (!data) return <p className="text-muted">{t("Загружаем…", "Yuklanmoqda…")}</p>;
  if (!data.profile) return <UsernameForm onDone={reload} />;
  return <Dashboard profile={data.profile} onRename={reload} />;
}

function UsernameForm({ onDone, current }: { onDone: () => void; current?: string }) {
  const t = useT();
  const [name, setName] = useState(current ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    setError(null);
    const res = await api("/api/play/me", { username: name });
    setBusy(false);
    if (!res.ok) return setError(errorText(res.data.error, t));
    onDone();
  };
  return (
    <form
      className={card}
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <h2 className="text-xl font-black">{t("Выбери своё имя в игре", "Oʻyindagi ismingni tanla")}</h2>
      <p className="mt-1 text-sm text-muted">
        {t(
          "Друзья будут искать тебя по этому имени. Настоящее имя и фамилию не пиши: достаточно придумать, например, chess_tiger.",
          "Doʻstlaring seni shu ism bilan qidiradi. Haqiqiy ism-familiyani yozma: masalan, chess_tiger deb oʻylab top.",
        )}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={16}
          placeholder="chess_tiger"
          aria-label={t("Имя в игре", "Oʻyindagi ism")}
          className="min-h-11 min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-3 font-mono text-base outline-none focus:border-brand"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          data-username-input
        />
        <Button type="submit" disabled={busy || name.trim().length < 3}>
          {t("Сохранить", "Saqlash")}
        </Button>
      </div>
      {error && (
        <p className="mt-2 rounded-xl bg-rose/10 px-3 py-1.5 text-sm font-bold text-[#b42318]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function Dashboard({ profile, onRename }: { profile: Profile; onRename: () => void }) {
  const t = useT();
  const router = useRouter();
  const [renaming, setRenaming] = useState(false);
  const [chatWith, setChatWith] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { data, reload } = usePoll<Dash>(async () => {
    const [f, g] = await Promise.all([
      api<Omit<Dash, "games">>("/api/play/friends"),
      api<{ games: GameView[] }>("/api/play/games"),
    ]);
    if (!f.ok || !g.ok) return null;
    return { friends: f.data.friends, incoming: f.data.incoming, outgoing: f.data.outgoing, games: g.data.games };
  }, 4000);

  const friendAction = async (action: string, username: string) => {
    setNotice(null);
    const res = await api("/api/play/friends", { action, username });
    if (!res.ok) setNotice(errorText(res.data.error, t));
    reload();
  };

  const respondGame = async (id: string, action: "accept" | "decline") => {
    const res = await api("/api/play/game", { id, action });
    if (!res.ok) setNotice(errorText(res.data.error, t));
    else if (action === "accept") router.push(`/chess/online/${id}`);
    reload();
  };

  const games = data?.games ?? [];
  const invitesForMe = games.filter((g) => g.status === "invited" && g.invitedBy !== g.you);
  const ongoing = games.filter((g) => g.status === "active" || (g.status === "invited" && g.invitedBy === g.you));
  const finished = games.filter((g) => g.status === "finished");
  const opponent = (g: GameView) => (g.you === "w" ? g.black : g.white);

  return (
    <div className="space-y-4">
      <section className={cn(card, "flex flex-wrap items-center gap-3")}>
        <div className="mr-auto">
          <p className="text-sm font-bold text-muted">{t("Твоё имя в игре", "Oʻyindagi isming")}</p>
          <p className="font-mono text-2xl font-black" data-my-username>
            {profile.username}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setRenaming((r) => !r)}>
          {t("Сменить имя", "Ismni oʻzgartirish")}
        </Button>
      </section>
      {renaming && (
        <UsernameForm
          current={profile.username}
          onDone={() => {
            setRenaming(false);
            onRename();
          }}
        />
      )}
      {!profile.onlineOk && (
        <p className="rounded-2xl bg-sun-soft px-4 py-3 text-sm font-bold" role="status">
          {t(
            "Игра по сети выключена родителем: вызвать друга на партию нельзя. Родитель включает её в разделе «Родителям» → «Настройки».",
            "Onlayn oʻyin ota-ona tomonidan oʻchirilgan: doʻstni partiyaga chaqirib boʻlmaydi. Ota-ona uni «Ota-onalar» → «Sozlamalar» boʻlimida yoqadi.",
          )}
        </p>
      )}
      {notice && (
        <p className="rounded-2xl bg-rose/10 px-4 py-2 text-sm font-bold text-[#b42318]" role="alert">
          {notice}
        </p>
      )}

      {invitesForMe.length > 0 && (
        <section className={card} aria-labelledby="invites" data-invites>
          <h2 id="invites" className="text-xl font-black">
            ⚔️ {t("Тебя зовут играть", "Seni oʻynashga chaqirishyapti")}
          </h2>
          <ul className="mt-3 space-y-2">
            {invitesForMe.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-brand-soft/50 p-3">
                <span className="mr-auto font-bold">
                  <span className="font-mono">{opponent(g)}</span> ·{" "}
                  {t(
                    g.you === "w" ? "ты белыми" : "ты чёрными",
                    g.you === "w" ? "sen oqlar bilan" : "sen qoralar bilan",
                  )}{" "}
                  · ⏱ {timeControlLabel(g)}
                </span>
                <Button size="sm" onClick={() => void respondGame(g.id, "accept")}>
                  {t("Принять", "Qabul qilish")}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => void respondGame(g.id, "decline")}>
                  {t("Отказаться", "Rad etish")}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ongoing.length > 0 && (
        <section className={card} aria-labelledby="ongoing" data-ongoing>
          <h2 id="ongoing" className="text-xl font-black">
            ♟ {t("Партии", "Partiyalar")}
          </h2>
          <ul className="mt-3 space-y-2">
            {ongoing.map((g) => {
              const mine = g.status === "active" && g.turn === g.you;
              return (
                <li key={g.id}>
                  <Link
                    href={`/chess/online/${g.id}`}
                    className={cn(
                      "flex flex-wrap items-center gap-2 rounded-2xl border-2 p-3 hover:border-brand/40",
                      mine ? "border-brand bg-brand-soft/50" : "border-line",
                    )}
                  >
                    <span className="mr-auto font-bold">
                      <span className="font-mono">{opponent(g)}</span> · ⏱ {timeControlLabel(g)}
                    </span>
                    <span className="text-sm font-extrabold">
                      {g.status === "invited"
                        ? t("ждём ответа", "javob kutilmoqda")
                        : mine
                          ? t("твой ход", "navbat senda")
                          : t("ход соперника", "raqib yuradi")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className={card} aria-labelledby="friends" data-friends>
        <h2 id="friends" className="text-xl font-black">
          🤝 {t("Друзья", "Doʻstlar")}
        </h2>
        {data && data.friends.length === 0 && (
          <p className="mt-2 text-sm text-muted">
            {t("Пока нет друзей. Найди друга по имени ниже.", "Hozircha doʻst yoʻq. Pastda doʻstingni ismi bilan top.")}
          </p>
        )}
        <ul className="mt-3 space-y-2">
          {data?.friends.map((f) => (
            <li key={f.username} className="rounded-2xl border-2 border-line p-3" data-friend={f.username}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn("size-3 rounded-full", f.online ? "bg-mint" : "bg-line")}
                  title={f.online ? t("в сети", "onlayn") : t("не в сети", "oflayn")}
                  aria-label={f.online ? t("в сети", "onlayn") : t("не в сети", "oflayn")}
                />
                <span className="mr-auto font-mono font-black">{f.username}</span>
                <Button
                  size="sm"
                  disabled={!profile.onlineOk}
                  onClick={() => setChallenge(challenge === f.username ? null : f.username)}
                >
                  ⚔️ {t("Играть", "Oʻynash")}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!profile.chatOk || !f.chatOk}
                  onClick={() => setChatWith(chatWith === f.username ? null : f.username)}
                >
                  💬{" "}
                  {f.unread > 0 && <span className="rounded-full bg-rose px-1.5 text-xs text-white">{f.unread}</span>}
                  {t("Написать", "Yozish")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => void friendAction("remove", f.username)}
                  aria-label={t("Убрать из друзей", "Doʻstlikdan chiqarish")}
                >
                  ✕
                </Button>
              </div>
              {challenge === f.username && (
                <ChallengeForm
                  friend={f.username}
                  onError={setNotice}
                  onCreated={(id) => router.push(`/chess/online/${id}`)}
                />
              )}
              {chatWith === f.username && (
                <FriendChat friend={f.username} className="mt-3 !shadow-none ring-1 ring-line" />
              )}
            </li>
          ))}
        </ul>
        {data && data.incoming.length > 0 && (
          <div className="mt-4" data-requests>
            <h3 className="font-black">{t("Хотят дружить", "Doʻst boʻlmoqchi")}</h3>
            <ul className="mt-2 space-y-2">
              {data.incoming.map((u) => (
                <li key={u.username} className="flex flex-wrap items-center gap-2 rounded-2xl bg-sun-soft/60 p-3">
                  <span className="mr-auto font-mono font-bold">{u.username}</span>
                  <Button size="sm" variant="success" onClick={() => void friendAction("accept", u.username)}>
                    {t("Принять", "Qabul qilish")}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => void friendAction("decline", u.username)}>
                    {t("Отклонить", "Rad etish")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => void friendAction("block", u.username)}>
                    🚫 {t("Заблокировать", "Bloklash")}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data && data.outgoing.length > 0 && (
          <p className="mt-3 text-sm text-muted">
            {t("Ждут ответа: ", "Javob kutilmoqda: ")}
            {data.outgoing.map((u) => u.username).join(", ")}
          </p>
        )}
      </section>

      <FindFriend onChanged={reload} />

      {finished.length > 0 && (
        <section className={card} aria-labelledby="recent">
          <h2 id="recent" className="text-xl font-black">
            🏁 {t("Недавние партии", "Soʻnggi partiyalar")}
          </h2>
          <ul className="mt-3 space-y-2">
            {finished.map((g) => {
              const won = g.result === "1/2-1/2" ? null : (g.result === "1-0") === (g.you === "w");
              return (
                <li key={g.id}>
                  <Link
                    href={`/chess/online/${g.id}`}
                    className="flex items-center gap-2 rounded-2xl border-2 border-line p-3 hover:border-brand/40"
                  >
                    <span className="mr-auto font-mono font-bold">{opponent(g)}</span>
                    <span className="text-sm font-extrabold">
                      {won === null
                        ? `🤝 ${t("ничья", "durang")}`
                        : won
                          ? `🏆 ${t("победа", "gʻalaba")}`
                          : t("поражение", "magʻlubiyat")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function ChallengeForm({
  friend,
  onCreated,
  onError,
}: {
  friend: string;
  onCreated: (id: string) => void;
  onError: (message: string) => void;
}) {
  const t = useT();
  const [color, setColor] = useState<"w" | "b" | "random">("random");
  const [tc, setTc] = useState("10+0");
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    const res = await api<{ game: GameView }>("/api/play/games", { friend, color, tc });
    setBusy(false);
    if (!res.ok) return onError(errorText(res.data.error, t));
    onCreated(res.data.game.id);
  };
  return (
    <div className="mt-3 rounded-2xl bg-brand-soft/40 p-3" data-challenge>
      <p className="text-sm font-black">{t("За кого играешь?", "Kim bilan oʻynaysan?")}</p>
      <div className="mt-1 flex flex-wrap gap-1.5" role="group">
        {(
          [
            ["w", t("белыми", "oqlar bilan")],
            ["b", t("чёрными", "qoralar bilan")],
            ["random", t("как выпадет", "qurʼa bilan")],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={chip(color === id)} onClick={() => setColor(id)}>
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm font-black">
        {t("Время на партию (минуты + добавка)", "Partiya vaqti (daqiqa + qoʻshimcha)")}
      </p>
      <div className="mt-1 flex flex-wrap gap-1.5" role="group">
        {TIME_CONTROLS.map((c) => (
          <button key={c.id} type="button" className={chip(tc === c.id)} onClick={() => setTc(c.id)}>
            {c.baseS ? timeControlLabel(c) : t("без часов", "soatsiz")}
          </button>
        ))}
      </div>
      <Button className="mt-3" onClick={() => void go()} disabled={busy}>
        {t("Позвать на партию", "Partiyaga chaqirish")}
      </Button>
    </div>
  );
}

function FindFriend({ onChanged }: { onChanged: () => void }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);

  const search = async () => {
    setError(null);
    setHits(null);
    const res = await api<{ users: Hit[] }>(`/api/play/search?q=${encodeURIComponent(q.trim())}`);
    if (!res.ok) return setError(errorText(res.data.error, t));
    setHits(res.data.users);
  };
  const add = async (username: string) => {
    const res = await api("/api/play/friends", { action: "request", username });
    if (!res.ok) return setError(errorText(res.data.error, t));
    setSent((s) => [...s, username]);
    onChanged();
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="find" data-find>
      <h2 id="find" className="text-xl font-black">
        🔎 {t("Найти друга", "Doʻst qidirish")}
      </h2>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void search();
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("Имя друга в игре", "Doʻstning oʻyindagi ismi")}
          aria-label={t("Имя друга", "Doʻst ismi")}
          className="min-h-11 min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-3 font-mono text-base outline-none focus:border-brand"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          data-find-input
        />
        <Button type="submit" disabled={q.trim().length < 3}>
          {t("Искать", "Qidirish")}
        </Button>
      </form>
      {error && (
        <p className="mt-2 rounded-xl bg-rose/10 px-3 py-1.5 text-sm font-bold text-[#b42318]" role="alert">
          {error}
        </p>
      )}
      {hits && hits.length === 0 && (
        <p className="mt-2 text-sm text-muted">{t("Никого не нашлось.", "Hech kim topilmadi.")}</p>
      )}
      {hits && hits.length > 0 && (
        <ul className="mt-3 space-y-2" data-hits>
          {hits.map((h) => (
            <li key={h.username} className="flex items-center gap-2 rounded-2xl border-2 border-line p-3">
              <span className="mr-auto font-mono font-bold">{h.username}</span>
              {h.relation === "friend" ? (
                <span className="text-sm font-bold text-muted">{t("уже друг", "allaqachon doʻst")}</span>
              ) : h.relation === "outgoing" || sent.includes(h.username) ? (
                <span className="text-sm font-bold text-muted">{t("просьба отправлена", "soʻrov yuborildi")}</span>
              ) : (
                <Button size="sm" onClick={() => void add(h.username)}>
                  {h.relation === "incoming"
                    ? t("Принять дружбу", "Doʻstlikni qabul qilish")
                    : t("Подружиться", "Doʻst boʻlish")}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
