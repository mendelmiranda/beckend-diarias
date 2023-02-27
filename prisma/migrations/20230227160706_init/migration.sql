-- DropForeignKey
ALTER TABLE "evento_participantes" DROP CONSTRAINT "evento_participantes_participante_id_fkey";

-- AddForeignKey
ALTER TABLE "evento_participantes" ADD CONSTRAINT "evento_participantes_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
