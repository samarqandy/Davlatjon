import { COURSE4_PART } from "@/content/chess/parts/course4";
import { useChessPart } from "@/lib/useChess";
import type { CourseStep } from "./step";

/** Ступень 4 «Ладья». */
export const STEP_4: CourseStep = {
  n: 4,
  href: "/chess/course-4",
  final: "c4-final-test",
  piece: "wR",
  award: { ru: "Ладья", uz: "Rux" },
  useContent() {
    const c = useChessPart(COURSE4_PART);
    return { info: c.course4, modules: c.course4Modules, lessons: c.course4Lessons };
  },
};
