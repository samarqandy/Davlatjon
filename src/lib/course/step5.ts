import { COURSE5_PART } from "@/content/chess/parts/course5";
import { useChessPart } from "@/lib/useChess";
import type { CourseStep } from "./step";

/** Ступень 5 «Ферзь». */
export const STEP_5: CourseStep = {
  n: 5,
  href: "/chess/course-5",
  final: "c5-final-test",
  piece: "wQ",
  award: { ru: "Ферзь", uz: "Farzin" },
  useContent() {
    const c = useChessPart(COURSE5_PART);
    return { info: c.course5, modules: c.course5Modules, lessons: c.course5Lessons };
  },
};
