import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { requireRole } from "@/lib/auth-guard";
import { getMySalaries } from "@/actions/salaries";
import { formatToman } from "@/lib/format";

const statusLabel: Record<string, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت‌شده",
};

const statusTone: Record<string, "warning" | "success"> = {
  PENDING: "warning",
  PAID: "success",
};

export default async function CoachSalaryPage() {
  const coach = await requireRole("COACH");
  const salaries = await getMySalaries(coach.id);

  return (
    <div>
      <PageHeader title="حقوق من" description="سوابق پرداخت حقوق شما" />

      <Card>
        <Table>
          <TableHead>
            <Th>ماه / سال</Th>
            <Th>مبلغ</Th>
            <Th>وضعیت</Th>
          </TableHead>
          <TableBody>
            {salaries.length === 0 && (
              <Tr>
                <Td colSpan={3} className="text-center text-slate-400">
                  حقوقی برای شما ثبت نشده است.
                </Td>
              </Tr>
            )}
            {salaries.map((salary) => (
              <Tr key={salary.id}>
                <Td>
                  {salary.month} / {salary.year}
                </Td>
                <Td>{formatToman(salary.amount)}</Td>
                <Td>
                  <Badge tone={statusTone[salary.status]}>
                    {statusLabel[salary.status]}
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
