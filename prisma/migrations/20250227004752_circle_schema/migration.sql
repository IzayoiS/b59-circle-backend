/*
  Warnings:

  - Added the required column `content` to the `replys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "replys" ADD COLUMN     "content" TEXT NOT NULL;
