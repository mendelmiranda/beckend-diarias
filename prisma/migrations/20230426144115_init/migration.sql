-- CreateTable
CREATE TABLE "correcao_solicitacao" (
    "id" SERIAL NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "texto" TEXT,
    "status" TEXT NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correcao_solicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "correcao_solicitacao_id_key" ON "correcao_solicitacao"("id");

-- AddForeignKey
ALTER TABLE "correcao_solicitacao" ADD CONSTRAINT "correcao_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
