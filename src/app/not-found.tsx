"use client";

import { ButtonLink } from "@/components/ui";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/lib/i18n";

/** Клиентский компонент: текст — на языке, выбранном на этом устройстве. */
export default function NotFound() {
  const t = useT();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <div className="text-7xl" aria-hidden>
          🤖❓
        </div>
        <h1 className="mt-4 text-3xl font-black">
          {t("Робот не нашёл такую страницу", "Robot bunday sahifani topa olmadi")}
        </h1>
        <p className="mt-2 text-lg text-muted">
          {t(
            "Может быть, в адресе ошибка? Давай вернёмся на главную и начнём с начала.",
            "Balki manzilda xato bordir? Qani, bosh sahifaga qaytib, boshidan boshlaymiz.",
          )}
        </p>
        <ButtonLink href="/" size="lg" className="mt-6">
          {t("На главную", "Bosh sahifaga")}
        </ButtonLink>
      </main>
    </>
  );
}
