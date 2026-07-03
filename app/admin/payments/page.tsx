import { FiPlus, FiSearch } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { Button } from "@/components/ui/Button";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { getPayments } from "@/actions/payments";
import { getMembers } from "@/actions/users";
import { getSubscriptions } from "@/actions/subscriptions";
import { formatDate, formatToman } from "@/lib/format";
import type { PaymentStatus } from "@/lib/generated/prisma/enums";

const statusLabel: Record<string, string> = {
  PENDING: "در انتظار",
  PAID: "پرداخت‌شده",
  FAILED: "ناموفق",
};

const statusTone: Record<string, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  PAID: "success",
  FAILED: "danger",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const [payments, members, subscriptions] = await Promise.all([
    getPayments({ search: q, status: status as PaymentStatus | undefined }),
    getMembers(),
    getSubscriptions(),
  ]);

  return (
    <div>
      <PageHeader
        title="پرداخت‌ها"
        description="مدیریت پرداخت‌های اعضا"
        action={
          <FormDialog title="ثبت پرداخت جدید" triggerLabel="ثبت پرداخت" triggerIcon={<FiPlus className="h-4 w-4" />}>
            <PaymentForm members={members} subscriptions={subscriptions} />
          </FormDialog>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
          <form className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <FiSearch className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="جستجو بر اساس نام یا شماره تماس..."
                className="w-full text-sm outline-none"
              />
            </div>
            <select
              name="status"
              defaultValue={status ?? ""}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
            >
              <option value="">همه وضعیت‌ها</option>
              {Object.entries(statusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline" size="sm">
              اعمال فیلتر
            </Button>
          </form>
        </div>

        <Table>
          <TableHead>
            <Th>ورزشکار</Th>
            <Th>پلن اشتراک</Th>
            <Th>مبلغ</Th>
            <Th>وضعیت</Th>
            <Th>تاریخ پرداخت</Th>
          </TableHead>
          <TableBody>
            {payments.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center text-slate-400">
                  پرداختی یافت نشد.
                </Td>
              </Tr>
            )}
            {payments.map((payment) => (
              <Tr key={payment.id}>
                <Td>{payment.member.name}</Td>
                <Td>{payment.subscription?.plan.name ?? "—"}</Td>
                <Td>{formatToman(payment.amount)}</Td>
                <Td>
                  <Badge tone={statusTone[payment.status]}>
                    {statusLabel[payment.status]}
                  </Badge>
                </Td>
                <Td>{payment.paidAt ? formatDate(payment.paidAt) : "—"}</Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
