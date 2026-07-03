import { Sidebar } from "@/components/layout/Sidebar";
import { coachNavItems } from "@/lib/navigation";

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar title="پنل مربی" items={coachNavItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
