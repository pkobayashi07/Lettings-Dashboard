import * as z from "zod";
import type { TenancyStatus } from "@prisma/client";

export const TENANCY_PIPELINE: TenancyStatus[] = [
  "ENQUIRY",
  "VIEWING",
  "REFERENCING",
  "OFFER",
  "SIGNED",
  "ACTIVE",
  "ENDING",
  "ENDED",
];

export const TENANCY_STATUS_LABELS: Record<TenancyStatus, string> = {
  ENQUIRY: "Enquiry",
  VIEWING: "Viewing",
  REFERENCING: "Referencing",
  OFFER: "Offer",
  SIGNED: "Signed",
  ACTIVE: "Active",
  ENDING: "Ending",
  ENDED: "Ended",
};

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

const optionalString = () =>
  z.preprocess(emptyToUndefined, z.string().trim().optional());

const optionalEmail = () =>
  z.preprocess(
    emptyToUndefined,
    z.email({ error: "Enter a valid email." }).optional()
  );

export type FormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export const CreateLandlordSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required." }),
  email: optionalEmail(),
  phone: optionalString(),
});

export const CreatePropertySchema = z.object({
  addressLine1: z.string().trim().min(1, { error: "Address is required." }),
  addressLine2: optionalString(),
  city: z.string().trim().min(1, { error: "City is required." }),
  postcode: z.string().trim().min(1, { error: "Postcode is required." }),
  landlordId: optionalString(),
});

export const CreateUnitSchema = z.object({
  propertyId: z.string().trim().min(1),
  label: z.string().trim().min(1, { error: "Unit label is required." }),
  bedrooms: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: "Enter a whole number." })
      .int()
      .min(0)
      .optional()
  ),
  rentAmount: z.preprocess(
    emptyToUndefined,
    z.coerce.number({ error: "Enter a rent amount." }).positive().optional()
  ),
});

export const CreateTenantSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required." }),
  email: optionalEmail(),
  phone: optionalString(),
});

export const CreateTenancySchema = z.object({
  tenantId: z.string().trim().min(1, { error: "Select a tenant." }),
  unitId: z.string().trim().min(1, { error: "Select a unit." }),
  rentAmount: z.coerce
    .number({ error: "Enter a rent amount." })
    .positive({ error: "Rent must be greater than zero." }),
});
