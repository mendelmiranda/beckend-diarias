-- AlterTable
ALTER TABLE "viagem_participantes" ADD COLUMN     "arcar_passagem" CHAR(3),
ADD COLUMN     "custos" TEXT[],
ADD COLUMN     "data_ida_diferente" TIMESTAMP(3),
ADD COLUMN     "data_volta_diferente" TIMESTAMP(3),
ADD COLUMN     "justificativa_custos" TEXT,
ADD COLUMN     "justificativa_diferente" TEXT,
ADD COLUMN     "servidor_acompanhando" CHAR(3),
ADD COLUMN     "viagem_diferente" CHAR(3);

-- CreateTable
CREATE TABLE "viagem_evento" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "viagem_id" INTEGER NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viagem_evento_pkey" PRIMARY KEY ("id","evento_id","solicitacao_id","viagem_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "viagem_evento_id_key" ON "viagem_evento"("id");

-- AddForeignKey
ALTER TABLE "viagem_evento" ADD CONSTRAINT "viagem_evento_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem_evento" ADD CONSTRAINT "viagem_evento_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem_evento" ADD CONSTRAINT "viagem_evento_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
