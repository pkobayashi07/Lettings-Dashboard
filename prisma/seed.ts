import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: "seed-org" },
    update: {},
    create: {
      id: "seed-org",
      name: "Acme Property Management",
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

  console.log(
    "Seeded organization, users, landlord, property, unit, tenant, tenancy, contractor, and a sample ticket."
  );
  console.log(
    "Login as admin@example.com, lettings@example.com, or maintenance@example.com (password: password123)"
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
