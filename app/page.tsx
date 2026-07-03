import { redirect } from "next/navigation";
import { auth } from "@/auth";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  COACH: "/coach",
  MEMBER: "/member",
};

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  redirect(roleHome[session.user.role] ?? "/login");
}
