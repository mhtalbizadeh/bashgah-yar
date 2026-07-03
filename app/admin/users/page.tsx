import { FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { UserForm } from "@/components/forms/UserForm";
import { getUsers, deleteUser } from "@/actions/users";
import { formatDate } from "@/lib/format";

const roleLabel: Record<string, string> = {
  ADMIN: "مدیر",
  COACH: "مربی",
  MEMBER: "ورزشکار",
};

const roleTone: Record<string, "primary" | "success" | "neutral"> = {
  ADMIN: "primary",
  COACH: "success",
  MEMBER: "neutral",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await getUsers(q);

  return (
    <div>
      <PageHeader
        title="کاربران"
        description="مدیریت مدیران، مربیان و ورزشکاران سیستم"
        action={
          <FormDialog title="افزودن کاربر" triggerLabel="افزودن کاربر" triggerIcon={<FiPlus className="h-4 w-4" />}>
            <UserForm />
          </FormDialog>
        }
      />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <form className="flex max-w-sm items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
            <FiSearch className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="جستجو بر اساس نام یا شماره تماس..."
              className="w-full text-sm outline-none"
            />
          </form>
        </div>

        <Table>
          <TableHead>
            <Th>نام</Th>
            <Th>شماره تماس</Th>
            <Th>نقش</Th>
            <Th>تاریخ عضویت</Th>
            <Th>عملیات</Th>
          </TableHead>
          <TableBody>
            {users.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center text-slate-400">
                  کاربری یافت نشد.
                </Td>
              </Tr>
            )}
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td dir="ltr" className="text-right">
                  {user.phone}
                </Td>
                <Td>
                  <Badge tone={roleTone[user.role]}>{roleLabel[user.role]}</Badge>
                </Td>
                <Td>{formatDate(user.createdAt)}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <FormDialog
                      title="ویرایش کاربر"
                      triggerLabel="ویرایش"
                      triggerIcon={<FiEdit2 className="h-4 w-4" />}
                      iconOnly
                    >
                      <UserForm user={user} />
                    </FormDialog>
                    <ConfirmDeleteButton
                      itemLabel={user.name}
                      action={deleteUser.bind(null, user.id)}
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
