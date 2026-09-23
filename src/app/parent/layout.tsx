import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ParentNav } from "@/components/parent/ParentNav";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Для родителей" };

export default function ParentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteHeader active="parent" />
      <main className="mx-auto max-w-6xl px-4 pt-6">
        <ParentNav />
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
