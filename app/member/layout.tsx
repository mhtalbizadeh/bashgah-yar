import { Sidebar } from "@/components/layout/Sidebar";
import { memberNavItems } from "@/lib/navigation";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar title="پنل ورزشکار" items={memberNavItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
