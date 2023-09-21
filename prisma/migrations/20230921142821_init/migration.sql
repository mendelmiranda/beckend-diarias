/*
  Warnings:

  - Added the required column `solicitacao_id` to the `eventos_juntos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eventos_juntos" ADD COLUMN     "solicitacao_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
