import Link from "next/link";
import { LogoMark } from "./Logo";

export function SiteHeader({ active }: { active?: "home" | "chess" | "problems" | "parent" }) {
  const link = (href: string, emoji: string, label: string, key: typeof active) => (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:px-3 sm:text-base ${
        active === key ? "bg-brand-soft text-brand-dark" : "text-muted hover:bg-black/5 hover:text-ink"
      }`}
    >
      <span aria-hidden className="text-lg leading-none sm:text-base">
        {emoji}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5">
        <Link
          href="/"
          className="mr-auto flex items-center gap-2.5 rounded-xl pr-2"
          aria-label="Лаборатория Давлатжона — на главную"
        >
          <LogoMark size={40} />
          <span className="leading-tight">
            <span className="block text-[15px] font-black sm:text-lg">Лаборатория Давлатжона</span>
            <span className="hidden text-xs font-bold text-muted sm:block">математика · логика · алгоритмы</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Разделы">
          {link("/chess", "♞", "Шахматы", "chess")}
          {link("/my-problems", "✍️", "Мои задачи", "problems")}
          {link("/parent", "🔒", "Родителям", "parent")}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold">Любопытство → Мышление → Рассуждение → Открытие → Уверенность</p>
        <p>Прогресс хранится только в этом браузере.</p>
      </div>
    </footer>
  );
}
