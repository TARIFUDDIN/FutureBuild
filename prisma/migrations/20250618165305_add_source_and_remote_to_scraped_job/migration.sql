-- AlterTable
ALTER TABLE "ScrapedJob" ADD COLUMN     "remote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" TEXT;
