import { FiPlus, FiEdit2 } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { TrainingProgramForm } from "@/components/forms/TrainingProgramForm";
import { getCoachPrograms, deleteProgram } from "@/actions/training-programs";
import { getMembers } from "@/actions/users";
import { requireRole } from "@/lib/auth-guard";
import { formatDate } from "@/lib/format";

export default async function CoachProgramsPage() {
  const coach = await requireRole("COACH");
  const [programs, members] = await Promise.all([
    getCoachPrograms(coach.id),
    getMembers(),
  ]);

  return (
    <div>
      <PageHeader
        title="برنامه‌های تمرینی"
        description="ایجاد و مدیریت برنامه‌های تمرینی ورزشکاران شما"
        action={
          <FormDialog title="ایجاد برنامه تمرینی" triggerLabel="ایجاد برنامه" triggerIcon={<FiPlus className="h-4 w-4" />}>
            <TrainingProgramForm members={members} />
          </FormDialog>
        }
      />

      <Card>
        <Table>
          <TableHead>
            <Th>ورزشکار</Th>
            <Th>عنوان برنامه</Th>
            <Th>آخرین ویرایش</Th>
            <Th>عملیات</Th>
          </TableHead>
          <TableBody>
            {programs.length === 0 && (
              <Tr>
                <Td colSpan={4} className="text-center text-slate-400">
                  هنوز برنامه‌ای ایجاد نکرده‌اید.
                </Td>
              </Tr>
            )}
            {programs.map((program) => (
              <Tr key={program.id}>
                <Td>{program.member.name}</Td>
                <Td>{program.title}</Td>
                <Td>{formatDate(program.updatedAt)}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <FormDialog
                      title="ویرایش برنامه"
                      triggerLabel="ویرایش"
                      triggerIcon={<FiEdit2 className="h-4 w-4" />}
                      iconOnly
                    >
                      <TrainingProgramForm members={members} program={program} />
                    </FormDialog>
                    <ConfirmDeleteButton
                      itemLabel={program.title}
                      action={deleteProgram.bind(null, program.id)}
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
