/*
  Warnings:

  - Made the column `status` on table `solicitacao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "solicitacao" ALTER COLUMN "status" SET NOT NULL;
