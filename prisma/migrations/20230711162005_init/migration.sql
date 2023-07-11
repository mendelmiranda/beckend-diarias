-- AlterTable
ALTER TABLE "correcao_solicitacao" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "empenho_daofi" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "evento" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "log_tramite" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "solicitacao" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "tramite" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "valor_diarias" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "viagem" ALTER COLUMN "datareg" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "anexo_solicitacao" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "api_anexo_id" BIGINT NOT NULL,
    "filename" TEXT NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,

    CONSTRAINT "anexo_solicitacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anexo_solicitacao" ADD CONSTRAINT "anexo_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
