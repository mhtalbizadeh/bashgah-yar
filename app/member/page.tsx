import { FiCreditCard, FiClipboard, FiShoppingCart } from "react-icons/fi";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { requireRole } from "@/lib/auth-guard";
import { getMemberStats } from "@/actions/stats";
import { formatDate } from "@/lib/format";

const orderStatusLabel: Record<string, string> = {
  PENDING: "در انتظار",
  READY: "آماده تحویل",
  DELIVERED: "تحویل شده",
};

export default async function MemberDashboardPage() {
  const member = await requireRole("MEMBER");
  const stats = await getMemberStats(member.id);

  const subscriptionActive =
    stats.subscription?.status === "ACTIVE" &&
    new Date(stats.subscription.endDate) > new Date();

  return (
    <div>
      <PageHeader title="داشبورد ورزشکار" description={`خوش آمدید، ${member.name}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="وضعیت اشتراک"
          value={
            stats.subscription
              ? subscriptionActive
                ? "فعال"
                : "غیرفعال"
              : "بدون اشتراک"
          }
          icon={FiCreditCard}
          tone={subscriptionActive ? "success" : "danger"}
        />
        <StatCard
          label="برنامه تمرینی"
          value={stats.latestProgram ? stats.latestProgram.title : "ثبت نشده"}
          icon={FiClipboard}
        />
        <StatCard
          label="سفارش‌های اخیر"
          value={stats.recentOrders.length}
          icon={FiShoppingCart}
          tone="warning"
        />
      </div>

      {stats.subscription && (
        <Card className="mt-6">
          <CardHeader title="اشتراک من" />
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">پلن: {stats.subscription.plan.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                پایان اشتراک: {formatDate(stats.subscription.endDate)}
              </p>
            </div>
            <Badge tone={subscriptionActive ? "success" : "danger"}>
              {subscriptionActive ? "فعال" : "منقضی شده"}
            </Badge>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader title="سفارش‌های اخیر" />
        <CardContent className="p-0">
          {stats.recentOrders.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">سفارشی ثبت نشده است.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between px-4 py-3">
                  <p className="text-sm font-medium text-slate-800">{order.product.name}</p>
                  <Badge tone="neutral">{orderStatusLabel[order.status]}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader title="اعلان‌ها" />
        <CardContent className="p-0">
          {stats.recentNotifications.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">اعلانی وجود ندارد.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentNotifications.map((notification) => (
                <li key={notification.id} className="flex items-center gap-3 px-4 py-3">
                  {!notification.isRead && <Badge tone="primary">جدید</Badge>}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                    <p className="text-sm text-slate-500">{notification.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
