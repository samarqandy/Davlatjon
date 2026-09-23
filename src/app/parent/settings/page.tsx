import type { Metadata } from "next";
import { ParentGate } from "@/components/parent/ParentGate";
import { SettingsPanel } from "@/components/parent/SettingsPanel";

export const metadata: Metadata = { title: "Настройки" };

export default function SettingsPage() {
  return (
    <ParentGate>
      <SettingsPanel />
    </ParentGate>
  );
}
