/*
  Warnings:

  - You are about to drop the column `tipo_diaria` on the `valor_viagem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "valor_viagem" DROP COLUMN "tipo_diaria",
ADD COLUMN     "destino" TEXT,
ADD COLUMN     "tipo" TEXT;
