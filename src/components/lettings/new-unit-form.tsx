"use client";

import { useActionState } from "react";
import { createUnit } from "@/lib/lettings/actions";
import { inputClass, labelClass, primaryButtonClass, FieldError, FormMessage } from "@/components/ui/form";

export function NewUnitForm({ propertyId }: { propertyId: string }) {
  const [state, action, pending] = useActionState(createUnit, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Add unit</h2>
      <input type="hidden" name="propertyId" value={propertyId} />
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="label">Unit label</label>
          <input id="label" name="label" className={inputClass} placeholder="Flat 2" required />
          <FieldError messages={state?.errors?.label} />
        </div>
        <div>
          <label className={labelClass} htmlFor="bedrooms">Bedrooms</label>
          <input id="bedrooms" name="bedrooms" type="number" min="0" className={inputClass} />
          <FieldError messages={state?.errors?.bedrooms} />
        </div>
        <div>
          <label className={labelClass} htmlFor="rentAmount">Rent (pcm)</label>
          <input id="rentAmount" name="rentAmount" type="number" min="0" step="0.01" className={inputClass} />
          <FieldError messages={state?.errors?.rentAmount} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Adding..." : "Add unit"}
        </button>
        <FormMessage message={state?.message} />
      </div>
    </form>
  );
}
