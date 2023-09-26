-- DropForeignKey
ALTER TABLE "valor_viagem" DROP CONSTRAINT "valor_viagem_viagem_id_fkey";

-- AddForeignKey
ALTER TABLE "valor_viagem" ADD CONSTRAINT "valor_viagem_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
