/*
  Warnings:

  - You are about to drop the column `iata` on the `aeroporto` table. All the data in the column will be lost.
  - You are about to drop the column `icao` on the `aeroporto` table. All the data in the column will be lost.
  - You are about to drop the column `nome_aeroporto` on the `aeroporto` table. All the data in the column will be lost.
  - Added the required column `estado` to the `aeroporto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aeroporto" DROP COLUMN "iata",
DROP COLUMN "icao",
DROP COLUMN "nome_aeroporto",
ADD COLUMN     "estado" TEXT NOT NULL;
