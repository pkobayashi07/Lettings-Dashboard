import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { MaintenanceSubNav } from "@/components/maintenance/sub-nav";
import { NewTicketForm } from "@/components/maintenance/new-ticket-form";
import { TicketCard } from "@/components/maintenance/ticket-card";
import { TICKET_BOARD_COLUMNS, TICKET_STATUS_LABELS } from "@/lib/maintenance/definitions";

export default async function MaintenancePage() {
  const user = await requireDepartment("MAINTENANCE");

  const [tickets, units, contractors] = await Promise.all([
    prisma.maintenanceTicket.findMany({
      where: { unit: { property: { organizationId: user.organizationId } } },
      include: {
        unit: { include: { property: { select: { addressLine1: true, city: true } } } },
        contractor: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.unit.findMany({
      where: { property: { organizationId: user.organizationId } },
      select: {
        id: true,
        label: true,
        property: { select: { addressLine1: true, city: true } },
      },
      orderBy: { label: "asc" },
    }),
    prisma.contractor.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const ticketsByStatus = TICKET_BOARD_COLUMNS.map((status) => ({
    status,
    items: tickets.filter((ticket) => ticket.status === status),
  }));

  const unitOptions = units.map((unit) => ({
    id: unit.id,
    label: unit.label,
    propertyAddress: `${unit.property.addressLine1}, ${unit.property.city}`,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Maintenance</h1>
      <MaintenanceSubNav active="/maintenance" />

      <div className="mb-6">
        <NewTicketForm units={unitOptions} contractors={contractors} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ticketsByStatus.map(({ status, items }) => (
          <div key={status} className="min-w-[240px] space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {TICKET_STATUS_LABELS[status]} ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {items.length === 0 && (
                <p className="text-xs text-neutral-400 dark:text-neutral-600">No tickets</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
