/*
  Warnings:

  - You are about to drop the column `usuario` on the `anexo_solicitacao` table. All the data in the column will be lost.
  - You are about to alter the column `api_anexo_id` on the `anexo_solicitacao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "anexo_solicitacao" DROP COLUMN "usuario",
ALTER COLUMN "api_anexo_id" SET DATA TYPE INTEGER;
