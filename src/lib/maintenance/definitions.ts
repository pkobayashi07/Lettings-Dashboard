import * as z from "zod";
import type { TicketPriority, TicketStatus } from "@prisma/client";
import { optionalString, optionalEmail } from "@/lib/zod-helpers";

export type { FormState } from "@/lib/form-state";

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  ON_HOLD: "On hold",
  RESOLVED: "Resolved",
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const TICKET_PRIORITIES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export const TICKET_BOARD_COLUMNS: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "ON_HOLD",
  "RESOLVED",
];

export const CreateContractorSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required." }),
  trade: optionalString(),
  email: optionalEmail(),
  phone: optionalString(),
});

export const CreateTicketSchema = z.object({
  unitId: z.string().trim().min(1, { error: "Select a unit." }),
  title: z.string().trim().min(1, { error: "Title is required." }),
  description: z.string().trim().min(1, { error: "Description is required." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
    error: "Select a priority.",
  }),
  contractorId: optionalString(),
});
