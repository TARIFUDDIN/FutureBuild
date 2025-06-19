/*
  Warnings:

  - You are about to drop the column `company` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetter` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `errorMessage` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `followUpSent` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `hrContact` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `jobDescription` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `jobUrl` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `lastStatusUpdate` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `relevanceScore` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `retryCount` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `runId` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `applicationCount` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `companySize` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `jobUrl` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `lastChecked` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `scrapedAt` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the `AutomationProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AutomationRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailAutomation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowExecution` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[externalId,portal]` on the table `ScrapedJob` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Made the column `applicationMethod` on table `JobApplication` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `externalId` to the `ScrapedJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portal` to the `ScrapedJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ScrapedJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `ScrapedJob` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `ScrapedJob` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AutomationProfile" DROP CONSTRAINT "AutomationProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationRun" DROP CONSTRAINT "AutomationRun_profileId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationRun" DROP CONSTRAINT "AutomationRun_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_runId_fkey";

-- DropIndex
DROP INDEX "JobApplication_company_idx";

-- DropIndex
DROP INDEX "JobApplication_platform_idx";

-- DropIndex
DROP INDEX "ScrapedJob_isActive_idx";

-- DropIndex
DROP INDEX "ScrapedJob_jobTitle_idx";

-- DropIndex
DROP INDEX "ScrapedJob_jobUrl_key";

-- DropIndex
DROP INDEX "ScrapedJob_platform_idx";

-- DropIndex
DROP INDEX "ScrapedJob_scrapedAt_idx";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "company",
DROP COLUMN "coverLetter",
DROP COLUMN "createdAt",
DROP COLUMN "errorMessage",
DROP COLUMN "followUpSent",
DROP COLUMN "hrContact",
DROP COLUMN "jobDescription",
DROP COLUMN "jobTitle",
DROP COLUMN "jobUrl",
DROP COLUMN "lastStatusUpdate",
DROP COLUMN "location",
DROP COLUMN "platform",
DROP COLUMN "relevanceScore",
DROP COLUMN "retryCount",
DROP COLUMN "runId",
DROP COLUMN "salary",
ADD COLUMN     "customCoverLetter" TEXT,
ADD COLUMN     "emailContent" TEXT,
ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailSubject" TEXT,
ADD COLUMN     "emailTo" TEXT,
ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "interviewNotes" TEXT,
ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "recommendations" TEXT[],
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "applicationMethod" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScrapedJob" DROP COLUMN "applicationCount",
DROP COLUMN "companySize",
DROP COLUMN "experience",
DROP COLUMN "industry",
DROP COLUMN "isActive",
DROP COLUMN "jobId",
DROP COLUMN "jobTitle",
DROP COLUMN "jobUrl",
DROP COLUMN "lastChecked",
DROP COLUMN "platform",
DROP COLUMN "salary",
DROP COLUMN "scrapedAt",
DROP COLUMN "viewCount",
ADD COLUMN     "aiScore" DOUBLE PRECISION,
ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "applicantsCount" INTEGER,
ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "concerns" TEXT[],
ADD COLUMN     "experienceLevel" TEXT,
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "isRemote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSponsored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matchReasons" TEXT[],
ADD COLUMN     "portal" TEXT NOT NULL,
ADD COLUMN     "postedAt" TIMESTAMP(3),
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "salaryRange" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- DropTable
DROP TABLE "AutomationProfile";

-- DropTable
DROP TABLE "AutomationRun";

-- DropTable
DROP TABLE "EmailAutomation";

-- DropTable
DROP TABLE "WorkflowExecution";

-- CreateTable
CREATE TABLE "AIJobSearchConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "searchFrequency" TEXT NOT NULL DEFAULT 'daily',
    "preferredRoles" TEXT[],
    "preferredLocations" TEXT[],
    "experienceLevel" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "jobTypes" TEXT[],
    "industries" TEXT[],
    "enabledPortals" TEXT[],
    "autoApply" BOOLEAN NOT NULL DEFAULT false,
    "autoGenerateResume" BOOLEAN NOT NULL DEFAULT true,
    "autoGenerateCoverLetter" BOOLEAN NOT NULL DEFAULT true,
    "excludeCompanies" TEXT[],
    "requiredKeywords" TEXT[],
    "excludeKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIJobSearchConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSearchAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalJobsScraped" INTEGER NOT NULL DEFAULT 0,
    "totalApplications" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DOUBLE PRECISION,
    "avgMatchScore" DOUBLE PRECISION,
    "topMatchedSkills" TEXT[],
    "commonRejectionReasons" TEXT[],
    "marketTrends" JSONB,
    "salaryTrends" JSONB,
    "skillsDemand" JSONB,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSearchAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIJobSearchConfig_userId_key" ON "AIJobSearchConfig"("userId");

-- CreateIndex
CREATE INDEX "JobSearchAnalytics_userId_idx" ON "JobSearchAnalytics"("userId");

-- CreateIndex
CREATE INDEX "JobSearchAnalytics_periodStart_periodEnd_idx" ON "JobSearchAnalytics"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "ScrapedJob_portal_idx" ON "ScrapedJob"("portal");

-- CreateIndex
CREATE INDEX "ScrapedJob_title_idx" ON "ScrapedJob"("title");

-- CreateIndex
CREATE INDEX "ScrapedJob_location_idx" ON "ScrapedJob"("location");

-- CreateIndex
CREATE INDEX "ScrapedJob_aiScore_idx" ON "ScrapedJob"("aiScore");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedJob_externalId_portal_key" ON "ScrapedJob"("externalId", "portal");

-- AddForeignKey
ALTER TABLE "AIJobSearchConfig" ADD CONSTRAINT "AIJobSearchConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ScrapedJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSearchAnalytics" ADD CONSTRAINT "JobSearchAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
