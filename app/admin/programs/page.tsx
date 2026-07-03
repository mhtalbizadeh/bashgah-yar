import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { getAllPrograms } from "@/actions/training-programs";
import { formatDate } from "@/lib/format";

export default async function AdminProgramsPage() {
  const programs = await getAllPrograms();

  return (
    <div>
      <PageHeader
        title="برنامه‌های تمرینی"
        description="مشاهده همه برنامه‌های تمرینی ثبت‌شده توسط مربیان"
      />

      <Card>
        <Table>
          <TableHead>
            <Th>عنوان برنامه</Th>
            <Th>ورزشکار</Th>
            <Th>مربی</Th>
            <Th>تاریخ ایجاد</Th>
            <Th>آخرین ویرایش</Th>
          </TableHead>
          <TableBody>
            {programs.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center text-slate-400">
                  برنامه‌ای ثبت نشده است.
                </Td>
              </Tr>
            )}
            {programs.map((program) => (
              <Tr key={program.id}>
                <Td>{program.title}</Td>
                <Td>{program.member.name}</Td>
                <Td>{program.coach.name}</Td>
                <Td>{formatDate(program.createdAt)}</Td>
                <Td>{formatDate(program.updatedAt)}</Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
