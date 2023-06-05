/*
  Warnings:

  - Added the required column `participante_id` to the `conta_diaria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conta_diaria" ADD COLUMN     "participante_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "conta_diaria" ADD CONSTRAINT "conta_diaria_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
