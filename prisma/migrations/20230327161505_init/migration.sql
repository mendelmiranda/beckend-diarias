-- CreateTable
CREATE TABLE "valor_passgem_evento" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "valor_passagem" DOUBLE PRECISION,

    CONSTRAINT "valor_passgem_evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "valor_passgem_evento_id_key" ON "valor_passgem_evento"("id");

-- AddForeignKey
ALTER TABLE "valor_passgem_evento" ADD CONSTRAINT "valor_passgem_evento_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
