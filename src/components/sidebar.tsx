import Link from "next/link";
import type { Department, Role } from "@prisma/client";
import { getVisibleNavItems } from "@/lib/nav";

export function Sidebar({ department, role }: { department: Department; role: Role }) {
  const items = getVisibleNavItems(department, role);

  return (
    <aside className="hidden w-56 shrink-0 border-r border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:block">
      <div className="mb-6 px-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        Lettings CRM
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-2 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
