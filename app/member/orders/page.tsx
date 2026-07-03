import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { requireRole } from "@/lib/auth-guard";
import { getMyOrders } from "@/actions/orders";
import { formatDate } from "@/lib/format";

const statusLabel: Record<string, string> = {
  PENDING: "در انتظار",
  READY: "آماده تحویل",
  DELIVERED: "تحویل شده",
};

const statusTone: Record<string, "warning" | "primary" | "success"> = {
  PENDING: "warning",
  READY: "primary",
  DELIVERED: "success",
};

export default async function MemberOrdersPage() {
  const member = await requireRole("MEMBER");
  const orders = await getMyOrders(member.id);

  return (
    <div>
      <PageHeader title="سفارش‌های من" description="پیگیری سفارش‌های مکمل شما" />

      <Card>
        <Table>
          <TableHead>
            <Th>محصول</Th>
            <Th>تاریخ ثبت</Th>
            <Th>وضعیت</Th>
          </TableHead>
          <TableBody>
            {orders.length === 0 && (
              <Tr>
                <Td colSpan={3} className="text-center text-slate-400">
                  سفارشی ثبت نکرده‌اید.
                </Td>
              </Tr>
            )}
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.product.name}</Td>
                <Td>{formatDate(order.createdAt)}</Td>
                <Td>
                  <Badge tone={statusTone[order.status]}>
                    {statusLabel[order.status]}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
