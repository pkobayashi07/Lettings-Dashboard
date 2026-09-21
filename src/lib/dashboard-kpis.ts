import "server-only";

import { prisma } from "@/lib/prisma";

export type Kpi = { label: string; value: string; hint?: string };

const APPLICANT_STATUSES = ["ENQUIRY", "VIEWING", "REFERENCING", "OFFER", "SIGNED"] as const;

async function getOccupancy(organizationId: string) {
  const [totalUnits, activeTenancies] = await Promise.all([
    prisma.unit.count({ where: { property: { organizationId } } }),
    prisma.tenancy.findMany({
      where: { status: "ACTIVE", unit: { property: { organizationId } } },
      select: { unitId: true },
      distinct: ["unitId"],
    }),
  ]);

  const occupiedUnits = activeTenancies.length;
  const vacantUnits = Math.max(totalUnits - occupiedUnits, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  return { totalUnits, occupiedUnits, vacantUnits, occupancyRate };
}

async function getAdminKpis(organizationId: string): Promise<Kpi[]> {
  const [activeUsers, properties] = await Promise.all([
    prisma.user.count({ where: { organizationId } }),
    prisma.property.count({ where: { organizationId } }),
  ]);

  return [
    { label: "Active Users", value: String(activeUsers) },
    { label: "Properties Onboarded", value: String(properties) },
    { label: "Compliance Items Due", value: "—", hint: "Not tracked yet" },
  ];
}

async function getLettingsKpis(organizationId: string): Promise<Kpi[]> {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [openApplications, occupancy, renewalsDue] = await Promise.all([
    prisma.tenancy.count({
      where: {
        status: { in: [...APPLICANT_STATUSES] },
        unit: { property: { organizationId } },
      },
    }),
    getOccupancy(organizationId),
    prisma.tenancy.count({
      where: {
        status: "ACTIVE",
        endDate: { gte: now, lte: in30Days },
        unit: { property: { organizationId } },
      },
    }),
  ]);

  return [
    { label: "Open Applications", value: String(openApplications) },
    { label: "Vacant Units", value: String(occupancy.vacantUnits), hint: `of ${occupancy.totalUnits} total` },
    { label: "Renewals Due (30d)", value: String(renewalsDue) },
  ];
}

async function getMaintenanceKpis(organizationId: string): Promise<Kpi[]> {
  const [openTickets, urgentTickets, resolvedTickets] = await Promise.all([
    prisma.maintenanceTicket.count({
      where: { status: "OPEN", unit: { property: { organizationId } } },
    }),
    prisma.maintenanceTicket.count({
      where: {
        priority: "URGENT",
        status: { not: "RESOLVED" },
        unit: { property: { organizationId } },
      },
    }),
    prisma.maintenanceTicket.findMany({
      where: { status: "RESOLVED", unit: { property: { organizationId } } },
      select: { createdAt: true, updatedAt: true },
    }),
  ]);

  let avgResolutionLabel = "—";
  if (resolvedTickets.length > 0) {
    const totalHours = resolvedTickets.reduce(
      (sum, ticket) => sum + (ticket.updatedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60),
      0
    );
    const avgHours = totalHours / resolvedTickets.length;
    avgResolutionLabel = avgHours >= 24 ? `${(avgHours / 24).toFixed(1)}d` : `${avgHours.toFixed(1)}h`;
  }

  return [
    { label: "Open Tickets", value: String(openTickets) },
    { label: "Urgent Tickets", value: String(urgentTickets) },
    { label: "Avg. Resolution Time", value: avgResolutionLabel },
  ];
}

async function getFinanceKpis(organizationId: string): Promise<Kpi[]> {
  const now = new Date();

  const [pendingPayments, occupancy] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "PENDING", tenancy: { unit: { property: { organizationId } } } },
      select: { amount: true, dueDate: true },
    }),
    getOccupancy(organizationId),
  ]);

  const overduePayments = pendingPayments.filter((p) => p.dueDate < now);
  const arrearsTotal = overduePayments.reduce((sum, p) => sum + p.amount.toNumber(), 0);

  return [
    { label: "Rent Arrears", value: `£${arrearsTotal.toLocaleString()}`, hint: `${overduePayments.length} overdue` },
    { label: "Outstanding Invoices", value: String(pendingPayments.length) },
    { label: "Occupancy Rate", value: `${occupancy.occupancyRate}%` },
  ];
}

export async function getDashboardKpis(
  organizationId: string,
  departments: readonly ("ADMIN" | "LETTINGS" | "MAINTENANCE" | "FINANCE")[]
): Promise<Record<string, Kpi[]>> {
  const entries = await Promise.all(
    departments.map(async (department) => {
      switch (department) {
        case "ADMIN":
          return [department, await getAdminKpis(organizationId)] as const;
        case "LETTINGS":
          return [department, await getLettingsKpis(organizationId)] as const;
        case "MAINTENANCE":
          return [department, await getMaintenanceKpis(organizationId)] as const;
        case "FINANCE":
          return [department, await getFinanceKpis(organizationId)] as const;
      }
    })
  );

  return Object.fromEntries(entries);
}
