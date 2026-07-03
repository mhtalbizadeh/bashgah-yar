import { FiUsers, FiClipboard, FiDollarSign } from "react-icons/fi";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { requireRole } from "@/lib/auth-guard";
import { getCoachStats } from "@/actions/stats";
import { formatDate } from "@/lib/format";

export default async function CoachDashboardPage() {
  const coach = await requireRole("COACH");
  const stats = await getCoachStats(coach.id);

  return (
    <div>
      <PageHeader title="داشبورد مربی" description={`خوش آمدید، ${coach.name}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="تعداد ورزشکاران" value={stats.memberCount} icon={FiUsers} />
        <StatCard
          label="حقوق ماه جاری"
          value={
            stats.currentSalary
              ? `${stats.currentSalary.amount.toLocaleString("fa-IR")} تومان`
              : "ثبت نشده"
          }
          icon={FiDollarSign}
          tone={stats.currentSalary?.status === "PAID" ? "success" : "warning"}
        />
        <StatCard
          label="برنامه‌های اخیر"
          value={stats.recentPrograms.length}
          icon={FiClipboard}
        />
      </div>

      <Card className="mt-6">
        <CardHeader title="آخرین برنامه‌های ثبت‌شده" />
        <CardContent className="p-0">
          {stats.recentPrograms.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">هنوز برنامه‌ای ثبت نشده.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentPrograms.map((program) => (
                <li key={program.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{program.title}</p>
                    <p className="text-sm text-slate-500">ورزشکار: {program.member.name}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatDate(program.createdAt)}
                  </span>
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
