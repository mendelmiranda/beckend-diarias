-- DropForeignKey
ALTER TABLE "eventos_juntos" DROP CONSTRAINT "eventos_juntos_solicitacao_id_fkey";

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
