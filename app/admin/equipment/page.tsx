import { FiPlus, FiEdit2 } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { getEquipment, deleteEquipment } from "@/actions/equipment";
import { formatDate } from "@/lib/format";

const statusLabel: Record<string, string> = {
  ACTIVE: "فعال",
  NEEDS_REPAIR: "نیازمند تعمیر",
  BROKEN: "خراب",
};

const statusTone: Record<string, "success" | "warning" | "danger"> = {
  ACTIVE: "success",
  NEEDS_REPAIR: "warning",
  BROKEN: "danger",
};

export default async function EquipmentPage() {
  const equipment = await getEquipment();

  return (
    <div>
      <PageHeader
        title="تجهیزات"
        description="مدیریت تجهیزات باشگاه"
        action={
          <FormDialog title="افزودن دستگاه" triggerLabel="افزودن دستگاه" triggerIcon={<FiPlus className="h-4 w-4" />}>
            <EquipmentForm />
          </FormDialog>
        }
      />

      <Card>
        <Table>
          <TableHead>
            <Th>نام دستگاه</Th>
            <Th>تاریخ خرید</Th>
            <Th>وضعیت</Th>
            <Th>توضیحات</Th>
            <Th>عملیات</Th>
          </TableHead>
          <TableBody>
            {equipment.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center text-slate-400">
                  دستگاهی ثبت نشده است.
                </Td>
              </Tr>
            )}
            {equipment.map((item) => (
              <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>{formatDate(item.purchaseDate)}</Td>
                <Td>
                  <Badge tone={statusTone[item.status]}>{statusLabel[item.status]}</Badge>
                </Td>
                <Td className="max-w-xs whitespace-normal text-slate-500">
                  {item.description || "—"}
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <FormDialog
                      title="ویرایش دستگاه"
                      triggerLabel="ویرایش"
                      triggerIcon={<FiEdit2 className="h-4 w-4" />}
                      iconOnly
                    >
                      <EquipmentForm equipment={item} />
                    </FormDialog>
                    <ConfirmDeleteButton
                      itemLabel={item.name}
                      action={deleteEquipment.bind(null, item.id)}
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
