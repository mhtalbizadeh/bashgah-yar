-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'INFO';
