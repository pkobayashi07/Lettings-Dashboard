import { requireDepartment } from "@/lib/require-department";

export default async function MaintenancePage() {
  await requireDepartment("MAINTENANCE");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        Maintenance
      </h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Ticketing and contractor assignment will live here.
      </p>
    </div>
  );
}
