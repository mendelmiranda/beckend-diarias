/*
  Warnings:

  - You are about to drop the `tramite_solicitacao` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `solicitacao_id` to the `tramite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tramite_solicitacao" DROP CONSTRAINT "tramite_solicitacao_solicitacao_id_fkey";

-- DropForeignKey
ALTER TABLE "tramite_solicitacao" DROP CONSTRAINT "tramite_solicitacao_tramite_id_fkey";

-- AlterTable
ALTER TABLE "tramite" ADD COLUMN     "solicitacao_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "tramite_solicitacao";

-- AddForeignKey
ALTER TABLE "tramite" ADD CONSTRAINT "tramite_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
