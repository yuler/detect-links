-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "notifyEmail" TEXT,
    "notifyWecomToken" TEXT,
    "notifyWecomMobile" TEXT,
    "notifyWebhook" TEXT,
    "blocked" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Link" ("blocked", "createdAt", "id", "notifyEmail", "notifyWebhook", "notifyWecomMobile", "notifyWecomToken", "remarks", "updatedAt", "url", "userId") SELECT "blocked", "createdAt", "id", "notifyEmail", "notifyWebhook", "notifyWecomMobile", "notifyWecomToken", "remarks", "updatedAt", "url", "userId" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
