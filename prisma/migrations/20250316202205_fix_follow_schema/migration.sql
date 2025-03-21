/*
  Warnings:

  - A unique constraint covering the columns `[followingId,followedId]` on the table `follows` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "follows_followingId_followedId_key" ON "follows"("followingId", "followedId");
