-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('NORMAL', 'SUPER', 'ZERO');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "urgency" "Urgency" NOT NULL DEFAULT 'NORMAL';
