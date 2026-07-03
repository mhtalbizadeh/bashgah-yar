import { FiCalendar, FiCreditCard } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireRole } from "@/lib/auth-guard";
import { getMySubscription } from "@/actions/subscriptions";
import { formatDate, formatToman } from "@/lib/format";

export default async function MemberSubscriptionPage() {
  const member = await requireRole("MEMBER");
  const subscription = await getMySubscription(member.id);

  const isActive =
    subscription?.status === "ACTIVE" &&
    new Date(subscription.endDate) > new Date();

  return (
    <div>
      <PageHeader title="اشتراک من" description="وضعیت اشتراک شما در باشگاه" />

      {!subscription ? (
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">
              شما هنوز اشتراکی ثبت نکرده‌اید. برای ثبت اشتراک با پذیرش باشگاه تماس بگیرید.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader
            title={subscription.plan.name}
            description={formatToman(subscription.plan.price)}
            action={
              <Badge tone={isActive ? "success" : "danger"}>
                {isActive ? "فعال" : "منقضی شده"}
              </Badge>
            }
          />
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <FiCalendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">تاریخ شروع</p>
                <p className="text-sm font-medium text-slate-800">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCreditCard className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">تاریخ پایان</p>
                <p className="text-sm font-medium text-slate-800">
                  {formatDate(subscription.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
