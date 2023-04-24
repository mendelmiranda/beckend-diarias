/*
  Warnings:

  - You are about to drop the column `valor_grupo` on the `valor_viagem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "valor_viagem" DROP COLUMN "valor_grupo",
ADD COLUMN     "tipo_diaria" TEXT;
