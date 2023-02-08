/*
  Warnings:

  - Made the column `cidade_id` on table `evento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pais_id` on table `evento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "evento" DROP CONSTRAINT "evento_cidade_id_fkey";

-- DropForeignKey
ALTER TABLE "evento" DROP CONSTRAINT "evento_pais_id_fkey";

-- AlterTable
ALTER TABLE "evento" ADD COLUMN     "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "cidade_id" SET NOT NULL,
ALTER COLUMN "pais_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
