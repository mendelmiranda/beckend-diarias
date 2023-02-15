/*
  Warnings:

  - Added the required column `banco_id` to the `conta_diaria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conta_diaria" ADD COLUMN     "banco_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "conta_diaria" ADD CONSTRAINT "conta_diaria_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;
