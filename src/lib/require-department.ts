import "server-only";

import { notFound } from "next/navigation";
import type { Department } from "@prisma/client";
import { getCurrentUser } from "@/lib/dal";

const FULL_ACCESS_ROLES = ["OWNER", "MANAGER"] as const;

export async function requireDepartment(department: Department) {
  const user = await getCurrentUser();

  const hasAccess =
    user.department === department ||
    FULL_ACCESS_ROLES.includes(user.role as (typeof FULL_ACCESS_ROLES)[number]);

  if (!hasAccess) {
    notFound();
  }

  return user;
}
