import * as z from "zod";
import type { ComplianceItemType } from "@prisma/client";
import { emptyToUndefined, optionalString } from "@/lib/zod-helpers";

export type { FormState } from "@/lib/form-state";

export const COMPLIANCE_TYPE_LABELS: Record<ComplianceItemType, string> = {
  GAS_SAFETY: "Gas Safety Certificate",
  EPC: "EPC",
  ELECTRICAL_SAFETY: "Electrical Safety Certificate",
  FIRE_ALARM: "Fire Alarm Test",
  INSURANCE: "Insurance",
  OTHER: "Other",
};

export const COMPLIANCE_TYPES: ComplianceItemType[] = [
  "GAS_SAFETY",
  "EPC",
  "ELECTRICAL_SAFETY",
  "FIRE_ALARM",
  "INSURANCE",
  "OTHER",
];

export const COMPLIANCE_DUE_SOON_DAYS = 60;

export const CreateComplianceItemSchema = z.object({
  propertyId: z.string().trim().min(1, { error: "Select a property." }),
  type: z.enum(
    ["GAS_SAFETY", "EPC", "ELECTRICAL_SAFETY", "FIRE_ALARM", "INSURANCE", "OTHER"],
    { error: "Select a type." }
  ),
  label: optionalString(),
  issuedDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  expiryDate: z.coerce.date({ error: "Enter an expiry date." }),
  notes: optionalString(),
});
