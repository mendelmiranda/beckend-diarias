-- AlterTable
ALTER TABLE "participante" ADD COLUMN     "cidade_id" INTEGER;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
