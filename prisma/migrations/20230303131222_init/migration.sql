/*
  Warnings:

  - You are about to alter the column `arcar_passagem` on the `viagem` table. The data in that column could be lost. The data in that column will be cast from `Char(3)` to `Char(2)`.

*/
-- AlterTable
ALTER TABLE "viagem" ALTER COLUMN "arcar_passagem" SET DATA TYPE CHAR(2);
