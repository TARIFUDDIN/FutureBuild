/*
  Warnings:

  - You are about to drop the `VideoInterview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VideoInterview" DROP CONSTRAINT "VideoInterview_userId_fkey";

-- DropTable
DROP TABLE "VideoInterview";
