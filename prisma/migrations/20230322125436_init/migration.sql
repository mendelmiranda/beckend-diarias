/*
  Warnings:

  - The primary key for the `tramite_solicitacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cod_lotacao` on the `tramite_solicitacao` table. All the data in the column will be lost.
  - You are about to drop the column `lotacao` on the `tramite_solicitacao` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `tramite_solicitacao` table. All the data in the column will be lost.
  - Added the required column `tramite_id` to the `tramite_solicitacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tramite_solicitacao" DROP CONSTRAINT "tramite_solicitacao_pkey",
DROP COLUMN "cod_lotacao",
DROP COLUMN "lotacao",
DROP COLUMN "status",
ADD COLUMN     "tramite_id" INTEGER NOT NULL,
ADD CONSTRAINT "tramite_solicitacao_pkey" PRIMARY KEY ("id", "solicitacao_id", "tramite_id");

-- CreateTable
CREATE TABLE "tramite" (
    "id" SERIAL NOT NULL,
    "cod_lotacao" INTEGER NOT NULL,
    "lotacao" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tramite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tramite_id_key" ON "tramite"("id");

-- AddForeignKey
ALTER TABLE "tramite_solicitacao" ADD CONSTRAINT "tramite_solicitacao_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
