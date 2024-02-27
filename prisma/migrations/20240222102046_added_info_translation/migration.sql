/*
  Warnings:

  - You are about to drop the column `content` on the `translations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "translations" DROP COLUMN "content",
ADD COLUMN     "info" JSONB,
ADD COLUMN     "languages" JSONB;
