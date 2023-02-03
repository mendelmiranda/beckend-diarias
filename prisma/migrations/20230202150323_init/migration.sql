/*
  Warnings:

  - The primary key for the `evento_participantes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `evento_participantes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "evento_participantes" DROP CONSTRAINT "evento_participantes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "evento_participantes_pkey" PRIMARY KEY ("evento_id", "participante_id");
