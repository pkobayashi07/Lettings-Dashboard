"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDepartment } from "@/lib/require-department";
import {
  CreateLandlordSchema,
  CreatePropertySchema,
  CreateTenancySchema,
  CreateTenantSchema,
  CreateUnitSchema,
  TENANCY_PIPELINE,
  type FormState,
} from "@/lib/lettings/definitions";

export async function createLandlord(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("LETTINGS");

  const validated = CreateLandlordSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.landlord.create({
    data: { ...validated.data, organizationId: user.organizationId },
  });

  revalidatePath("/lettings/landlords");
  return { message: "Landlord added." };
}

export async function createProperty(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("LETTINGS");

  const validated = CreatePropertySchema.safeParse({
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    postcode: formData.get("postcode"),
    landlordId: formData.get("landlordId"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { landlordId, ...rest } = validated.data;

  await prisma.property.create({
    data: {
      ...rest,
      organizationId: user.organizationId,
      landlordId: landlordId || null,
    },
  });

  revalidatePath("/lettings/properties");
  return { message: "Property added." };
}

export async function createUnit(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  await requireDepartment("LETTINGS");

  const validated = CreateUnitSchema.safeParse({
    propertyId: formData.get("propertyId"),
    label: formData.get("label"),
    bedrooms: formData.get("bedrooms"),
    rentAmount: formData.get("rentAmount"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { propertyId, ...rest } = validated.data;

  await prisma.unit.create({
    data: { ...rest, propertyId },
  });

  revalidatePath(`/lettings/properties/${propertyId}`);
  return { message: "Unit added." };
}

export async function createTenant(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("LETTINGS");

  const validated = CreateTenantSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.tenant.create({
    data: { ...validated.data, organizationId: user.organizationId },
  });

  revalidatePath("/lettings/tenants");
  return { message: "Tenant added." };
}

export async function createTenancy(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireDepartment("LETTINGS");

  const validated = CreateTenancySchema.safeParse({
    tenantId: formData.get("tenantId"),
    unitId: formData.get("unitId"),
    rentAmount: formData.get("rentAmount"),
    leaseEndDate: formData.get("leaseEndDate"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const [tenant, unit] = await Promise.all([
    prisma.tenant.findFirst({
      where: { id: validated.data.tenantId, organizationId: user.organizationId },
    }),
    prisma.unit.findFirst({
      where: {
        id: validated.data.unitId,
        property: { organizationId: user.organizationId },
      },
    }),
  ]);

  if (!tenant || !unit) {
    return { message: "Selected tenant or unit could not be found." };
  }

  await prisma.tenancy.create({
    data: {
      tenantId: tenant.id,
      unitId: unit.id,
      rentAmount: validated.data.rentAmount,
      leaseEndDate: validated.data.leaseEndDate,
    },
  });

  revalidatePath("/lettings");
  return { message: "Application created." };
}

async function assertTenancyInOrg(tenancyId: string, organizationId: string) {
  const tenancy = await prisma.tenancy.findFirst({
    where: { id: tenancyId, unit: { property: { organizationId } } },
  });

  if (!tenancy) {
    throw new Error("Tenancy not found.");
  }

  return tenancy;
}

export async function advanceTenancy(formData: FormData) {
  const user = await requireDepartment("LETTINGS");
  const tenancyId = String(formData.get("tenancyId") ?? "");

  const tenancy = await assertTenancyInOrg(tenancyId, user.organizationId);

  const currentIndex = TENANCY_PIPELINE.indexOf(tenancy.status);
  const nextStatus = TENANCY_PIPELINE[currentIndex + 1];

  if (!nextStatus) return;

  await prisma.tenancy.update({
    where: { id: tenancy.id },
    data: {
      status: nextStatus,
      startDate: nextStatus === "ACTIVE" ? (tenancy.startDate ?? new Date()) : tenancy.startDate,
      endDate: nextStatus === "ENDED" ? (tenancy.endDate ?? new Date()) : tenancy.endDate,
    },
  });

  revalidatePath("/lettings");
}

export async function endTenancy(formData: FormData) {
  const user = await requireDepartment("LETTINGS");
  const tenancyId = String(formData.get("tenancyId") ?? "");

  const tenancy = await assertTenancyInOrg(tenancyId, user.organizationId);

  await prisma.tenancy.update({
    where: { id: tenancy.id },
    data: { status: "ENDED", endDate: tenancy.endDate ?? new Date() },
  });

  revalidatePath("/lettings");
}
