import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { LettingsSubNav } from "@/components/lettings/sub-nav";
import { NewTenancyForm } from "@/components/lettings/new-tenancy-form";
import { TenancyCard } from "@/components/lettings/tenancy-card";
import { TENANCY_PIPELINE, TENANCY_STATUS_LABELS } from "@/lib/lettings/definitions";

export default async function LettingsPipelinePage() {
  const user = await requireDepartment("LETTINGS");

  const [tenancies, tenants, units] = await Promise.all([
    prisma.tenancy.findMany({
      where: { unit: { property: { organizationId: user.organizationId } } },
      include: {
        tenant: { select: { name: true } },
        unit: { include: { property: { select: { addressLine1: true, city: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tenant.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.unit.findMany({
      where: { property: { organizationId: user.organizationId } },
      select: {
        id: true,
        label: true,
        rentAmount: true,
        property: { select: { addressLine1: true, city: true } },
      },
      orderBy: { label: "asc" },
    }),
  ]);

  const tenanciesByStatus = TENANCY_PIPELINE.map((status) => ({
    status,
    items: tenancies
      .filter((tenancy) => tenancy.status === status)
      .map((tenancy) => ({
        ...tenancy,
        rentAmount: tenancy.rentAmount.toNumber(),
      })),
  }));

  const unitOptions = units.map((unit) => ({
    id: unit.id,
    label: unit.label,
    propertyAddress: `${unit.property.addressLine1}, ${unit.property.city}`,
    rentAmount: unit.rentAmount ? unit.rentAmount.toNumber() : null,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Lettings</h1>
      <LettingsSubNav active="/lettings" />

      <div className="mb-6">
        <NewTenancyForm tenants={tenants} units={unitOptions} />
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
        {tenanciesByStatus.map(({ status, items }) => (
          <div key={status} className="min-w-[240px] space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {TENANCY_STATUS_LABELS[status]} ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((tenancy) => (
                <TenancyCard key={tenancy.id} tenancy={tenancy} />
              ))}
              {items.length === 0 && (
                <p className="text-xs text-neutral-400 dark:text-neutral-600">No tenancies</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
