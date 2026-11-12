import type { GameResult, TournamentFormat } from "@/lib/tournament/types";

type T = (ru: string, uz: string) => string;

export function formatName(format: TournamentFormat, t: T): string {
  switch (format) {
    case "roundRobin":
      return t("Круговая система", "Davra tizimi");
    case "doubleRoundRobin":
      return t("Круговая в два круга", "Ikki davrali tizim");
    case "swiss":
      return t("Швейцарская система", "Shveysariya tizimi");
    case "knockout":
      return t("Олимпийская система", "Olimpiya tizimi");
  }
}

/** Как результат пишут в таблицах: «1–0», «½–½», «+/−» — победа без игры. */
export const RESULT_TEXT: Record<GameResult, string> = {
  "1-0": "1–0",
  "1/2": "½–½",
  "0-1": "0–1",
  "+-": "+/−",
  "-+": "−/+",
};

/** Очки: «2½», «½», «3». */
export function points(x: number): string {
  const whole = Math.floor(x);
  const half = x - whole >= 0.5;
  return half ? `${whole || ""}½` : String(whole);
}

/** Дополнительный показатель: до двух знаков после запятой, без хвостовых нулей. */
export function metric(x: number | null | undefined): string {
  if (x === null || x === undefined) return "—";
  return String(Math.round(x * 100) / 100).replace(".", ",");
}

/** Название тура олимпийской системы по числу партий в нём. */
export function knockoutRoundName(games: number, t: T): string {
  if (games <= 1) return t("Финал", "Final");
  if (games === 2) return t("Полуфинал", "Yarim final");
  if (games === 4) return t("Четвертьфинал", "Chorak final");
  return t(`1/${games} финала`, `1/${games} final`);
}

export function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
