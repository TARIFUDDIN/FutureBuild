/*
  Warnings:

  - You are about to drop the column `applicationMethod` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `applicationScore` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `customCoverLetter` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `emailSent` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `emailTo` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `interviewNotes` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `JobApplication` table. All the data in the column will be lost.
  - The `status` column on the `JobApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `aiScore` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `aiSummary` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `concerns` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `isRemote` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `isSponsored` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `jobType` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `matchReasons` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `portal` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `salaryRange` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `ScrapedJob` table. All the data in the column will be lost.
  - You are about to drop the `AIJobSearchConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobSearchAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[externalJobId,sessionId]` on the table `ScrapedJob` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalJobId` to the `ScrapedJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `ScrapedJob` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DISCOVERED', 'ANALYZING', 'MATCHED', 'APPLIED', 'REJECTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'OFFER_DECLINED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'RESUME_GENERATING', 'EMAIL_FINDING', 'EMAIL_SENDING', 'SENT', 'DELIVERED', 'OPENED', 'REPLIED', 'REJECTED', 'INTERVIEW_REQUESTED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL', 'INTERVIEW_REQUEST', 'REJECTION', 'AUTO_REPLY');

-- CreateEnum
CREATE TYPE "ContactSource" AS ENUM ('EMAIL_FROM_JOB', 'APOLLO_HR', 'APOLLO_EXECUTIVE', 'PERPLEXITY', 'MANUAL');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('HR', 'HIRING_MANAGER', 'RECRUITER', 'EXECUTIVE', 'GENERIC');

-- CreateEnum
CREATE TYPE "EmailTemplateType" AS ENUM ('COLD_OUTREACH', 'FOLLOW_UP', 'THANK_YOU', 'INTERVIEW_CONFIRMATION', 'SALARY_NEGOTIATION');

-- DropForeignKey
ALTER TABLE "AIJobSearchConfig" DROP CONSTRAINT "AIJobSearchConfig_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobSearchAnalytics" DROP CONSTRAINT "JobSearchAnalytics_userId_fkey";

-- DropIndex
DROP INDEX "JobApplication_appliedAt_idx";

-- DropIndex
DROP INDEX "ScrapedJob_aiScore_idx";

-- DropIndex
DROP INDEX "ScrapedJob_externalId_portal_key";

-- DropIndex
DROP INDEX "ScrapedJob_location_idx";

-- DropIndex
DROP INDEX "ScrapedJob_portal_idx";

-- DropIndex
DROP INDEX "ScrapedJob_title_idx";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "applicationMethod",
DROP COLUMN "applicationScore",
DROP COLUMN "customCoverLetter",
DROP COLUMN "emailSent",
DROP COLUMN "emailTo",
DROP COLUMN "interviewNotes",
DROP COLUMN "recommendations",
ADD COLUMN     "applicationUrl" TEXT,
ADD COLUMN     "coverLetterUsed" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailDelivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailOpened" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailReplied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailSentAt" TIMESTAMP(3),
ADD COLUMN     "followUpCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followUpScheduled" TIMESTAMP(3),
ADD COLUMN     "hrEmail" TEXT,
ADD COLUMN     "interviewScheduled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interviewType" TEXT,
ADD COLUMN     "lastFollowUp" TIMESTAMP(3),
ADD COLUMN     "referenceNumber" TEXT,
ADD COLUMN     "responseDate" TIMESTAMP(3),
ADD COLUMN     "responseReceived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "responseType" "ResponseType",
ADD COLUMN     "resumeVersion" TEXT,
ADD COLUMN     "sessionId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "appliedAt" DROP NOT NULL,
ALTER COLUMN "appliedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ScrapedJob" DROP COLUMN "aiScore",
DROP COLUMN "aiSummary",
DROP COLUMN "concerns",
DROP COLUMN "description",
DROP COLUMN "experienceLevel",
DROP COLUMN "externalId",
DROP COLUMN "isRemote",
DROP COLUMN "isSponsored",
DROP COLUMN "jobType",
DROP COLUMN "matchReasons",
DROP COLUMN "portal",
DROP COLUMN "requirements",
DROP COLUMN "salaryRange",
DROP COLUMN "skills",
DROP COLUMN "url",
ADD COLUMN     "aiMatchScore" DOUBLE PRECISION,
ADD COLUMN     "applyUrl" TEXT,
ADD COLUMN     "companyDescription" TEXT,
ADD COLUMN     "companyEmployeesCount" TEXT,
ADD COLUMN     "companyLinkedinUrl" TEXT,
ADD COLUMN     "companyWebsite" TEXT,
ADD COLUMN     "descriptionHtml" TEXT,
ADD COLUMN     "descriptionText" TEXT,
ADD COLUMN     "employmentType" TEXT,
ADD COLUMN     "experienceMatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "externalJobId" TEXT NOT NULL,
ADD COLUMN     "industries" TEXT[],
ADD COLUMN     "jobFunction" TEXT,
ADD COLUMN     "jobPosterName" TEXT,
ADD COLUMN     "jobPosterPhoto" TEXT,
ADD COLUMN     "jobPosterProfileUrl" TEXT,
ADD COLUMN     "jobPosterTitle" TEXT,
ADD COLUMN     "keySkillsMatch" TEXT[],
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "priority" "JobPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "salaryInfo" TEXT,
ADD COLUMN     "salaryMatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seniorityLevel" TEXT,
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'DISCOVERED',
ALTER COLUMN "applicantsCount" SET DATA TYPE TEXT,
ALTER COLUMN "postedAt" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "AIJobSearchConfig";

-- DropTable
DROP TABLE "JobSearchAnalytics";

-- CreateTable
CREATE TABLE "JobSearchSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionName" TEXT,
    "searchQuery" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT,
    "experience" TEXT,
    "skills" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSearchSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactAttempt" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "source" "ContactSource" NOT NULL,
    "contactType" "ContactType" NOT NULL,
    "contactName" TEXT,
    "contactTitle" TEXT,
    "contactEmail" TEXT,
    "contactLinkedin" TEXT,
    "contactPhone" TEXT,
    "emailFound" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailDelivered" BOOLEAN NOT NULL DEFAULT false,
    "emailBounced" BOOLEAN NOT NULL DEFAULT false,
    "apolloPersonId" TEXT,
    "apolloCreditsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedResume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "resumeName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jsonContent" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "htmlContent" TEXT,
    "atsScore" DOUBLE PRECISION,
    "keywordMatch" DOUBLE PRECISION,
    "tailoringScore" DOUBLE PRECISION,
    "baseResumeId" TEXT,
    "aiModel" TEXT,
    "generationTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedResume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "templateType" "EmailTemplateType" NOT NULL,
    "industry" TEXT,
    "jobLevel" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalApplications" INTEGER NOT NULL DEFAULT 0,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "emailsDelivered" INTEGER NOT NULL DEFAULT 0,
    "emailsOpened" INTEGER NOT NULL DEFAULT 0,
    "emailsReplied" INTEGER NOT NULL DEFAULT 0,
    "interviewsScheduled" INTEGER NOT NULL DEFAULT 0,
    "offersReceived" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DOUBLE PRECISION,
    "interviewRate" DOUBLE PRECISION,
    "offerRate" DOUBLE PRECISION,
    "avgAtsScore" DOUBLE PRECISION,
    "avgMatchScore" DOUBLE PRECISION,
    "bestCompany" TEXT,
    "bestJobTitle" TEXT,
    "bestEmailTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobSearchSession_userId_idx" ON "JobSearchSession"("userId");

-- CreateIndex
CREATE INDEX "ContactAttempt_jobId_idx" ON "ContactAttempt"("jobId");

-- CreateIndex
CREATE INDEX "ContactAttempt_source_idx" ON "ContactAttempt"("source");

-- CreateIndex
CREATE INDEX "GeneratedResume_userId_idx" ON "GeneratedResume"("userId");

-- CreateIndex
CREATE INDEX "GeneratedResume_jobTitle_idx" ON "GeneratedResume"("jobTitle");

-- CreateIndex
CREATE INDEX "EmailTemplate_userId_idx" ON "EmailTemplate"("userId");

-- CreateIndex
CREATE INDEX "EmailTemplate_templateType_idx" ON "EmailTemplate"("templateType");

-- CreateIndex
CREATE INDEX "ApplicationMetrics_userId_idx" ON "ApplicationMetrics"("userId");

-- CreateIndex
CREATE INDEX "ApplicationMetrics_periodStart_idx" ON "ApplicationMetrics"("periodStart");

-- CreateIndex
CREATE INDEX "JobApplication_sessionId_idx" ON "JobApplication"("sessionId");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE INDEX "ScrapedJob_sessionId_idx" ON "ScrapedJob"("sessionId");

-- CreateIndex
CREATE INDEX "ScrapedJob_status_idx" ON "ScrapedJob"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedJob_externalJobId_sessionId_key" ON "ScrapedJob"("externalJobId", "sessionId");

-- AddForeignKey
ALTER TABLE "JobSearchSession" ADD CONSTRAINT "JobSearchSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapedJob" ADD CONSTRAINT "ScrapedJob_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "JobSearchSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "JobSearchSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ScrapedJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAttempt" ADD CONSTRAINT "ContactAttempt_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ScrapedJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedResume" ADD CONSTRAINT "GeneratedResume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedResume" ADD CONSTRAINT "GeneratedResume_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationMetrics" ADD CONSTRAINT "ApplicationMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
