/*
  Warnings:

  - You are about to drop the column `bencanaId` on the `Donate` table. All the data in the column will be lost.
  - You are about to drop the column `bencanaId` on the `News` table. All the data in the column will be lost.
  - You are about to drop the `Bencana` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `campaignId` to the `Donate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CampaignCategory" AS ENUM ('NATURAL_DISASTER', 'SOCIAL', 'HEALTH', 'EDUCATION', 'ENVIRONMENT', 'ANIMAL_WELFARE', 'COMMUNITY', 'EMERGENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('DISASTER', 'CHARITY', 'EVENT', 'FUNDRAISER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NewsCategory" ADD VALUE 'CAMPAIGN_UPDATE';
ALTER TYPE "NewsCategory" ADD VALUE 'ACHIEVEMENT';

-- DropForeignKey
ALTER TABLE "Donate" DROP CONSTRAINT "Donate_bencanaId_fkey";

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_bencanaId_fkey";

-- DropIndex
DROP INDEX "Donate_bencanaId_idx";

-- DropIndex
DROP INDEX "News_bencanaId_idx";

-- AlterTable
ALTER TABLE "Donate" DROP COLUMN "bencanaId",
ADD COLUMN     "campaignId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "bencanaId",
ADD COLUMN     "campaignId" TEXT;

-- DropTable
DROP TABLE "Bencana";

-- DropEnum
DROP TYPE "BencanaCategory";

-- DropEnum
DROP TYPE "SeverityLevel";

-- DropEnum
DROP TYPE "StatusBencana";

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "province" TEXT,
    "city" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "targetDonation" DECIMAL(15,2),
    "totalDonation" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalDonors" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "category" "CampaignCategory" NOT NULL,
    "type" "CampaignType" NOT NULL DEFAULT 'CHARITY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_category_idx" ON "Campaign"("category");

-- CreateIndex
CREATE INDEX "Campaign_type_idx" ON "Campaign"("type");

-- CreateIndex
CREATE INDEX "Campaign_startDate_idx" ON "Campaign"("startDate");

-- CreateIndex
CREATE INDEX "Donate_campaignId_idx" ON "Donate"("campaignId");

-- CreateIndex
CREATE INDEX "News_campaignId_idx" ON "News"("campaignId");

-- CreateIndex
CREATE INDEX "News_slug_idx" ON "News"("slug");

-- AddForeignKey
ALTER TABLE "Donate" ADD CONSTRAINT "Donate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
