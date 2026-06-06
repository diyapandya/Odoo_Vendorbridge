/*
  Warnings:

  - You are about to drop the column `quantity` on the `rfq` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `rfq` DROP COLUMN `quantity`,
    ADD COLUMN `attachments` TEXT NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'General',
    MODIFY `description` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `RFQLineItem` (
    `id` VARCHAR(191) NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `rfqId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RFQToVendor` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RFQToVendor_AB_unique`(`A`, `B`),
    INDEX `_RFQToVendor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RFQLineItem` ADD CONSTRAINT `RFQLineItem_rfqId_fkey` FOREIGN KEY (`rfqId`) REFERENCES `RFQ`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RFQToVendor` ADD CONSTRAINT `_RFQToVendor_A_fkey` FOREIGN KEY (`A`) REFERENCES `RFQ`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RFQToVendor` ADD CONSTRAINT `_RFQToVendor_B_fkey` FOREIGN KEY (`B`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
