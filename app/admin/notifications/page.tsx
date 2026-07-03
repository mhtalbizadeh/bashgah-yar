import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsView } from "@/components/NotificationsView";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminNotificationsPage() {
  const admin = await requireRole("ADMIN");
  return (
    <div>
      <PageHeader title="اعلان‌ها" description="اعلان‌های سیستم" />
      <NotificationsView userId={admin.id} />
    </div>
  );
}
