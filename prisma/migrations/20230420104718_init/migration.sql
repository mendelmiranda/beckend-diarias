/*
  Warnings:

  - You are about to drop the column `cod_lotacao` on the `tramite` table. All the data in the column will be lost.
  - You are about to drop the column `lotacao` on the `tramite` table. All the data in the column will be lost.
  - Added the required column `cod_lotacao_destino` to the `tramite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cod_lotacao_origem` to the `tramite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotacao_destino` to the `tramite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotacao_origem` to the `tramite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tramite" DROP COLUMN "cod_lotacao",
DROP COLUMN "lotacao",
ADD COLUMN     "cod_lotacao_destino" INTEGER NOT NULL,
ADD COLUMN     "cod_lotacao_origem" INTEGER NOT NULL,
ADD COLUMN     "lotacao_destino" TEXT NOT NULL,
ADD COLUMN     "lotacao_origem" TEXT NOT NULL;
