import { markPaymentPaid } from "@/lib/finance/actions";
import { secondaryButtonClass } from "@/components/ui/form";
import type { PaymentStatus } from "@prisma/client";

export type PaymentRowData = {
  id: string;
  amount: number;
  dueDate: Date;
  paidDate: Date | null;
  status: PaymentStatus;
  tenancy: {
    tenant: { name: string };
    unit: { label: string; property: { addressLine1: string; city: string } };
  };
};

const STATUS_STYLES: Record<"PENDING" | "PAID" | "OVERDUE", string> = {
  PENDING: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  PAID: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  OVERDUE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export function PaymentRow({ payment }: { payment: PaymentRowData }) {
  const isOverdue = payment.status === "PENDING" && payment.dueDate < new Date();
  const displayStatus = isOverdue ? "OVERDUE" : payment.status;

  return (
    <tr>
      <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-50">
        {payment.tenancy.tenant.name}
      </td>
      <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
        {payment.tenancy.unit.property.addressLine1}, {payment.tenancy.unit.property.city} — {payment.tenancy.unit.label}
      </td>
      <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
        £{payment.amount.toLocaleString()}
      </td>
      <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
        {dateFormatter.format(payment.dueDate)}
      </td>
      <td className="px-4 py-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[displayStatus]}`}>
          {displayStatus}
        </span>
      </td>
      <td className="px-4 py-2">
        {payment.status === "PAID" ? (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Paid {payment.paidDate ? dateFormatter.format(payment.paidDate) : ""}
          </span>
        ) : (
          <form action={markPaymentPaid}>
            <input type="hidden" name="paymentId" value={payment.id} />
            <button type="submit" className={secondaryButtonClass}>
              Mark as paid
            </button>
          </form>
        )}
      </td>
    </tr>
  );
}
