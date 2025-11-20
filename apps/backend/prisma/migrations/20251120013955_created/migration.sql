/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameExternalId]` on the table `GameEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,gameExternalId]` on the table `GameReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameEntry_userId_gameExternalId_key" ON "GameEntry"("userId", "gameExternalId");

-- CreateIndex
CREATE UNIQUE INDEX "GameReview_userId_gameExternalId_key" ON "GameReview"("userId", "gameExternalId");
