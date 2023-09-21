-- CreateTable
CREATE TABLE "eventos_juntos" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "data_inicial" TIMESTAMP(3) NOT NULL,
    "data_final" TIMESTAMP(3) NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_juntos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eventos_juntos_id_key" ON "eventos_juntos"("id");

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
