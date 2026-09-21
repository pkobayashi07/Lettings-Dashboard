import type { Department, Role } from "@prisma/client";

export type NavItem = {
  label: string;
  href: string;
  department: Department | "DASHBOARD";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", department: "DASHBOARD" },
  { label: "Admin", href: "/admin", department: "ADMIN" },
  { label: "Lettings", href: "/lettings", department: "LETTINGS" },
  { label: "Maintenance", href: "/maintenance", department: "MAINTENANCE" },
  { label: "Finance", href: "/finance", department: "FINANCE" },
];

const FULL_ACCESS_ROLES: Role[] = ["OWNER", "MANAGER"];

export function getVisibleNavItems(department: Department, role: Role) {
  if (FULL_ACCESS_ROLES.includes(role)) {
    return NAV_ITEMS;
  }

  return NAV_ITEMS.filter(
    (item) => item.department === "DASHBOARD" || item.department === department
  );
}
