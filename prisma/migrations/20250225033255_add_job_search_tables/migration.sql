-- CreateTable
CREATE TABLE "JobSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT,
    "experienceLevel" TEXT,
    "salaryRange" TEXT,
    "jobType" TEXT,
    "portals" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPortalClick" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "portalId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobPortalClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobSearch_userId_idx" ON "JobSearch"("userId");

-- CreateIndex
CREATE INDEX "JobPortalClick_userId_idx" ON "JobPortalClick"("userId");

-- CreateIndex
CREATE INDEX "JobPortalClick_portalId_idx" ON "JobPortalClick"("portalId");

-- AddForeignKey
ALTER TABLE "JobSearch" ADD CONSTRAINT "JobSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPortalClick" ADD CONSTRAINT "JobPortalClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
