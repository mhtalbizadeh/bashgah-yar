import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsView } from "@/components/NotificationsView";
import { requireRole } from "@/lib/auth-guard";

export default async function MemberNotificationsPage() {
  const member = await requireRole("MEMBER");
  return (
    <div>
      <PageHeader title="اعلان‌ها" description="اعلان‌های مربوط به شما" />
      <NotificationsView userId={member.id} />
    </div>
  );
}
