/*
  Warnings:

  - You are about to drop the `TweeterAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_authorId_fkey";

-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL,
    "tweeterAccount" TEXT,
    "networkName" TEXT NOT NULL,
    "instantSystemId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instantSystemId" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "TweeterAccount";

-- CreateIndex
CREATE UNIQUE INDEX "Network.networkName_unique" ON "Network"("networkName");

-- CreateIndex
CREATE UNIQUE INDEX "Lines.name_unique" ON "Lines"("name");

-- AddForeignKey
ALTER TABLE "Lines" ADD FOREIGN KEY("networkId")REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD FOREIGN KEY("authorId")REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;
