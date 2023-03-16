/*
  Warnings:

  - Added the required column `status` to the `tramite_solicitacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tramite_solicitacao" ADD COLUMN     "status" TEXT NOT NULL;
