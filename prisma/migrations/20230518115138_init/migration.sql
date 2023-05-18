-- CreateTable
CREATE TABLE "empenho_daofi" (
    "id" SERIAL NOT NULL,
    "datareg" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "saldo_inicial" DOUBLE PRECISION NOT NULL,
    "valor_reservado" DOUBLE PRECISION NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,

    CONSTRAINT "empenho_daofi_pkey" PRIMARY KEY ("id","solicitacao_id")
);

-- AddForeignKey
ALTER TABLE "empenho_daofi" ADD CONSTRAINT "empenho_daofi_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
