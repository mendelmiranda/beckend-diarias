-- DropForeignKey
ALTER TABLE "evento" DROP CONSTRAINT "evento_solicitacao_id_fkey";

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
