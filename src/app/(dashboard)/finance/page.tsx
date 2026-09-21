import { requireDepartment } from "@/lib/require-department";
import { prisma } from "@/lib/prisma";
import { NewPaymentForm } from "@/components/finance/new-payment-form";
import { PaymentRow } from "@/components/finance/payment-row";
import { KpiTile } from "@/components/kpi-tile";

export default async function FinancePage() {
  const user = await requireDepartment("FINANCE");

  const [payments, tenancies] = await Promise.all([
    prisma.payment.findMany({
      where: { tenancy: { unit: { property: { organizationId: user.organizationId } } } },
      include: {
        tenancy: {
          include: {
            tenant: { select: { name: true } },
            unit: { include: { property: { select: { addressLine1: true, city: true } } } },
          },
        },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.tenancy.findMany({
      where: {
        status: { in: ["ACTIVE", "ENDING"] },
        unit: { property: { organizationId: user.organizationId } },
      },
      include: {
        tenant: { select: { name: true } },
        unit: { include: { property: { select: { addressLine1: true, city: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const paymentRows = payments.map((payment) => ({
    ...payment,
    amount: payment.amount.toNumber(),
  }));

  const now = new Date();
  const outstanding = paymentRows.filter((p) => p.status === "PENDING");
  const overdue = outstanding.filter((p) => p.dueDate < now);
  const paidThisMonth = paymentRows.filter(
    (p) =>
      p.status === "PAID" &&
      p.paidDate &&
      p.paidDate.getMonth() === now.getMonth() &&
      p.paidDate.getFullYear() === now.getFullYear()
  );

  const outstandingTotal = outstanding.reduce((sum, p) => sum + p.amount, 0);
  const overdueTotal = overdue.reduce((sum, p) => sum + p.amount, 0);
  const collectedThisMonth = paidThisMonth.reduce((sum, p) => sum + p.amount, 0);

  const tenancyOptions = tenancies.map((tenancy) => ({
    id: tenancy.id,
    tenantName: tenancy.tenant.name,
    unitLabel: tenancy.unit.label,
    propertyAddress: `${tenancy.unit.property.addressLine1}, ${tenancy.unit.property.city}`,
    rentAmount: tenancy.rentAmount.toNumber(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Finance</h1>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Rent charges, arrears, and collections.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="Outstanding" value={`£${outstandingTotal.toLocaleString()}`} hint={`${outstanding.length} charge(s)`} />
        <KpiTile label="Arrears" value={`£${overdueTotal.toLocaleString()}`} hint={`${overdue.length} overdue`} />
        <KpiTile label="Collected this month" value={`£${collectedThisMonth.toLocaleString()}`} hint={`${paidThisMonth.length} payment(s)`} />
      </div>

      <div className="mb-6">
        <NewPaymentForm tenancies={tenancyOptions} />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Tenant</th>
              <th className="px-4 py-2 font-medium">Unit</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Due date</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {paymentRows.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
            {paymentRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  No rent charges yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
