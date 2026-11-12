import type { TournamentFormat } from "@/lib/tournament/types";

export { knockoutRoundName, points, RESULT_TEXT } from "@/lib/tournament/format";

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

/** Дополнительный показатель: до двух знаков после запятой, без хвостовых нулей. */
export function metric(x: number | null | undefined): string {
  if (x === null || x === undefined) return "—";
  return String(Math.round(x * 100) / 100).replace(".", ",");
}

export function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
