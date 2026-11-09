import { NextResponse, type NextRequest } from "next/server";

const LANGS = new Set(["ru", "uz"]);
const YEAR = 60 * 60 * 24 * 365;

/**
 * Язык страницы — до её отрисовки. Каждая страница собрана дважды (app/[lang]/…), а адреса остаются
 * прежними: /chess у ребёнка с узбекским языком молча отдаётся из /uz/chess, поэтому узбекский текст
 * приходит сразу, без пустого экрана до загрузки скриптов.
 *
 * Язык хранит кука `lang` — её пишет LangSync, когда язык выбран на устройстве.
 * Ссылка вида /uz/chess (например, из рассылки) ставит язык и ведёт на обычный адрес /chess.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (LANGS.has(first)) {
    const rest = pathname.slice(first.length + 1) || "/";
    const res = NextResponse.redirect(new URL(rest + search, request.url));
    res.cookies.set("lang", first, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }
  const lang = request.cookies.get("lang")?.value === "uz" ? "uz" : "ru";
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Страницы — да; API, сборка, файлы из public/ и всё с точкой в адресе (иконки, sw.js, robots.txt) — мимо.
  matcher: ["/((?!api/|_next/|_vercel/|vendor/|audio/|animations/|images/|puzzles/|.*\\.).*)"],
};
