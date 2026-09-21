"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDepartment } from "@/lib/require-department";
import { CreatePaymentSchema, type FormState } from "@/lib/finance/definitions";

export async function createPayment(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("FINANCE");

  const validated = CreatePaymentSchema.safeParse({
    tenancyId: formData.get("tenancyId"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const tenancy = await prisma.tenancy.findFirst({
    where: {
      id: validated.data.tenancyId,
      unit: { property: { organizationId: user.organizationId } },
    },
  });

  if (!tenancy) {
    return { message: "Selected tenancy could not be found." };
  }

  await prisma.payment.create({
    data: {
      tenancyId: tenancy.id,
      amount: validated.data.amount,
      dueDate: validated.data.dueDate,
    },
  });

  revalidatePath("/finance");
  return { message: "Payment charge added." };
}

export async function markPaymentPaid(formData: FormData) {
  const user = await requireDepartment("FINANCE");
  const paymentId = String(formData.get("paymentId") ?? "");

  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      tenancy: { unit: { property: { organizationId: user.organizationId } } },
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "PAID", paidDate: new Date() },
  });

  revalidatePath("/finance");
}
