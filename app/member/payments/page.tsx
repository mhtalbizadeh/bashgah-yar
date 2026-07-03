import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { requireRole } from "@/lib/auth-guard";
import { getMyPayments } from "@/actions/payments";
import { formatDate, formatToman } from "@/lib/format";

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

export default async function MemberPaymentsPage() {
  const member = await requireRole("MEMBER");
  const payments = await getMyPayments(member.id);

  return (
    <div>
      <PageHeader title="پرداخت‌ها" description="سوابق پرداخت‌های شما" />

      <Card>
        <Table>
          <TableHead>
            <Th>پلن اشتراک</Th>
            <Th>مبلغ</Th>
            <Th>وضعیت</Th>
            <Th>تاریخ پرداخت</Th>
          </TableHead>
          <TableBody>
            {payments.length === 0 && (
              <Tr>
                <Td colSpan={4} className="text-center text-slate-400">
                  پرداختی ثبت نشده است.
                </Td>
              </Tr>
            )}
            {payments.map((payment) => (
              <Tr key={payment.id}>
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
