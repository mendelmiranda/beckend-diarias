-- DropForeignKey
ALTER TABLE "anexo_solicitacao" DROP CONSTRAINT "anexo_solicitacao_solicitacao_id_fkey";

-- AlterTable
ALTER TABLE "anexo_solicitacao" ALTER COLUMN "solicitacao_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "anexo_solicitacao" ADD CONSTRAINT "anexo_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
