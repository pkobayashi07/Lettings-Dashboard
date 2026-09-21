-- CreateEnum
CREATE TYPE "ComplianceItemType" AS ENUM ('GAS_SAFETY', 'EPC', 'ELECTRICAL_SAFETY', 'FIRE_ALARM', 'INSURANCE', 'OTHER');

-- AlterTable
ALTER TABLE "Tenancy" ADD COLUMN     "leaseEndDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ComplianceItem" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" "ComplianceItemType" NOT NULL,
    "label" TEXT,
    "issuedDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ComplianceItem_propertyId_idx" ON "ComplianceItem"("propertyId");

-- AddForeignKey
ALTER TABLE "ComplianceItem" ADD CONSTRAINT "ComplianceItem_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
