"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import type { NavItem } from "@/lib/navigation";
import { logout } from "@/actions/auth";

export function Sidebar({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-e border-slate-200 bg-white p-4">
      <div className="mb-6 flex items-center gap-3 px-2">
        <Image src="/Container.svg" alt="باشگاه‌یار" width={40} height={40} />
        <div>
          <h1 className="text-lg font-bold text-primary">باشگاه‌یار</h1>
          <p className="text-xs text-slate-500">{title}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {items.map(({ href, label, icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 font-medium text-primary"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {isActive && (
                <span className="absolute inset-y-0 start-0 w-1 rounded-e-full bg-primary" />
              )}
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="mt-auto border-t border-slate-200 pt-4">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-red-100"
        >
          <FiLogOut className="h-5 w-5" />
          خروج از حساب
        </button>
      </form>
    </aside>
  );
}
