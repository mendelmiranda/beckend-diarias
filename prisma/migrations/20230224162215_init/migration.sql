/*
  Warnings:

  - The `valor_diaria` column on the `evento_participantes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "evento_participantes" DROP COLUMN "valor_diaria",
ADD COLUMN     "valor_diaria" DOUBLE PRECISION;
