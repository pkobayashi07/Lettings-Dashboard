import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: "seed-org" },
    update: { name: "Bucknell Property" },
    create: {
      id: "seed-org",
      name: "Bucknell Property",
    },
  });

  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      name: "Alex Admin",
      department: "ADMIN",
      role: "OWNER",
      organizationId: organization.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "lettings@example.com" },
    update: {},
    create: {
      email: "lettings@example.com",
      passwordHash,
      name: "Lettie Ings",
      department: "LETTINGS",
      role: "STAFF",
      organizationId: organization.id,
    },
  });

  const landlord = await prisma.landlord.upsert({
    where: { id: "seed-landlord" },
    update: {},
    create: {
      id: "seed-landlord",
      name: "Jordan Blake",
      email: "jordan.blake@example.com",
      phone: "07700 900123",
      organizationId: organization.id,
    },
  });

  const property = await prisma.property.upsert({
    where: { id: "seed-property" },
    update: {},
    create: {
      id: "seed-property",
      addressLine1: "12 Maple Court",
      city: "Manchester",
      postcode: "M1 4AB",
      organizationId: organization.id,
      landlordId: landlord.id,
    },
  });

  const unit = await prisma.unit.upsert({
    where: { id: "seed-unit" },
    update: {},
    create: {
      id: "seed-unit",
      propertyId: property.id,
      label: "Flat 1",
      bedrooms: 2,
      rentAmount: 950,
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { id: "seed-tenant" },
    update: {},
    create: {
      id: "seed-tenant",
      name: "Sam Rivera",
      email: "sam.rivera@example.com",
      phone: "07700 900456",
      organizationId: organization.id,
    },
  });

  await prisma.tenancy.upsert({
    where: { id: "seed-tenancy" },
    update: {},
    create: {
      id: "seed-tenancy",
      unitId: unit.id,
      tenantId: tenant.id,
      status: "VIEWING",
      rentAmount: 950,
    },
  });

  await prisma.user.upsert({
    where: { email: "maintenance@example.com" },
    update: {},
    create: {
      email: "maintenance@example.com",
      passwordHash,
      name: "Max Tenance",
      department: "MAINTENANCE",
      role: "STAFF",
      organizationId: organization.id,
    },
  });

  const contractor = await prisma.contractor.upsert({
    where: { id: "seed-contractor" },
    update: {},
    create: {
      id: "seed-contractor",
      name: "Riverside Plumbing Ltd",
      trade: "Plumbing",
      email: "jobs@riversideplumbing.example.com",
      phone: "07700 900789",
      organizationId: organization.id,
    },
  });

  await prisma.maintenanceTicket.upsert({
    where: { id: "seed-ticket" },
    update: {},
    create: {
      id: "seed-ticket",
      unitId: unit.id,
      title: "Leaking kitchen tap",
      description: "Tenant reports a steady drip from the kitchen mixer tap.",
      status: "OPEN",
      priority: "MEDIUM",
      contractorId: contractor.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "finance@example.com" },
    update: {},
    create: {
      email: "finance@example.com",
      passwordHash,
      name: "Fin Anders",
      department: "FINANCE",
      role: "STAFF",
      organizationId: organization.id,
    },
  });

  const property2 = await prisma.property.upsert({
    where: { id: "seed-property-2" },
    update: {},
    create: {
      id: "seed-property-2",
      addressLine1: "45 Oak Street",
      city: "Leeds",
      postcode: "LS2 3EF",
      organizationId: organization.id,
      landlordId: landlord.id,
    },
  });

  const unit2 = await prisma.unit.upsert({
    where: { id: "seed-unit-2" },
    update: {},
    create: {
      id: "seed-unit-2",
      propertyId: property2.id,
      label: "Flat 2B",
      bedrooms: 1,
      rentAmount: 800,
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { id: "seed-tenant-2" },
    update: {},
    create: {
      id: "seed-tenant-2",
      name: "Taylor Morgan",
      email: "taylor.morgan@example.com",
      phone: "07700 900654",
      organizationId: organization.id,
    },
  });

  const leaseEndDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);

  const activeTenancy = await prisma.tenancy.upsert({
    where: { id: "seed-tenancy-2" },
    update: { leaseEndDate },
    create: {
      id: "seed-tenancy-2",
      unitId: unit2.id,
      tenantId: tenant2.id,
      status: "ACTIVE",
      rentAmount: 800,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      leaseEndDate,
    },
  });

  await prisma.payment.upsert({
    where: { id: "seed-payment-paid" },
    update: {},
    create: {
      id: "seed-payment-paid",
      tenancyId: activeTenancy.id,
      amount: 800,
      dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      paidDate: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
      status: "PAID",
    },
  });

  await prisma.payment.upsert({
    where: { id: "seed-payment-overdue" },
    update: {},
    create: {
      id: "seed-payment-overdue",
      tenancyId: activeTenancy.id,
      amount: 800,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "PENDING",
    },
  });

  await prisma.complianceItem.upsert({
    where: { id: "seed-compliance-expired" },
    update: {},
    create: {
      id: "seed-compliance-expired",
      propertyId: property.id,
      type: "GAS_SAFETY",
      expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.complianceItem.upsert({
    where: { id: "seed-compliance-due-soon" },
    update: {},
    create: {
      id: "seed-compliance-due-soon",
      propertyId: property2.id,
      type: "EPC",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.complianceItem.upsert({
    where: { id: "seed-compliance-valid" },
    update: {},
    create: {
      id: "seed-compliance-valid",
      propertyId: property2.id,
      type: "ELECTRICAL_SAFETY",
      expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(
    "Seeded organization, users, landlord, properties, units, tenants, tenancies, contractor, ticket, payments, and compliance items."
  );
  console.log(
    "Login as admin@example.com, lettings@example.com, maintenance@example.com, or finance@example.com (password: password123)"
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
