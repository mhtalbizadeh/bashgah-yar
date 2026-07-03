import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/generated/prisma/client";

declare module "next-auth" {
  interface User {
    phone: string;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      phone: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    phone: string;
  }
}
