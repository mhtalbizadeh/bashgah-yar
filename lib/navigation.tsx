import type { ReactNode } from "react";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiCreditCard,
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiTool,
  FiBell,
} from "react-icons/fi";

export type NavItem = { href: string; label: string; icon: ReactNode };

const iconClass = "h-5 w-5";

export const adminNavItems: NavItem[] = [
  { href: "/admin", label: "داشبورد", icon: <FiHome className={iconClass} /> },
  { href: "/admin/users", label: "کاربران", icon: <FiUsers className={iconClass} /> },
  { href: "/admin/plans", label: "پلن‌های عضویت", icon: <FiClipboard className={iconClass} /> },
  { href: "/admin/subscriptions", label: "اشتراک‌ها", icon: <FiCreditCard className={iconClass} /> },
  { href: "/admin/payments", label: "پرداخت‌ها", icon: <FiDollarSign className={iconClass} /> },
  { href: "/admin/programs", label: "برنامه‌های تمرینی", icon: <FiClipboard className={iconClass} /> },
  { href: "/admin/products", label: "مکمل‌ها", icon: <FiPackage className={iconClass} /> },
  { href: "/admin/orders", label: "سفارش‌ها", icon: <FiShoppingCart className={iconClass} /> },
  { href: "/admin/equipment", label: "تجهیزات", icon: <FiTool className={iconClass} /> },
  { href: "/admin/salaries", label: "حقوق مربیان", icon: <FiDollarSign className={iconClass} /> },
  { href: "/admin/notifications", label: "اعلان‌ها", icon: <FiBell className={iconClass} /> },
];

export const coachNavItems: NavItem[] = [
  { href: "/coach", label: "داشبورد", icon: <FiHome className={iconClass} /> },
  { href: "/coach/programs", label: "برنامه‌های تمرینی", icon: <FiClipboard className={iconClass} /> },
  { href: "/coach/salary", label: "حقوق من", icon: <FiDollarSign className={iconClass} /> },
  { href: "/coach/notifications", label: "اعلان‌ها", icon: <FiBell className={iconClass} /> },
];

export const memberNavItems: NavItem[] = [
  { href: "/member", label: "داشبورد", icon: <FiHome className={iconClass} /> },
  { href: "/member/subscription", label: "اشتراک من", icon: <FiCreditCard className={iconClass} /> },
  { href: "/member/payments", label: "پرداخت‌ها", icon: <FiDollarSign className={iconClass} /> },
  { href: "/member/programs", label: "برنامه تمرینی", icon: <FiClipboard className={iconClass} /> },
  { href: "/member/products", label: "مکمل‌ها", icon: <FiPackage className={iconClass} /> },
  { href: "/member/orders", label: "سفارش‌های من", icon: <FiShoppingCart className={iconClass} /> },
  { href: "/member/notifications", label: "اعلان‌ها", icon: <FiBell className={iconClass} /> },
];
