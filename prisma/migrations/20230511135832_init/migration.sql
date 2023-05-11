/*
  Warnings:

  - You are about to drop the column `solicitacao_id` on the `log_tramite` table. All the data in the column will be lost.
  - Added the required column `tramite_id` to the `log_tramite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "log_tramite" DROP CONSTRAINT "log_tramite_solicitacao_id_fkey";

-- AlterTable
ALTER TABLE "log_tramite" DROP COLUMN "solicitacao_id",
ADD COLUMN     "tramite_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "log_tramite" ADD CONSTRAINT "log_tramite_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
