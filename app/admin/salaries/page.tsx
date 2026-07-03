import { FiPlus, FiEdit2 } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { SalaryForm } from "@/components/forms/SalaryForm";
import { getSalaries } from "@/actions/salaries";
import { getCoaches } from "@/actions/users";
import { formatToman } from "@/lib/format";

const statusLabel: Record<string, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت‌شده",
};

const statusTone: Record<string, "warning" | "success"> = {
  PENDING: "warning",
  PAID: "success",
};

export default async function SalariesPage() {
  const [salaries, coaches] = await Promise.all([getSalaries(), getCoaches()]);

  return (
    <div>
      <PageHeader
        title="حقوق مربیان"
        description="ثبت و مدیریت حقوق ماهانه مربیان"
        action={
          <FormDialog title="ثبت حقوق" triggerLabel="ثبت حقوق" triggerIcon={<FiPlus className="h-4 w-4" />}>
            <SalaryForm coaches={coaches} />
          </FormDialog>
        }
      />

      <Card>
        <Table>
          <TableHead>
            <Th>مربی</Th>
            <Th>ماه / سال</Th>
            <Th>مبلغ</Th>
            <Th>وضعیت</Th>
            <Th>عملیات</Th>
          </TableHead>
          <TableBody>
            {salaries.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center text-slate-400">
                  حقوقی ثبت نشده است.
                </Td>
              </Tr>
            )}
            {salaries.map((salary) => (
              <Tr key={salary.id}>
                <Td>{salary.coach.name}</Td>
                <Td>
                  {salary.month} / {salary.year}
                </Td>
                <Td>{formatToman(salary.amount)}</Td>
                <Td>
                  <Badge tone={statusTone[salary.status]}>
                    {statusLabel[salary.status]}
                  </Badge>
                </Td>
                <Td>
                  <FormDialog
                    title="ویرایش حقوق"
                    triggerLabel="ویرایش"
                    triggerIcon={<FiEdit2 className="h-4 w-4" />}
                    iconOnly
                  >
                    <SalaryForm coaches={coaches} salary={salary} />
                  </FormDialog>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
