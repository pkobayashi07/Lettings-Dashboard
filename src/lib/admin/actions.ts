"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDepartment } from "@/lib/require-department";
import { CreateComplianceItemSchema, type FormState } from "@/lib/admin/definitions";

export async function createComplianceItem(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("ADMIN");

  const validated = CreateComplianceItemSchema.safeParse({
    propertyId: formData.get("propertyId"),
    type: formData.get("type"),
    label: formData.get("label"),
    issuedDate: formData.get("issuedDate"),
    expiryDate: formData.get("expiryDate"),
    notes: formData.get("notes"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const property = await prisma.property.findFirst({
    where: { id: validated.data.propertyId, organizationId: user.organizationId },
  });

  if (!property) {
    return { message: "Selected property could not be found." };
  }

  await prisma.complianceItem.create({
    data: { ...validated.data, propertyId: property.id },
  });

  revalidatePath("/admin");
  return { message: "Compliance item added." };
}
