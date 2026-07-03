import { NextResponse } from "next/server";
import { auth } from "@/auth";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  COACH: "/coach",
  MEMBER: "/member",
};

const protectedSections = ["admin", "coach", "member"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  const roleSection = nextUrl.pathname.split("/")[1];

  if (nextUrl.pathname.startsWith("/login")) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(roleHome[role ?? ""] ?? "/", nextUrl)
      );
    }
    return NextResponse.next();
  }

  if (protectedSections.includes(roleSection)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (roleSection.toUpperCase() !== role) {
      return NextResponse.redirect(
        new URL(roleHome[role ?? ""] ?? "/", nextUrl)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)"],
};
