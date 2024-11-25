/*
  Warnings:

  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `city` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_card` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_cvv` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_expire` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_amt` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_tax` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_total` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_id` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PurchaseItem" (
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("purchase_id", "product_id"),
    CONSTRAINT "PurchaseItem_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase" ("purchase_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Purchase" (
    "purchase_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "credit_card" TEXT NOT NULL,
    "credit_expire" TEXT NOT NULL,
    "credit_cvv" TEXT NOT NULL,
    "invoice_amt" REAL NOT NULL,
    "invoice_tax" REAL NOT NULL,
    "invoice_total" REAL NOT NULL,
    "order_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
