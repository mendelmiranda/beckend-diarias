/*
  Warnings:

  - You are about to drop the column `cidade_id` on the `aeroporto` table. All the data in the column will be lost.
  - You are about to drop the column `estado_id` on the `aeroporto` table. All the data in the column will be lost.
  - Added the required column `cidade` to the `aeroporto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `aeroporto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "aeroporto" DROP CONSTRAINT "aeroporto_cidade_id_fkey";

-- DropForeignKey
ALTER TABLE "aeroporto" DROP CONSTRAINT "aeroporto_estado_id_fkey";

-- AlterTable
ALTER TABLE "aeroporto" DROP COLUMN "cidade_id",
DROP COLUMN "estado_id",
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "uf" TEXT NOT NULL;
