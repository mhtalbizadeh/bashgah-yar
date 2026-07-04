import { FiBell } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActionButton } from "@/components/ui/ActionButton";
import { NotificationIcon } from "@/components/ui/NotificationIcon";
import { MarkAllReadButton } from "@/components/forms/MarkAllReadButton";
import { getMyNotifications, markAsRead } from "@/actions/notifications";
import { formatDateTime } from "@/lib/format";

export async function NotificationsView({ userId }: { userId: string }) {
  const notifications = await getMyNotifications(userId);
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <Card>
      {hasUnread && (
        <div className="flex justify-end border-b border-slate-200 p-4">
          <MarkAllReadButton />
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 p-10 text-center text-slate-400">
          <FiBell className="h-8 w-8" />
          <p className="text-sm">اعلانی وجود ندارد.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-start gap-3">
                <NotificationIcon type={notification.type} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                    {!notification.isRead && <Badge tone="primary">جدید</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
              </div>
              {!notification.isRead && (
                <ActionButton
                  label="علامت‌گذاری به عنوان خوانده‌شده"
                  pendingLabel="در حال ثبت..."
                  action={markAsRead.bind(null, notification.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
