/*
  Warnings:

  - You are about to drop the column `billingCycle` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `billingCycle`,
    DROP COLUMN `category`,
    DROP COLUMN `currency`,
    DROP COLUMN `price`;
