/*
  Warnings:

  - Made the column `data_ida` on table `viagem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data_volta` on table `viagem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "data_ida_diferente" TIMESTAMP(3),
ADD COLUMN     "data_volta_diferente" TIMESTAMP(3),
ADD COLUMN     "justificativa_diferente" TEXT,
ADD COLUMN     "viagem_diferente" CHAR(3),
ALTER COLUMN "data_ida" SET NOT NULL,
ALTER COLUMN "data_volta" SET NOT NULL;
