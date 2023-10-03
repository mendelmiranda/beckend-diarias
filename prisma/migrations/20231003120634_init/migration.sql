-- DropForeignKey
ALTER TABLE "eventos_juntos" DROP CONSTRAINT "eventos_juntos_evento_id_fkey";

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
