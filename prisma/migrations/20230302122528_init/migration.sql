-- DropForeignKey
ALTER TABLE "viagem_participantes" DROP CONSTRAINT "viagem_participantes_viagem_id_fkey";

-- AddForeignKey
ALTER TABLE "viagem_participantes" ADD CONSTRAINT "viagem_participantes_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
