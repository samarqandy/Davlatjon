import { COURSE3_PART } from "@/content/chess/parts/course3";
import { useChessPart } from "@/lib/useChess";
import type { CourseStep } from "./step";

/** Ступень 3 «Слон». */
export const STEP_3: CourseStep = {
  n: 3,
  href: "/chess/course-3",
  final: "c3-final-test",
  piece: "wB",
  award: { ru: "Слон", uz: "Fil" },
  useContent() {
    const c = useChessPart(COURSE3_PART);
    return { info: c.course3, modules: c.course3Modules, lessons: c.course3Lessons };
  },
};
