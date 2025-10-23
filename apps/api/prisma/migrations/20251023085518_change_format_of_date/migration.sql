/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "updatedAt",
ADD COLUMN     "updateAt" TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),
ALTER COLUMN "createdAt" SET DEFAULT NOW(),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(0);
