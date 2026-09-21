import { COMPLIANCE_DUE_SOON_DAYS, COMPLIANCE_TYPE_LABELS } from "@/lib/admin/definitions";
import type { ComplianceItemType } from "@prisma/client";

export type ComplianceItemRowData = {
  id: string;
  type: ComplianceItemType;
  label: string | null;
  expiryDate: Date;
  property: { addressLine1: string; city: string };
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

function getStatus(expiryDate: Date) {
  const now = new Date();
  const dueSoonBy = new Date(now.getTime() + COMPLIANCE_DUE_SOON_DAYS * 24 * 60 * 60 * 1000);

  if (expiryDate < now) return { label: "Expired", style: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" };
  if (expiryDate <= dueSoonBy) return { label: "Due soon", style: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  return { label: "Valid", style: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" };
}

export function ComplianceItemRow({ item }: { item: ComplianceItemRowData }) {
  const status = getStatus(item.expiryDate);

  return (
    <tr>
      <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
        {item.property.addressLine1}, {item.property.city}
      </td>
      <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-50">
        {COMPLIANCE_TYPE_LABELS[item.type]}
        {item.label ? ` — ${item.label}` : ""}
      </td>
      <td className="px-4 py-2 text-neutral-600 dark:text-neutral-400">
        {dateFormatter.format(item.expiryDate)}
      </td>
      <td className="px-4 py-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${status.style}`}>
          {status.label}
        </span>
      </td>
    </tr>
  );
}
