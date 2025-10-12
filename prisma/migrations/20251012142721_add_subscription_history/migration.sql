-- CreateTable
CREATE TABLE `SubscriptionHistory` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `changedField` VARCHAR(191) NOT NULL,
    `oldValue` VARCHAR(191) NOT NULL,
    `newValue` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,

    INDEX `SubscriptionHistory_subscriptionId_idx`(`subscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubscriptionHistory` ADD CONSTRAINT `SubscriptionHistory_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
