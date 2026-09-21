"use client";

import { useActionState } from "react";
import { createComplianceItem } from "@/lib/admin/actions";
import { COMPLIANCE_TYPES, COMPLIANCE_TYPE_LABELS } from "@/lib/admin/definitions";
import { inputClass, labelClass, primaryButtonClass, FieldError, FormMessage } from "@/components/ui/form";

export function NewComplianceItemForm({
  properties,
}: {
  properties: { id: string; address: string }[];
}) {
  const [state, action, pending] = useActionState(createComplianceItem, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Add compliance item</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="propertyId">Property</label>
          <select id="propertyId" name="propertyId" className={inputClass} required defaultValue="">
            <option value="" disabled>Select property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>{property.address}</option>
            ))}
          </select>
          <FieldError messages={state?.errors?.propertyId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="type">Type</label>
          <select id="type" name="type" className={inputClass} defaultValue="GAS_SAFETY">
            {COMPLIANCE_TYPES.map((type) => (
              <option key={type} value={type}>{COMPLIANCE_TYPE_LABELS[type]}</option>
            ))}
          </select>
          <FieldError messages={state?.errors?.type} />
        </div>
        <div>
          <label className={labelClass} htmlFor="label">Label (optional)</label>
          <input id="label" name="label" className={inputClass} placeholder="e.g. Boiler cert" />
        </div>
        <div>
          <label className={labelClass} htmlFor="issuedDate">Issued date (optional)</label>
          <input id="issuedDate" name="issuedDate" type="date" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="expiryDate">Expiry date</label>
          <input id="expiryDate" name="expiryDate" type="date" className={inputClass} required />
          <FieldError messages={state?.errors?.expiryDate} />
        </div>
        <div>
          <label className={labelClass} htmlFor="notes">Notes (optional)</label>
          <input id="notes" name="notes" className={inputClass} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Adding..." : "Add item"}
        </button>
        <FormMessage message={state?.message} />
      </div>
    </form>
  );
}
