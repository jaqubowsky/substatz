/*
  Warnings:

  - You are about to drop the column `changedField` on the `SubscriptionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `newValue` on the `SubscriptionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `SubscriptionHistory` table. All the data in the column will be lost.
  - Added the required column `billingCycle` to the `SubscriptionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `SubscriptionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `SubscriptionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `effectiveFrom` to the `SubscriptionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `SubscriptionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SubscriptionHistory` DROP COLUMN `changedField`,
    DROP COLUMN `newValue`,
    DROP COLUMN `oldValue`,
    ADD COLUMN `billingCycle` ENUM('MONTHLY', 'QUARTERLY', 'BIANNUALLY', 'ANNUALLY') NOT NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `currency` ENUM('USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'PLN') NOT NULL,
    ADD COLUMN `effectiveFrom` DATETIME(3) NOT NULL,
    ADD COLUMN `effectiveTo` DATETIME(3) NULL,
    ADD COLUMN `price` DOUBLE NOT NULL;

-- CreateIndex
CREATE INDEX `SubscriptionHistory_subscriptionId_effectiveFrom_effectiveTo_idx` ON `SubscriptionHistory`(`subscriptionId`, `effectiveFrom`, `effectiveTo`);
