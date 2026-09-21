import { requireDepartment } from "@/lib/require-department";

export default async function AdminPage() {
  await requireDepartment("ADMIN");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Admin</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        User management, property onboarding, and compliance tracking will live here.
      </p>
    </div>
  );
}
