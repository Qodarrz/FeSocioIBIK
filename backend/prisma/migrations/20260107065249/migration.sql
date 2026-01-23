-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "StatusBencana" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "BencanaCategory" AS ENUM ('NATURAL', 'SOCIAL', 'HEALTH', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CREDIT_CARD', 'E_WALLET', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('DISASTER_UPDATE', 'SUCCESS_STORY', 'DONATION_REPORT', 'EDUCATION', 'GENERAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bencana" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "province" TEXT,
    "city" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "StatusBencana" NOT NULL DEFAULT 'ACTIVE',
    "targetDonation" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalDonation" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalDonors" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "severity" "SeverityLevel",
    "category" "BencanaCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bencana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donate" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bencanaId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "message" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "donorName" TEXT,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "paymentId" TEXT,
    "paymentProof" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonateLog" (
    "id" TEXT NOT NULL,
    "donateId" TEXT NOT NULL,
    "oldStatus" "PaymentStatus",
    "newStatus" "PaymentStatus" NOT NULL,
    "note" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonateLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "author" TEXT NOT NULL,
    "bencanaId" TEXT,
    "category" "NewsCategory" NOT NULL,
    "tags" TEXT[],
    "imageUrl" TEXT,
    "thumbnailUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Bencana_status_idx" ON "Bencana"("status");

-- CreateIndex
CREATE INDEX "Bencana_category_idx" ON "Bencana"("category");

-- CreateIndex
CREATE INDEX "Bencana_startDate_idx" ON "Bencana"("startDate");

-- CreateIndex
CREATE INDEX "Donate_userId_idx" ON "Donate"("userId");

-- CreateIndex
CREATE INDEX "Donate_bencanaId_idx" ON "Donate"("bencanaId");

-- CreateIndex
CREATE INDEX "Donate_paymentStatus_idx" ON "Donate"("paymentStatus");

-- CreateIndex
CREATE INDEX "Donate_createdAt_idx" ON "Donate"("createdAt");

-- CreateIndex
CREATE INDEX "Donate_paymentId_idx" ON "Donate"("paymentId");

-- CreateIndex
CREATE INDEX "DonateLog_donateId_idx" ON "DonateLog"("donateId");

-- CreateIndex
CREATE INDEX "DonateLog_createdAt_idx" ON "DonateLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_bencanaId_idx" ON "News"("bencanaId");

-- CreateIndex
CREATE INDEX "News_category_idx" ON "News"("category");

-- CreateIndex
CREATE INDEX "News_isPublished_idx" ON "News"("isPublished");

-- CreateIndex
CREATE INDEX "News_publishedAt_idx" ON "News"("publishedAt");

-- AddForeignKey
ALTER TABLE "Donate" ADD CONSTRAINT "Donate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donate" ADD CONSTRAINT "Donate_bencanaId_fkey" FOREIGN KEY ("bencanaId") REFERENCES "Bencana"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonateLog" ADD CONSTRAINT "DonateLog_donateId_fkey" FOREIGN KEY ("donateId") REFERENCES "Donate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonateLog" ADD CONSTRAINT "DonateLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_bencanaId_fkey" FOREIGN KEY ("bencanaId") REFERENCES "Bencana"("id") ON DELETE SET NULL ON UPDATE CASCADE;
