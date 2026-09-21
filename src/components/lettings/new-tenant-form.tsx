"use client";

import { useActionState } from "react";
import { createTenant } from "@/lib/lettings/actions";
import { inputClass, labelClass, primaryButtonClass, FieldError, FormMessage } from "@/components/ui/form";

export function NewTenantForm() {
  const [state, action, pending] = useActionState(createTenant, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Add tenant</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" name="name" className={inputClass} required />
          <FieldError messages={state?.errors?.name} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={inputClass} />
          <FieldError messages={state?.errors?.email} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className={inputClass} />
          <FieldError messages={state?.errors?.phone} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Adding..." : "Add tenant"}
        </button>
        <FormMessage message={state?.message} />
      </div>
    </form>
  );
}
