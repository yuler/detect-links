/*
  Warnings:

  - You are about to drop the `Domain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Domain";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "notifyEmail" TEXT,
    "notifyWebcomToken" TEXT,
    "notifyWebcomMobile" TEXT,
    "notifyWebhook" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");
