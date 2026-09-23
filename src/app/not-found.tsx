import { ButtonLink } from "@/components/ui";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <div className="text-7xl" aria-hidden>
          🤖❓
        </div>
        <h1 className="mt-4 text-3xl font-black">Робот не нашёл такую страницу</h1>
        <p className="mt-2 text-lg text-muted">
          Может быть, в адресе ошибка? Давай вернёмся на главную и начнём с начала.
        </p>
        <ButtonLink href="/" size="lg" className="mt-6">
          На главную
        </ButtonLink>
      </main>
    </>
  );
}
