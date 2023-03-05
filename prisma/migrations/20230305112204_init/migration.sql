-- AlterTable
ALTER TABLE "solicitacao" ADD COLUMN     "cpf_responsavel" TEXT,
ADD COLUMN     "nome_responsavel" TEXT,
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "tramite_solicitacao" (
    "id" SERIAL NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "cod_lotacao" INTEGER NOT NULL,
    "lotacao" TEXT NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tramite_solicitacao_pkey" PRIMARY KEY ("id","solicitacao_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tramite_solicitacao_id_key" ON "tramite_solicitacao"("id");

-- AddForeignKey
ALTER TABLE "tramite_solicitacao" ADD CONSTRAINT "tramite_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
