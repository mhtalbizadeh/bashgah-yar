import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { OrderStatusSelect } from "@/components/forms/OrderStatusSelect";
import { getOrders } from "@/actions/orders";
import { formatDate } from "@/lib/format";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <PageHeader title="سفارش‌ها" description="مدیریت سفارش‌های مکمل ورزشکاران" />

      <Card>
        <Table>
          <TableHead>
            <Th>ورزشکار</Th>
            <Th>محصول</Th>
            <Th>تاریخ ثبت</Th>
            <Th>وضعیت</Th>
          </TableHead>
          <TableBody>
            {orders.length === 0 && (
              <Tr>
                <Td colSpan={4} className="text-center text-slate-400">
                  سفارشی ثبت نشده است.
                </Td>
              </Tr>
            )}
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.member.name}</Td>
                <Td>{order.product.name}</Td>
                <Td>{formatDate(order.createdAt)}</Td>
                <Td>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
