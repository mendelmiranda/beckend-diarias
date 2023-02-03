-- CreateTable
CREATE TABLE "viagem" (
    "id" SERIAL NOT NULL,
    "origem_id" INTEGER NOT NULL,
    "destino_id" INTEGER NOT NULL,
    "trecho" TEXT NOT NULL,
    "data_ida" TIMESTAMP(3) NOT NULL,
    "data_volta" TIMESTAMP(3),

    CONSTRAINT "viagem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_origem_id_fkey" FOREIGN KEY ("origem_id") REFERENCES "cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
