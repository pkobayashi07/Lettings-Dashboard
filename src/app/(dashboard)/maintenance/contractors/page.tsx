import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { MaintenanceSubNav } from "@/components/maintenance/sub-nav";
import { NewContractorForm } from "@/components/maintenance/new-contractor-form";

export default async function ContractorsPage() {
  const user = await requireDepartment("MAINTENANCE");

  const contractors = await prisma.contractor.findMany({
    where: { organizationId: user.organizationId },
    include: { _count: { select: { tickets: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Maintenance</h1>
      <MaintenanceSubNav active="/maintenance/contractors" />

      <div className="mb-6">
        <NewContractorForm />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Trade</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Phone</th>
              <th className="px-4 py-2 font-medium">Tickets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {contractors.map((contractor) => (
              <tr key={contractor.id}>
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-50">
                  {contractor.name}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {contractor.trade ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {contractor.email ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {contractor.phone ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {contractor._count.tickets}
                </td>
              </tr>
            ))}
            {contractors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                  No contractors yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
