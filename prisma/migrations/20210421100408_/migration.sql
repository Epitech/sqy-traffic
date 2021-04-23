-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL,
    "tweeterAccounts" TEXT[],
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

-- CreateTable
CREATE TABLE "Tweet" (
    "id" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    "tweetUrl" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "hasDisruption" BOOLEAN NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disruption" (
    "id" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "cause" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "wasProcessed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Network.networkName_unique" ON "Network"("networkName");

-- CreateIndex
CREATE UNIQUE INDEX "Lines.name_unique" ON "Lines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet.tweetId_unique" ON "Tweet"("tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Disruption_tweetId_unique" ON "Disruption"("tweetId");

-- AddForeignKey
ALTER TABLE "Lines" ADD FOREIGN KEY("networkId")REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD FOREIGN KEY("authorId")REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disruption" ADD FOREIGN KEY("tweetId")REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
