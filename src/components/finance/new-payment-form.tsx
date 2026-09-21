"use client";

import { useActionState } from "react";
import { createPayment } from "@/lib/finance/actions";
import { inputClass, labelClass, primaryButtonClass, FieldError, FormMessage } from "@/components/ui/form";

export function NewPaymentForm({
  tenancies,
}: {
  tenancies: { id: string; tenantName: string; unitLabel: string; propertyAddress: string; rentAmount: number }[];
}) {
  const [state, action, pending] = useActionState(createPayment, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Add rent charge</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="tenancyId">Tenancy</label>
          <select id="tenancyId" name="tenancyId" className={inputClass} required defaultValue="">
            <option value="" disabled>Select tenancy</option>
            {tenancies.map((tenancy) => (
              <option key={tenancy.id} value={tenancy.id}>
                {tenancy.tenantName} — {tenancy.propertyAddress}, {tenancy.unitLabel}
              </option>
            ))}
          </select>
          <FieldError messages={state?.errors?.tenancyId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="amount">Amount</label>
          <input id="amount" name="amount" type="number" min="0" step="0.01" className={inputClass} required />
          <FieldError messages={state?.errors?.amount} />
        </div>
        <div>
          <label className={labelClass} htmlFor="dueDate">Due date</label>
          <input id="dueDate" name="dueDate" type="date" className={inputClass} required />
          <FieldError messages={state?.errors?.dueDate} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Adding..." : "Add charge"}
        </button>
        <FormMessage message={state?.message} />
      </div>
    </form>
  );
}
