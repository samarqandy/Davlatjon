import { COURSE_PART } from "@/content/chess/parts/course";
import { useChessPart } from "@/lib/useChess";
import type { CourseStep } from "./step";

/** Ступень 1 «Пешка». */
export const STEP_1: CourseStep = {
  n: 1,
  href: "/chess/course",
  final: "c1-final-test",
  piece: "wP",
  award: { ru: "Пешка", uz: "Piyoda" },
  useContent() {
    const c = useChessPart(COURSE_PART);
    return { info: c.course1, modules: c.course1Modules, lessons: c.course1Lessons };
  },
};
