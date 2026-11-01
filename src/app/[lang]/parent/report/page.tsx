import type { Metadata } from "next";
import { ParentGate } from "@/components/parent/ParentGate";
import { ParentReport } from "@/components/parent/ParentReport";

export const metadata: Metadata = { title: "Итоги недели — для родителей" };

export default function ParentReportPage() {
  return (
    <ParentGate>
      <ParentReport />
    </ParentGate>
  );
}
