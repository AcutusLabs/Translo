-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'en';
