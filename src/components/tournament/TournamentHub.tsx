"use client";

import { ArrowLeft, ChevronRight, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button, Icon } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { useHydrated } from "@/lib/store";
import { isFinished } from "@/lib/tournament/engine";
import { importTournament, useTournaments } from "@/lib/tournament/store";
import { setHash, useHash } from "@/lib/useHash";
import { TournamentCreate } from "./TournamentCreate";
import { TournamentView } from "./TournamentView";
import { formatName } from "./shared";

/**
 * Турниры: жеребьёвка и таблица для турнира в классе, кружке или дома. Инструмент организатора:
 * экраны — по якорю (#new — новый турнир, #t-<id> — турнир), данные — только в этом браузере.
 */
export function TournamentHub() {
  const t = useT();
  const hydrated = useHydrated();
  const hash = useHash();
  const tournaments = useTournaments();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const id = hash.match(/^#t-([a-z0-9-]+)$/)?.[1];
  const current = id ? tournaments.find((x) => x.id === id) : undefined;
  if (hydrated && hash === "#new") return <TournamentCreate />;
  if (hydrated && current) return <TournamentView key={current.id} tournament={current} />;

  const load = async (file: File) => {
    const imported = importTournament(await file.text());
    if (imported) setHash(`#t-${imported.id}`);
    else
      setMessage(
        t(
          "Не получилось прочитать файл. Выберите файл, сохранённый кнопкой «В файл» на странице турнира.",
          "Faylni oʻqib boʻlmadi. Turnir sahifasidagi «Faylga» tugmasi bilan saqlangan faylni tanlang.",
        ),
      );
  };

  return (
    <div className="space-y-6" data-tournaments>
      <header className="space-y-1">
        <Link
          href="/chess"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
        >
          <Icon icon={ArrowLeft} /> {t("Шахматная школа", "Shaxmat maktabi")}
        </Link>
        <h1 className="text-3xl leading-tight font-black">{t("Турниры", "Turnirlar")}</h1>
        <p className="max-w-2xl text-muted">
          {t(
            "Жеребьёвка и таблица для турнира в классе, кружке или дома: круговая, швейцарская и олимпийская системы.",
            "Sinfda, toʻgarakda yoki uyda oʻtkaziladigan turnir uchun qurʼa va jadval: davra, Shveysariya va olimpiya tizimlari.",
          )}
        </p>
      </header>

      <Button size="lg" onClick={() => setHash("#new")} data-new-tournament>
        <Icon icon={Plus} /> {t("Новый турнир", "Yangi turnir")}
      </Button>

      {hydrated && id && !current && (
        <p className="font-bold text-sun-ink" role="alert">
          {t(
            "Такого турнира на этом устройстве нет: он хранится там, где его создали.",
            "Bu qurilmada bunday turnir yoʻq: u yaratilgan qurilmada saqlanadi.",
          )}
        </p>
      )}

      {hydrated && tournaments.length > 0 && (
        <section aria-labelledby="my-tournaments">
          <h2 id="my-tournaments" className="mb-2 text-xl font-black">
            {t("Мои турниры", "Turnirlarim")}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2" data-tournament-list>
            {tournaments.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => setHash(`#t-${x.id}`)}
                  className="flex min-h-16 w-full items-center gap-3 rounded-3xl bg-surface p-4 text-left shadow-card transition hover:-translate-y-0.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg leading-tight font-black break-words">{x.name}</span>
                    <span className="block text-sm font-bold text-muted">
                      {formatName(x.format, t)} ·{" "}
                      {t(
                        pluralize(x.players.length, "участник", "участника", "участников"),
                        `${x.players.length} ta ishtirokchi`,
                      )}
                      {" · "}
                      {isFinished(x)
                        ? t("завершён", "yakunlangan")
                        : t(pluralize(x.totalRounds, "тур", "тура", "туров"), `${x.totalRounds} ta tur`)}
                    </span>
                  </span>
                  <ChevronRight className="h-6 w-6 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void load(file);
            e.target.value = "";
          }}
          data-tournament-file
        />
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          <Icon icon={Upload} /> {t("Загрузить турнир из файла", "Turnirni fayldan yuklash")}
        </Button>
        {message && (
          <p className="font-bold text-sun-ink" role="alert">
            {message}
          </p>
        )}
        <p className="max-w-2xl text-sm text-muted">
          {t(
            "Турниры и имена участников хранятся только в этом браузере и никуда не отправляются. Чтобы продолжить на другом устройстве, сохраните турнир в файл и загрузите его там.",
            "Turnirlar va ishtirokchilarning ismlari faqat shu brauzerda saqlanadi va hech qayerga yuborilmaydi. Boshqa qurilmada davom ettirish uchun turnirni faylga saqlang va u yerda yuklang.",
          )}
        </p>
        <p className="max-w-2xl text-sm text-muted">
          {t(
            "Жеребьёвка идёт по правилам ФИДЕ: таблицы Бергера для круговой системы и основные правила швейцарской. Для турниров с обсчётом рейтинга ФИДЕ нужна программа из её официального списка.",
            "Qurʼa FIDE qoidalari boʻyicha oʻtkaziladi: davra tizimi uchun Berger jadvallari va Shveysariya tizimining asosiy qoidalari. FIDE reytingi hisoblanadigan turnirlar uchun uning rasmiy roʻyxatidagi dastur kerak.",
          )}
        </p>
      </section>
    </div>
  );
}
