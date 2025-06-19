-- CreateTable
CREATE TABLE "AutomationProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "experience" TEXT,
    "expectedSalary" TEXT,
    "skills" TEXT[],
    "jobType" TEXT NOT NULL DEFAULT 'fulltime',
    "workMode" TEXT NOT NULL DEFAULT 'hybrid',
    "credentials" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "resumePath" TEXT,
    "portfolioUrl" TEXT,
    "githubUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "workflowId" TEXT,
    "totalJobs" INTEGER NOT NULL DEFAULT 0,
    "appliedJobs" INTEGER NOT NULL DEFAULT 0,
    "failedJobs" INTEGER NOT NULL DEFAULT 0,
    "skippedJobs" INTEGER NOT NULL DEFAULT 0,
    "platforms" TEXT[],
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "searchCriteria" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "runId" TEXT,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jobUrl" TEXT,
    "jobDescription" TEXT,
    "location" TEXT,
    "salary" TEXT,
    "status" TEXT NOT NULL,
    "coverLetter" TEXT,
    "customResume" TEXT,
    "relevanceScore" DOUBLE PRECISION,
    "applicationScore" DOUBLE PRECISION,
    "applicationMethod" TEXT,
    "hrContact" TEXT,
    "followUpSent" BOOLEAN NOT NULL DEFAULT false,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastStatusUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapedJob" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "jobId" TEXT,
    "description" TEXT,
    "location" TEXT,
    "salary" TEXT,
    "experience" TEXT,
    "jobType" TEXT,
    "skills" TEXT[],
    "companySize" TEXT,
    "industry" TEXT,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "applicationCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "workflowName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT,
    "inputData" JSONB,
    "outputData" JSONB,
    "errorData" JSONB,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "nodeExecutions" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAutomation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "emailType" TEXT NOT NULL,
    "jobApplicationId" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "status" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "replyReceived" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailAutomation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutomationProfile_userId_key" ON "AutomationProfile"("userId");

-- CreateIndex
CREATE INDEX "AutomationProfile_userId_idx" ON "AutomationProfile"("userId");

-- CreateIndex
CREATE INDEX "AutomationProfile_isActive_idx" ON "AutomationProfile"("isActive");

-- CreateIndex
CREATE INDEX "AutomationRun_userId_idx" ON "AutomationRun"("userId");

-- CreateIndex
CREATE INDEX "AutomationRun_status_idx" ON "AutomationRun"("status");

-- CreateIndex
CREATE INDEX "AutomationRun_startedAt_idx" ON "AutomationRun"("startedAt");

-- CreateIndex
CREATE INDEX "JobApplication_userId_idx" ON "JobApplication"("userId");

-- CreateIndex
CREATE INDEX "JobApplication_platform_idx" ON "JobApplication"("platform");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE INDEX "JobApplication_appliedAt_idx" ON "JobApplication"("appliedAt");

-- CreateIndex
CREATE INDEX "JobApplication_company_idx" ON "JobApplication"("company");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedJob_jobUrl_key" ON "ScrapedJob"("jobUrl");

-- CreateIndex
CREATE INDEX "ScrapedJob_platform_idx" ON "ScrapedJob"("platform");

-- CreateIndex
CREATE INDEX "ScrapedJob_company_idx" ON "ScrapedJob"("company");

-- CreateIndex
CREATE INDEX "ScrapedJob_jobTitle_idx" ON "ScrapedJob"("jobTitle");

-- CreateIndex
CREATE INDEX "ScrapedJob_scrapedAt_idx" ON "ScrapedJob"("scrapedAt");

-- CreateIndex
CREATE INDEX "ScrapedJob_isActive_idx" ON "ScrapedJob"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowExecution_executionId_key" ON "WorkflowExecution"("executionId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_workflowId_idx" ON "WorkflowExecution"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_status_idx" ON "WorkflowExecution"("status");

-- CreateIndex
CREATE INDEX "WorkflowExecution_userId_idx" ON "WorkflowExecution"("userId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_startTime_idx" ON "WorkflowExecution"("startTime");

-- CreateIndex
CREATE INDEX "EmailAutomation_userId_idx" ON "EmailAutomation"("userId");

-- CreateIndex
CREATE INDEX "EmailAutomation_status_idx" ON "EmailAutomation"("status");

-- CreateIndex
CREATE INDEX "EmailAutomation_emailType_idx" ON "EmailAutomation"("emailType");

-- CreateIndex
CREATE INDEX "EmailAutomation_scheduledAt_idx" ON "EmailAutomation"("scheduledAt");

-- AddForeignKey
ALTER TABLE "AutomationProfile" ADD CONSTRAINT "AutomationProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationRun" ADD CONSTRAINT "AutomationRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationRun" ADD CONSTRAINT "AutomationRun_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "AutomationProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_runId_fkey" FOREIGN KEY ("runId") REFERENCES "AutomationRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
