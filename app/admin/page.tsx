import {
  FiUsers,
  FiUserCheck,
  FiCreditCard,
  FiDollarSign,
  FiShoppingCart,
  FiTool,
} from "react-icons/fi";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationIcon } from "@/components/ui/NotificationIcon";
import { getAdminStats } from "@/actions/stats";
import { getEquipmentStatusOverview, getRevenueGrowthAnalytics } from "@/actions/analytics";
import { formatDateTime } from "@/lib/format";
import { RevenueGrowthChart } from "@/components/charts/RevenueGrowthChart";
import { EquipmentStatusPanel } from "@/components/dashboard/EquipmentStatusPanel";

export default async function AdminDashboardPage() {
  const [stats, revenueGrowth, equipment] = await Promise.all([
    getAdminStats(),
    getRevenueGrowthAnalytics(6),
    getEquipmentStatusOverview(),
  ]);

  return (
    <div>
      <PageHeader
        title="داشبورد مدیر"
        description="خلاصه‌ای از وضعیت کلی باشگاه"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="تعداد اعضا" value={stats.memberCount} icon={FiUsers} />
        <StatCard
          label="تعداد مربیان"
          value={stats.coachCount}
          icon={FiUserCheck}
          tone="success"
        />
        <StatCard
          label="اعضای دارای اشتراک فعال"
          value={stats.activeSubscriptionCount}
          icon={FiCreditCard}
        />
        <StatCard
          label="درآمد ماه جاری"
          value={`${stats.monthlyIncome.toLocaleString("fa-IR")} تومان`}
          icon={FiDollarSign}
          tone="success"
        />
        <StatCard
          label="تعداد سفارش‌ها"
          value={stats.orderCount}
          icon={FiShoppingCart}
          tone="warning"
        />
        <StatCard
          label="تعداد تجهیزات"
          value={stats.equipmentCount}
          icon={FiTool}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueGrowthChart initial={revenueGrowth} />
        </div>
        <EquipmentStatusPanel equipment={equipment} />
      </div>

      <Card className="mt-6">
        <CardHeader title="اعلان‌های مهم" />
        <CardContent className="p-0">
          {stats.recentNotifications.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">اعلانی وجود ندارد.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <NotificationIcon type={notification.type} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {notification.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatDateTime(notification.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
