import type { Metadata } from "next";
import { ParentChess } from "@/components/parent/ParentChess";
import { ParentGate } from "@/components/parent/ParentGate";

export const metadata: Metadata = { title: "Шахматы — для родителей" };

export default function ParentChessPage() {
  return (
    <ParentGate>
      <ParentChess />
    </ParentGate>
  );
}
