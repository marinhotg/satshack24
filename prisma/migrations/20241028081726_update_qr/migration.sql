/*
  Warnings:

  - You are about to drop the column `paymentCode` on the `Bill` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "paymentType" TEXT NOT NULL,
    "paymentQrCode" TEXT,
    "status" TEXT NOT NULL,
    "bonusRate" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "fileKey" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "uploadedBy" INTEGER NOT NULL,
    "reservedBy" INTEGER,
    "reservedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paidAt" DATETIME,
    "invoiceId" TEXT,
    "paymentHash" TEXT,
    CONSTRAINT "Bill_reservedBy_fkey" FOREIGN KEY ("reservedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bill_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bill" ("amount", "bonusRate", "createdAt", "currency", "dueDate", "fileKey", "fileName", "fileType", "id", "invoiceId", "paidAt", "paymentHash", "paymentType", "reservedBy", "reservedUntil", "status", "updatedAt", "uploadedBy") SELECT "amount", "bonusRate", "createdAt", "currency", "dueDate", "fileKey", "fileName", "fileType", "id", "invoiceId", "paidAt", "paymentHash", "paymentType", "reservedBy", "reservedUntil", "status", "updatedAt", "uploadedBy" FROM "Bill";
DROP TABLE "Bill";
ALTER TABLE "new_Bill" RENAME TO "Bill";
CREATE INDEX "Bill_status_idx" ON "Bill"("status");
CREATE INDEX "Bill_uploadedBy_idx" ON "Bill"("uploadedBy");
CREATE INDEX "Bill_reservedBy_idx" ON "Bill"("reservedBy");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
