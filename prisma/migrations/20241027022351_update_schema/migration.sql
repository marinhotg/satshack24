/*
  Warnings:

  - The primary key for the `Bill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Bill` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `billId` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `currency` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "paymentType" TEXT NOT NULL,
    "paymentCode" TEXT,
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
    CONSTRAINT "Bill_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bill_reservedBy_fkey" FOREIGN KEY ("reservedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Bill" ("amount", "bonusRate", "createdAt", "dueDate", "fileKey", "fileName", "fileType", "id", "invoiceId", "paidAt", "paymentCode", "paymentHash", "paymentType", "reservedBy", "reservedUntil", "status", "updatedAt", "uploadedBy") SELECT "amount", "bonusRate", "createdAt", "dueDate", "fileKey", "fileName", "fileType", "id", "invoiceId", "paidAt", "paymentCode", "paymentHash", "paymentType", "reservedBy", "reservedUntil", "status", "updatedAt", "uploadedBy" FROM "Bill";
DROP TABLE "Bill";
ALTER TABLE "new_Bill" RENAME TO "Bill";
CREATE INDEX "Bill_status_idx" ON "Bill"("status");
CREATE INDEX "Bill_uploadedBy_idx" ON "Bill"("uploadedBy");
CREATE INDEX "Bill_reservedBy_idx" ON "Bill"("reservedBy");
CREATE TABLE "new_Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "billId" INTEGER NOT NULL,
    "raterId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rating_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("billId", "comment", "createdAt", "id", "raterId", "rating") SELECT "billId", "comment", "createdAt", "id", "raterId", "rating" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating_billId_key" ON "Rating"("billId");
CREATE INDEX "Rating_raterId_idx" ON "Rating"("raterId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
