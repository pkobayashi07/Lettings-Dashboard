import { requireDepartment } from "@/lib/require-department";

export default async function LettingsPage() {
  await requireDepartment("LETTINGS");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Lettings</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Applicant pipeline and tenancy management will live here.
      </p>
    </div>
  );
}
