-- DropForeignKey
ALTER TABLE "viagem_participantes" DROP CONSTRAINT "viagem_participantes_evento_participantes_id_fkey";

-- AddForeignKey
ALTER TABLE "viagem_participantes" ADD CONSTRAINT "viagem_participantes_evento_participantes_id_fkey" FOREIGN KEY ("evento_participantes_id") REFERENCES "evento_participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
