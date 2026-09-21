"use client";

import { useActionState } from "react";
import { createTicket } from "@/lib/maintenance/actions";
import { TICKET_PRIORITIES, TICKET_PRIORITY_LABELS } from "@/lib/maintenance/definitions";
import { inputClass, labelClass, primaryButtonClass, FieldError, FormMessage } from "@/components/ui/form";

export function NewTicketForm({
  units,
  contractors,
}: {
  units: { id: string; label: string; propertyAddress: string }[];
  contractors: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createTicket, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">New ticket</h2>
      <div className="grid gap-3 sm:grid-cols-2">
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
          <label className={labelClass} htmlFor="title">Title</label>
          <input id="title" name="title" className={inputClass} required />
          <FieldError messages={state?.errors?.title} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={2} className={inputClass} required />
          <FieldError messages={state?.errors?.description} />
        </div>
        <div>
          <label className={labelClass} htmlFor="priority">Priority</label>
          <select id="priority" name="priority" className={inputClass} defaultValue="MEDIUM">
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {TICKET_PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
          <FieldError messages={state?.errors?.priority} />
        </div>
        <div>
          <label className={labelClass} htmlFor="contractorId">Assign contractor</label>
          <select id="contractorId" name="contractorId" className={inputClass} defaultValue="">
            <option value="">Unassigned</option>
            {contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Creating..." : "Create ticket"}
        </button>
        <FormMessage message={state?.message} />
      </div>
    </form>
  );
}
