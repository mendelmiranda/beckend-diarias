/*
  Warnings:

  - The primary key for the `evento_participantes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `evento_participantes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exterior` to the `viagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_id` to the `viagem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "evento_participantes" DROP CONSTRAINT "evento_participantes_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "evento_participantes_pkey" PRIMARY KEY ("id", "evento_id", "participante_id");

-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "exterior" TEXT NOT NULL,
ADD COLUMN     "local_exterior" TEXT,
ADD COLUMN     "pais_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "viagem_participantes" (
    "id" SERIAL NOT NULL,
    "evento_participantes_id" INTEGER NOT NULL,
    "viagem_id" INTEGER NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viagem_participantes_pkey" PRIMARY KEY ("id","evento_participantes_id","viagem_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "viagem_participantes_id_key" ON "viagem_participantes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "evento_participantes_id_key" ON "evento_participantes"("id");

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem_participantes" ADD CONSTRAINT "viagem_participantes_evento_participantes_id_fkey" FOREIGN KEY ("evento_participantes_id") REFERENCES "evento_participantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem_participantes" ADD CONSTRAINT "viagem_participantes_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
