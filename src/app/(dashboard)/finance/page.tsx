import { requireDepartment } from "@/lib/require-department";

export default async function FinancePage() {
  await requireDepartment("FINANCE");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Finance</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Rent tracking, arrears, and invoicing will live here.
      </p>
    </div>
  );
}
