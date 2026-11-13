import type { Metadata } from "next";
import { Glossary } from "@/components/chess/Glossary";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { chessGlossary } from "@/content/chess/glossary";

export const metadata: Metadata = { title: "Словарь шахматиста" };

/** Термины собраны на сервере на двух языках: уроки и позиции в скрипты страницы не попадают. */
const ENTRIES = { ru: chessGlossary("ru"), uz: chessGlossary("uz") };

export default function GlossaryPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-4 pt-6 pb-16">
        <Glossary entries={ENTRIES} />
      </main>
      <SiteFooter />
    </>
  );
}
