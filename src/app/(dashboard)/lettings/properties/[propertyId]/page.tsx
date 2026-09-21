import Link from "next/link";
import { notFound } from "next/navigation";
import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { NewUnitForm } from "@/components/lettings/new-unit-form";

export default async function PropertyDetailPage({
  params,
}: PageProps<"/lettings/properties/[propertyId]">) {
  const user = await requireDepartment("LETTINGS");
  const { propertyId } = await params;

  const property = await prisma.property.findFirst({
    where: { id: propertyId, organizationId: user.organizationId },
    include: {
      landlord: { select: { name: true } },
      units: { orderBy: { label: "asc" } },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/lettings/properties"
        className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
      >
        ← Properties
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        {property.addressLine1}, {property.city} {property.postcode}
      </h1>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Landlord: {property.landlord?.name ?? "—"}
      </p>

      <div className="mb-6">
        <NewUnitForm propertyId={property.id} />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Unit</th>
              <th className="px-4 py-2 font-medium">Bedrooms</th>
              <th className="px-4 py-2 font-medium">Rent (pcm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {property.units.map((unit) => (
              <tr key={unit.id}>
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-50">
                  {unit.label}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {unit.bedrooms ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {unit.rentAmount ? `£${unit.rentAmount.toNumber().toLocaleString()}` : "—"}
                </td>
              </tr>
            ))}
            {property.units.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-neutral-400">
                  No units yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
