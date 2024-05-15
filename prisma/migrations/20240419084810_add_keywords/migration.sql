/*
  Warnings:

  - You are about to drop the column `info` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "info",
DROP COLUMN "languages";

-- CreateTable
CREATE TABLE "keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "context" TEXT NOT NULL,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_language" (
    "id" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "keywordId" TEXT NOT NULL,
    "projectLanguageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "history" JSONB,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keywords_keyword_projectId_key" ON "keywords"("keyword", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_language_short_projectId_key" ON "project_language"("short", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "translations_keywordId_projectLanguageId_key" ON "translations"("keywordId", "projectLanguageId");

-- AddForeignKey
ALTER TABLE "keywords" ADD CONSTRAINT "keywords_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_language" ADD CONSTRAINT "project_language_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "keywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_projectLanguageId_fkey" FOREIGN KEY ("projectLanguageId") REFERENCES "project_language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
