import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ParentNav } from "@/components/parent/ParentNav";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { WEEKS } from "@/content/program";

export const metadata: Metadata = { title: "Для родителей" };

export default function ParentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteHeader active="parent" />
      <main className="mx-auto max-w-6xl px-4 pt-6">
        <ParentNav weeks={WEEKS.map((w) => ({ number: w.number, dayIds: w.days.map((d) => d.id) }))} />
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
