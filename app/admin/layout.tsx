import { Sidebar } from "@/components/layout/Sidebar";
import { adminNavItems } from "@/lib/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar title="پنل مدیر" items={adminNavItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
