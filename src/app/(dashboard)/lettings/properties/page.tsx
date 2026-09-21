import Link from "next/link";
import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { LettingsSubNav } from "@/components/lettings/sub-nav";
import { NewPropertyForm } from "@/components/lettings/new-property-form";

export default async function PropertiesPage() {
  const user = await requireDepartment("LETTINGS");

  const [properties, landlords] = await Promise.all([
    prisma.property.findMany({
      where: { organizationId: user.organizationId },
      include: {
        landlord: { select: { name: true } },
        _count: { select: { units: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.landlord.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Lettings</h1>
      <LettingsSubNav active="/lettings/properties" />

      <div className="mb-6">
        <NewPropertyForm landlords={landlords} />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Address</th>
              <th className="px-4 py-2 font-medium">Landlord</th>
              <th className="px-4 py-2 font-medium">Units</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-4 py-2">
                  <Link
                    href={`/lettings/properties/${property.id}`}
                    className="font-medium text-neutral-900 hover:underline dark:text-neutral-50"
                  >
                    {property.addressLine1}, {property.city} {property.postcode}
                  </Link>
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {property.landlord?.name ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {property._count.units}
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-neutral-400">
                  No properties yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
