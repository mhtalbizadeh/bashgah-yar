import { FiPlus, FiEdit2 } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { SubscriptionPlanForm } from "@/components/forms/SubscriptionPlanForm";
import {
  getSubscriptionPlans,
  deleteSubscriptionPlan,
} from "@/actions/subscription-plans";
import { formatToman } from "@/lib/format";

export default async function SubscriptionPlansPage() {
  const plans = await getSubscriptionPlans();

  return (
    <div>
      <PageHeader
        title="پلن‌های عضویت"
        description="مدیریت پلن‌های عضویت باشگاه"
        action={
          <FormDialog title="افزودن پلن" triggerLabel="افزودن پلن" triggerIcon={<FiPlus className="h-4 w-4" />}>
            <SubscriptionPlanForm />
          </FormDialog>
        }
      />

      <Card>
        <Table>
          <TableHead>
            <Th>نام پلن</Th>
            <Th>مدت اعتبار</Th>
            <Th>قیمت</Th>
            <Th>توضیحات</Th>
            <Th>عملیات</Th>
          </TableHead>
          <TableBody>
            {plans.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center text-slate-400">
                  پلنی ثبت نشده است.
                </Td>
              </Tr>
            )}
            {plans.map((plan) => (
              <Tr key={plan.id}>
                <Td>{plan.name}</Td>
                <Td>{plan.durationDays} روز</Td>
                <Td>{formatToman(plan.price)}</Td>
                <Td className="max-w-xs whitespace-normal text-slate-500">
                  {plan.description || "—"}
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <FormDialog
                      title="ویرایش پلن"
                      triggerLabel="ویرایش"
                      triggerIcon={<FiEdit2 className="h-4 w-4" />}
                      iconOnly
                    >
                      <SubscriptionPlanForm plan={plan} />
                    </FormDialog>
                    <ConfirmDeleteButton
                      itemLabel={plan.name}
                      action={deleteSubscriptionPlan.bind(null, plan.id)}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
