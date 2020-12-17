-- CreateTable
CREATE TABLE "TweeterAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
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
    "tweetId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TweeterAccount.name_unique" ON "TweeterAccount"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet.tweetId_unique" ON "Tweet"("tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Disruption_tweetId_unique" ON "Disruption"("tweetId");

-- AddForeignKey
ALTER TABLE "Tweet" ADD FOREIGN KEY("authorId")REFERENCES "TweeterAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disruption" ADD FOREIGN KEY("tweetId")REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
