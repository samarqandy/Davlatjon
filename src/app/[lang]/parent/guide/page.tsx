import type { Metadata } from "next";
import { ParentGuide } from "@/components/parent/ParentGuide";
import { guideFor } from "@/content/uz";

export const metadata: Metadata = { title: "Методичка для родителей" };

export default function GuidePage() {
  return <ParentGuide content={{ ru: guideFor("ru"), uz: guideFor("uz") }} />;
}
