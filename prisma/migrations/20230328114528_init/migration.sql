/*
  Warnings:

  - You are about to drop the `valor_passgem_evento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "valor_passgem_evento" DROP CONSTRAINT "valor_passgem_evento_evento_id_fkey";

-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "valor_passagem" DOUBLE PRECISION;

-- DropTable
DROP TABLE "valor_passgem_evento";
