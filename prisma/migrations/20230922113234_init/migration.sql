-- AlterTable
ALTER TABLE "eventos_juntos" ADD COLUMN     "participante_id" INTEGER;

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
