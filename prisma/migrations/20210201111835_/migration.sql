/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[tweetUrl]` on the table `Tweet`. If there are existing duplicate values, the migration will fail.
  - Added the required column `routeId` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cause` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `effect` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wasProcessed` to the `Disruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tweetUrl` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disruption" ADD COLUMN     "routeId" TEXT NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cause" TEXT NOT NULL,
ADD COLUMN     "effect" TEXT NOT NULL,
ADD COLUMN     "severity" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "wasProcessed" BOOLEAN NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "tweetUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tweet.tweetUrl_unique" ON "Tweet"("tweetUrl");
