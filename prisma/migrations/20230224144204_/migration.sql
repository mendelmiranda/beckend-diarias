/*
  Warnings:

  - You are about to drop the column `cidade` on the `aeroporto` table. All the data in the column will be lost.
  - You are about to drop the column `uf` on the `aeroporto` table. All the data in the column will be lost.
  - Added the required column `cidade_id` to the `aeroporto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado_id` to the `aeroporto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aeroporto" DROP COLUMN "cidade",
DROP COLUMN "uf",
ADD COLUMN     "cidade_id" INTEGER NOT NULL,
ADD COLUMN     "estado_id" INTEGER NOT NULL,
ALTER COLUMN "iata" DROP NOT NULL,
ALTER COLUMN "icao" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "aeroporto" ADD CONSTRAINT "aeroporto_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aeroporto" ADD CONSTRAINT "aeroporto_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
