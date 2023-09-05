-- DropForeignKey
ALTER TABLE "evento_participantes" DROP CONSTRAINT "evento_participantes_evento_id_fkey";

-- AddForeignKey
ALTER TABLE "evento_participantes" ADD CONSTRAINT "evento_participantes_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
