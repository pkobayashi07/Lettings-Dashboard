"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDepartment } from "@/lib/require-department";
import {
  CreateContractorSchema,
  CreateTicketSchema,
  type FormState,
} from "@/lib/maintenance/definitions";
import type { TicketStatus } from "@prisma/client";

const VALID_STATUSES: TicketStatus[] = ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED"];

export async function createContractor(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("MAINTENANCE");

  const validated = CreateContractorSchema.safeParse({
    name: formData.get("name"),
    trade: formData.get("trade"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.contractor.create({
    data: { ...validated.data, organizationId: user.organizationId },
  });

  revalidatePath("/maintenance/contractors");
  return { message: "Contractor added." };
}

export async function createTicket(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("MAINTENANCE");

  const validated = CreateTicketSchema.safeParse({
    unitId: formData.get("unitId"),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    contractorId: formData.get("contractorId"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { unitId, contractorId, ...rest } = validated.data;

  const [unit, contractor] = await Promise.all([
    prisma.unit.findFirst({
      where: { id: unitId, property: { organizationId: user.organizationId } },
    }),
    contractorId
      ? prisma.contractor.findFirst({
          where: { id: contractorId, organizationId: user.organizationId },
        })
      : null,
  ]);

  if (!unit) {
    return { message: "Selected unit could not be found." };
  }

  if (contractorId && !contractor) {
    return { message: "Selected contractor could not be found." };
  }

  await prisma.maintenanceTicket.create({
    data: {
      ...rest,
      unitId: unit.id,
      contractorId: contractor?.id,
    },
  });

  revalidatePath("/maintenance");
  return { message: "Ticket created." };
}

export async function setTicketStatus(formData: FormData) {
  const user = await requireDepartment("MAINTENANCE");
  const ticketId = String(formData.get("ticketId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!VALID_STATUSES.includes(status as TicketStatus)) {
    throw new Error("Invalid ticket status.");
  }

  const ticket = await prisma.maintenanceTicket.findFirst({
    where: { id: ticketId, unit: { property: { organizationId: user.organizationId } } },
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  await prisma.maintenanceTicket.update({
    where: { id: ticket.id },
    data: { status: status as TicketStatus },
  });

  revalidatePath("/maintenance");
}
