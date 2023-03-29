-- CreateTable
CREATE TABLE "valor_viagem" (
    "id" SERIAL NOT NULL,
    "viagem_id" INTEGER NOT NULL,
    "valor_individual" DOUBLE PRECISION,
    "valor_grupo" DOUBLE PRECISION,

    CONSTRAINT "valor_viagem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "valor_viagem" ADD CONSTRAINT "valor_viagem_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
