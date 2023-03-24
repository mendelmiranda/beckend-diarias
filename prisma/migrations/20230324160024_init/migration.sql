/*
  Warnings:

  - The primary key for the `tramite_solicitacao` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "cargo_diarias" DROP CONSTRAINT "cargo_diarias_valor_diarias_id_fkey";

-- AlterTable
ALTER TABLE "tramite_solicitacao" DROP CONSTRAINT "tramite_solicitacao_pkey",
ADD CONSTRAINT "tramite_solicitacao_pkey" PRIMARY KEY ("id", "solicitacao_id");

-- AddForeignKey
ALTER TABLE "cargo_diarias" ADD CONSTRAINT "cargo_diarias_valor_diarias_id_fkey" FOREIGN KEY ("valor_diarias_id") REFERENCES "valor_diarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
