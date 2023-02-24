-- DropForeignKey
ALTER TABLE "viagem" DROP CONSTRAINT "viagem_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "viagem" DROP CONSTRAINT "viagem_origem_id_fkey";

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_origem_id_fkey" FOREIGN KEY ("origem_id") REFERENCES "aeroporto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "aeroporto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
