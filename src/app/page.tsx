import { HomeDashboard } from "@/components/home/HomeDashboard";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { WEEKS } from "@/content/program";
import { summarizeWeek } from "@/content/summary";

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />
      <main className="mx-auto max-w-6xl px-4 pt-6">
        <HomeDashboard weeks={WEEKS.map(summarizeWeek)} />
      </main>
      <SiteFooter />
    </>
  );
}
