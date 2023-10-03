-- DropForeignKey
ALTER TABLE "anexo_evento" DROP CONSTRAINT "anexo_evento_evento_id_fkey";

-- AddForeignKey
ALTER TABLE "anexo_evento" ADD CONSTRAINT "anexo_evento_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
