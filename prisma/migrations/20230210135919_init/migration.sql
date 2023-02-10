/*
  Warnings:

  - Added the required column `tipo_conta` to the `conta_diaria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conta_diaria" ADD COLUMN     "tipo_conta" TEXT NOT NULL;
