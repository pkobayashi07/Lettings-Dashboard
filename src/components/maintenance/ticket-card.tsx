import { setTicketStatus } from "@/lib/maintenance/actions";
import { secondaryButtonClass } from "@/components/ui/form";
import type { TicketPriority, TicketStatus } from "@prisma/client";

export type TicketCardData = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  unit: { label: string; property: { addressLine1: string; city: string } };
  contractor: { name: string } | null;
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  LOW: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  HIGH: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function StatusButton({
  ticketId,
  targetStatus,
  label,
}: {
  ticketId: string;
  targetStatus: TicketStatus;
  label: string;
}) {
  return (
    <form action={setTicketStatus}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <input type="hidden" name="status" value={targetStatus} />
      <button type="submit" className={secondaryButtonClass}>
        {label}
      </button>
    </form>
  );
}

export function TicketCard({ ticket }: { ticket: TicketCardData }) {
  return (
    <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">{ticket.title}</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRIORITY_STYLES[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {ticket.unit.property.addressLine1}, {ticket.unit.property.city} — {ticket.unit.label}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{ticket.description}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        {ticket.contractor ? `Assigned: ${ticket.contractor.name}` : "Unassigned"}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {ticket.status === "OPEN" && (
          <StatusButton ticketId={ticket.id} targetStatus="IN_PROGRESS" label="Start work" />
        )}
        {ticket.status === "IN_PROGRESS" && (
          <>
            <StatusButton ticketId={ticket.id} targetStatus="RESOLVED" label="Resolve" />
            <StatusButton ticketId={ticket.id} targetStatus="ON_HOLD" label="Put on hold" />
          </>
        )}
        {ticket.status === "ON_HOLD" && (
          <StatusButton ticketId={ticket.id} targetStatus="IN_PROGRESS" label="Resume" />
        )}
        {ticket.status === "RESOLVED" && (
          <StatusButton ticketId={ticket.id} targetStatus="OPEN" label="Reopen" />
        )}
      </div>
    </div>
  );
}
