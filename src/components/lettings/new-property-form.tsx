"use client";

import { useActionState } from "react";
import { createProperty } from "@/lib/lettings/actions";
import { inputClass, labelClass, primaryButtonClass, FieldError, FormMessage } from "@/components/ui/form";

export function NewPropertyForm({
  landlords,
}: {
  landlords: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createProperty, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Add property</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="addressLine1">Address line 1</label>
          <input id="addressLine1" name="addressLine1" className={inputClass} required />
          <FieldError messages={state?.errors?.addressLine1} />
        </div>
        <div>
          <label className={labelClass} htmlFor="addressLine2">Address line 2</label>
          <input id="addressLine2" name="addressLine2" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">City</label>
          <input id="city" name="city" className={inputClass} required />
          <FieldError messages={state?.errors?.city} />
        </div>
        <div>
          <label className={labelClass} htmlFor="postcode">Postcode</label>
          <input id="postcode" name="postcode" className={inputClass} required />
          <FieldError messages={state?.errors?.postcode} />
        </div>
        <div>
          <label className={labelClass} htmlFor="landlordId">Landlord</label>
          <select id="landlordId" name="landlordId" className={inputClass} defaultValue="">
            <option value="">None</option>
            {landlords.map((landlord) => (
              <option key={landlord.id} value={landlord.id}>
                {landlord.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Adding..." : "Add property"}
        </button>
        <FormMessage message={state?.message} />
      </div>
    </form>
  );
}
