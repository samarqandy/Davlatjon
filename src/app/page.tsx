import { HomeDashboard } from "@/components/home/HomeDashboard";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { WEEKS } from "@/content/program";
import { summarizeWeek } from "@/content/summary";
import { localizeWeek } from "@/content/uz";

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />
      <main className="mx-auto max-w-6xl px-4 pt-6">
        <HomeDashboard
          weeks={{
            ru: WEEKS.map(summarizeWeek),
            uz: WEEKS.map((w) => summarizeWeek(localizeWeek(w, "uz"))),
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
