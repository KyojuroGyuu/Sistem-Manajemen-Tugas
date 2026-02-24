-- DropForeignKey
ALTER TABLE `usertask` DROP FOREIGN KEY `UserTask_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `usertask` DROP FOREIGN KEY `UserTask_userId_fkey`;

-- DropIndex
DROP INDEX `UserTask_taskId_fkey` ON `usertask`;

-- AddForeignKey
ALTER TABLE `UserTask` ADD CONSTRAINT `UserTask_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTask` ADD CONSTRAINT `UserTask_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
