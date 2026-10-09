import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { authConfig, weeklyReportsAvailable } from "@/lib/server/config";
import { neonStore } from "@/lib/server/progressStore";
import { sendWeeklyReports } from "@/lib/server/weeklyReports";

const noStore = { "Cache-Control": "no-store" };

function authorized(request: NextRequest, secret: string): boolean {
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Vercel Cron раз в неделю: разослать итоги тем, кто их включил. Закрыто секретом CRON_SECRET. */
export async function GET(request: NextRequest) {
  const cfg = authConfig();
  if (!weeklyReportsAvailable(cfg) || !cfg.cronSecret || !cfg.telegram || !cfg.storage)
    return Response.json({ error: "off" }, { status: 404, headers: noStore });
  if (!authorized(request, cfg.cronSecret))
    return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  try {
    const run = await sendWeeklyReports({ store: neonStore(cfg.storage.databaseUrl), botToken: cfg.telegram.botToken });
    return Response.json(run, { headers: noStore });
  } catch (error) {
    console.error("weekly reports:", String(error).replace(/postgres(ql)?:\/\/\S+/g, "postgresql://***"));
    return Response.json({ error: "storage" }, { status: 502, headers: noStore });
  }
}
