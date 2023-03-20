/*
  Warnings:

  - You are about to drop the column `classe` on the `cargo_diarias` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cargo_diarias" DROP COLUMN "classe",
ADD COLUMN     "funcao" TEXT;
