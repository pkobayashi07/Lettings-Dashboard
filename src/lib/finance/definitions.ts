import * as z from "zod";
import type { PaymentStatus } from "@prisma/client";

export type { FormState } from "@/lib/form-state";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
};

export const CreatePaymentSchema = z.object({
  tenancyId: z.string().trim().min(1, { error: "Select a tenancy." }),
  amount: z.coerce
    .number({ error: "Enter an amount." })
    .positive({ error: "Amount must be greater than zero." }),
  dueDate: z.coerce.date({ error: "Enter a due date." }),
});
