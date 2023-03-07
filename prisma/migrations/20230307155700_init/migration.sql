-- DropForeignKey
ALTER TABLE "viagem" DROP CONSTRAINT "viagem_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "viagem" DROP CONSTRAINT "viagem_origem_id_fkey";

-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "cidade_destino_id" INTEGER,
ADD COLUMN     "cidade_origem_id" INTEGER,
ALTER COLUMN "origem_id" DROP NOT NULL,
ALTER COLUMN "destino_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_origem_id_fkey" FOREIGN KEY ("origem_id") REFERENCES "aeroporto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "aeroporto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_cidade_origem_id_fkey" FOREIGN KEY ("cidade_origem_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_cidade_destino_id_fkey" FOREIGN KEY ("cidade_destino_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
