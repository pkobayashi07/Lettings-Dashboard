-- AlterEnum
BEGIN;
CREATE TYPE "TenancyStatus_new" AS ENUM ('ENQUIRY', 'VIEWING', 'REFERENCING', 'OFFER', 'SIGNED', 'ACTIVE', 'ENDING', 'ENDED');
ALTER TABLE "public"."Tenancy" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tenancy" ALTER COLUMN "status" TYPE "TenancyStatus_new" USING ("status"::text::"TenancyStatus_new");
ALTER TYPE "TenancyStatus" RENAME TO "TenancyStatus_old";
ALTER TYPE "TenancyStatus_new" RENAME TO "TenancyStatus";
DROP TYPE "public"."TenancyStatus_old";
ALTER TABLE "Tenancy" ALTER COLUMN "status" SET DEFAULT 'ENQUIRY';
COMMIT;

-- AlterTable
ALTER TABLE "Tenancy" ALTER COLUMN "status" SET DEFAULT 'ENQUIRY';

