import { ParentDashboard } from "@/components/parent/ParentDashboard";
import { ParentGate } from "@/components/parent/ParentGate";
import { WEEKS } from "@/content/program";

export default function ParentPage() {
  return (
    <ParentGate>
      <ParentDashboard weeks={WEEKS} />
    </ParentGate>
  );
}
