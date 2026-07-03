import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsView } from "@/components/NotificationsView";
import { requireRole } from "@/lib/auth-guard";

export default async function CoachNotificationsPage() {
  const coach = await requireRole("COACH");
  return (
    <div>
      <PageHeader title="اعلان‌ها" description="اعلان‌های مربوط به شما" />
      <NotificationsView userId={coach.id} />
    </div>
  );
}
