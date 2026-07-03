import { FiPlus } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import { getSubscriptions, renewSubscription } from "@/actions/subscriptions";
import { getMembers } from "@/actions/users";
import { getSubscriptionPlans } from "@/actions/subscription-plans";
import { formatDate } from "@/lib/format";

export default async function SubscriptionsPage() {
  const [subscriptions, members, plans] = await Promise.all([
    getSubscriptions(),
    getMembers(),
    getSubscriptionPlans(),
  ]);

  return (
    <div>
      <PageHeader
        title="اشتراک‌ها"
        description="مدیریت اشتراک‌های ورزشکاران"
        action={
          <FormDialog
            title="ثبت اشتراک جدید"
            triggerLabel="ثبت اشتراک"
            triggerIcon={<FiPlus className="h-4 w-4" />}
          >
            <SubscriptionForm members={members} plans={plans} />
          </FormDialog>
        }
      />

      <Card>
        <Table>
          <TableHead>
            <Th>ورزشکار</Th>
            <Th>پلن</Th>
            <Th>تاریخ شروع</Th>
            <Th>تاریخ پایان</Th>
            <Th>وضعیت</Th>
            <Th>عملیات</Th>
          </TableHead>
          <TableBody>
            {subscriptions.length === 0 && (
              <Tr>
                <Td colSpan={6} className="text-center text-slate-400">
                  اشتراکی ثبت نشده است.
                </Td>
              </Tr>
            )}
            {subscriptions.map((subscription) => {
              const isActive =
                subscription.status === "ACTIVE" &&
                new Date(subscription.endDate) > new Date();

              return (
                <Tr key={subscription.id}>
                  <Td>{subscription.member.name}</Td>
                  <Td>{subscription.plan.name}</Td>
                  <Td>{formatDate(subscription.startDate)}</Td>
                  <Td>{formatDate(subscription.endDate)}</Td>
                  <Td>
                    <Badge tone={isActive ? "success" : "danger"}>
                      {isActive ? "فعال" : "منقضی شده"}
                    </Badge>
                  </Td>
                  <Td>
                    <ActionButton
                      label="تمدید"
                      pendingLabel="در حال تمدید..."
                      action={renewSubscription.bind(null, subscription.id)}
                    />
                  </Td>
                </Tr>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
