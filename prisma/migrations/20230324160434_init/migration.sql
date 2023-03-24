/*
  Warnings:

  - The primary key for the `cargo_diarias` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "cargo_diarias" DROP CONSTRAINT "cargo_diarias_pkey",
ADD CONSTRAINT "cargo_diarias_pkey" PRIMARY KEY ("id");
