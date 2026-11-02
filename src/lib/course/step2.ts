import { COURSE2_PART } from "@/content/chess/parts/course2";
import { useChessPart } from "@/lib/useChess";
import type { CourseStep } from "./step";

/** Ступень 2 «Конь». */
export const STEP_2: CourseStep = {
  n: 2,
  href: "/chess/course-2",
  final: "c2-final-test",
  piece: "wN",
  award: { ru: "Конь", uz: "Ot" },
  useContent() {
    const c = useChessPart(COURSE2_PART);
    return { info: c.course2, modules: c.course2Modules, lessons: c.course2Lessons };
  },
};
