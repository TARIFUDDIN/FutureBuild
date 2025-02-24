-- CreateTable
CREATE TABLE "VideoInterview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "videoUrl" TEXT,
    "analysis" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoInterview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoInterview_userId_idx" ON "VideoInterview"("userId");

-- AddForeignKey
ALTER TABLE "VideoInterview" ADD CONSTRAINT "VideoInterview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
