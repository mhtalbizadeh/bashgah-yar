import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { requireRole } from "@/lib/auth-guard";
import { getMemberPrograms } from "@/actions/training-programs";
import { formatDate } from "@/lib/format";

export default async function MemberProgramsPage() {
  const member = await requireRole("MEMBER");
  const programs = await getMemberPrograms(member.id);

  return (
    <div>
      <PageHeader title="برنامه تمرینی" description="برنامه‌های تمرینی ثبت‌شده توسط مربی شما" />

      {programs.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">هنوز برنامه‌ای برای شما ثبت نشده است.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {programs.map((program) => (
            <Card key={program.id}>
              <CardHeader
                title={program.title}
                description={`مربی: ${program.coach.name} — آخرین ویرایش: ${formatDate(
                  program.updatedAt
                )}`}
              />
              <CardContent>
                <p className="whitespace-pre-line text-sm text-slate-700">
                  {program.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
