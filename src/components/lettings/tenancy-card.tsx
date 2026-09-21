import { advanceTenancy, endTenancy } from "@/lib/lettings/actions";
import { TENANCY_PIPELINE, TENANCY_STATUS_LABELS } from "@/lib/lettings/definitions";
import { secondaryButtonClass } from "@/components/ui/form";
import type { TenancyStatus } from "@prisma/client";

export type TenancyCardData = {
  id: string;
  status: TenancyStatus;
  rentAmount: number;
  startDate: Date | null;
  endDate: Date | null;
  leaseEndDate: Date | null;
  tenant: { name: string };
  unit: { label: string; property: { addressLine1: string; city: string } };
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export function TenancyCard({ tenancy }: { tenancy: TenancyCardData }) {
  const currentIndex = TENANCY_PIPELINE.indexOf(tenancy.status);
  const nextStatus = TENANCY_PIPELINE[currentIndex + 1];
  const isEnded = tenancy.status === "ENDED";

  return (
    <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
        {tenancy.tenant.name}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {tenancy.unit.property.addressLine1}, {tenancy.unit.property.city} — {tenancy.unit.label}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        £{tenancy.rentAmount.toLocaleString()} pcm
      </p>
      {tenancy.startDate && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Start: {dateFormatter.format(tenancy.startDate)}
        </p>
      )}
      {tenancy.endDate && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          End: {dateFormatter.format(tenancy.endDate)}
        </p>
      )}
      {tenancy.leaseEndDate && tenancy.status === "ACTIVE" && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Lease ends: {dateFormatter.format(tenancy.leaseEndDate)}
        </p>
      )}
      {!isEnded && (
        <div className="flex gap-2 pt-1">
          {nextStatus && (
            <form action={advanceTenancy}>
              <input type="hidden" name="tenancyId" value={tenancy.id} />
              <button type="submit" className={secondaryButtonClass}>
                Advance to {TENANCY_STATUS_LABELS[nextStatus]}
              </button>
            </form>
          )}
          {tenancy.status !== "ENDING" && (
            <form action={endTenancy}>
              <input type="hidden" name="tenancyId" value={tenancy.id} />
              <button type="submit" className={secondaryButtonClass}>
                End tenancy
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
