-- CreateTable
CREATE TABLE "FoundItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "roomNumber" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "claimedAt" DATETIME
);
