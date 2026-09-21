import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { NewComplianceItemForm } from "@/components/admin/new-compliance-item-form";
import { ComplianceItemRow } from "@/components/admin/compliance-item-row";

export default async function AdminPage() {
  const user = await requireDepartment("ADMIN");

  const [complianceItems, properties] = await Promise.all([
    prisma.complianceItem.findMany({
      where: { property: { organizationId: user.organizationId } },
      include: { property: { select: { addressLine1: true, city: true } } },
      orderBy: { expiryDate: "asc" },
    }),
    prisma.property.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, addressLine1: true, city: true },
      orderBy: { addressLine1: "asc" },
    }),
  ]);

  const propertyOptions = properties.map((property) => ({
    id: property.id,
    address: `${property.addressLine1}, ${property.city}`,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Admin</h1>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Compliance certificates and expiry tracking across your properties.
      </p>

      <div className="mb-6">
        <NewComplianceItemForm properties={propertyOptions} />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Property</th>
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="px-4 py-2 font-medium">Expiry</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {complianceItems.map((item) => (
              <ComplianceItemRow key={item.id} item={item} />
            ))}
            {complianceItems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-400">
                  No compliance items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
