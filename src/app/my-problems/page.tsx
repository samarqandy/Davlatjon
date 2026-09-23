import type { Metadata } from "next";
import { MyProblems } from "@/components/MyProblems";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Мои задачи" };

export default function MyProblemsPage() {
  return (
    <>
      <SiteHeader active="problems" />
      <main className="mx-auto max-w-6xl px-4 pt-6">
        <MyProblems />
      </main>
      <SiteFooter />
    </>
  );
}
