/*
  Warnings:

  - You are about to drop the column `valor_diaria` on the `evento_participantes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "evento_participantes" DROP COLUMN "valor_diaria";

-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "valor_diaria" DOUBLE PRECISION;
