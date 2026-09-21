"use client";

import { useActionState } from "react";
import { createTenancy } from "@/lib/lettings/actions";
import { inputClass, labelClass, primaryButtonClass, FieldError, FormMessage } from "@/components/ui/form";

export function NewTenancyForm({
  tenants,
  units,
}: {
  tenants: { id: string; name: string }[];
  units: { id: string; label: string; propertyAddress: string; rentAmount: number | null }[];
}) {
  const [state, action, pending] = useActionState(createTenancy, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">New application</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="tenantId">Tenant</label>
          <select id="tenantId" name="tenantId" className={inputClass} required defaultValue="">
            <option value="" disabled>Select tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
            ))}
          </select>
          <FieldError messages={state?.errors?.tenantId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="unitId">Unit</label>
          <select id="unitId" name="unitId" className={inputClass} required defaultValue="">
            <option value="" disabled>Select unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.propertyAddress} — {unit.label}
              </option>
            ))}
          </select>
          <FieldError messages={state?.errors?.unitId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="rentAmount">Agreed rent (pcm)</label>
          <input id="rentAmount" name="rentAmount" type="number" min="0" step="0.01" className={inputClass} required />
          <FieldError messages={state?.errors?.rentAmount} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Creating..." : "Create application"}
        </button>
        <FormMessage message={state?.message} />
      </div>
    </form>
  );
}
