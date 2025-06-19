-- CreateTable
CREATE TABLE "JobSpecificAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "skillsMatch" DOUBLE PRECISION NOT NULL,
    "experienceMatch" DOUBLE PRECISION NOT NULL,
    "educationMatch" DOUBLE PRECISION,
    "keywordOptimization" DOUBLE PRECISION,
    "requiredSkillsFound" TEXT[],
    "requiredSkillsMissing" TEXT[],
    "preferredSkillsFound" TEXT[],
    "preferredSkillsMissing" TEXT[],
    "additionalSkills" TEXT[],
    "experienceAlignment" BOOLEAN NOT NULL,
    "candidateExperience" TEXT,
    "requiredExperience" TEXT,
    "relevantExperience" TEXT[],
    "experienceGaps" TEXT[],
    "strengthsForRole" TEXT[],
    "weaknessesForRole" TEXT[],
    "competitiveAdvantage" TEXT[],
    "redFlags" TEXT[],
    "recommendedImprovements" TEXT[],
    "missingSkills" TEXT[],
    "interviewPreparation" TEXT[],
    "overallAssessment" TEXT NOT NULL,
    "hiringRecommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSpecificAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobSpecificAnalysis_userId_idx" ON "JobSpecificAnalysis"("userId");

-- CreateIndex
CREATE INDEX "JobSpecificAnalysis_jobTitle_idx" ON "JobSpecificAnalysis"("jobTitle");

-- CreateIndex
CREATE INDEX "JobSpecificAnalysis_companyName_idx" ON "JobSpecificAnalysis"("companyName");

-- AddForeignKey
ALTER TABLE "JobSpecificAnalysis" ADD CONSTRAINT "JobSpecificAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
