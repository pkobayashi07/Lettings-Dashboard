import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { LettingsSubNav } from "@/components/lettings/sub-nav";
import { NewTenantForm } from "@/components/lettings/new-tenant-form";

export default async function TenantsPage() {
  const user = await requireDepartment("LETTINGS");

  const tenants = await prisma.tenant.findMany({
    where: { organizationId: user.organizationId },
    include: { _count: { select: { tenancies: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Lettings</h1>
      <LettingsSubNav active="/lettings/tenants" />

      <div className="mb-6">
        <NewTenantForm />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Phone</th>
              <th className="px-4 py-2 font-medium">Tenancies</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-50">
                  {tenant.name}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {tenant.email ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {tenant.phone ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {tenant._count.tenancies}
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-400">
                  No tenants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
