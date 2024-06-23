-- DropForeignKey
ALTER TABLE "correcao_solicitacao" DROP CONSTRAINT "correcao_solicitacao_solicitacao_id_fkey";

-- DropForeignKey
ALTER TABLE "empenho_daofi" DROP CONSTRAINT "empenho_daofi_solicitacao_id_fkey";

-- DropForeignKey
ALTER TABLE "tramite" DROP CONSTRAINT "tramite_solicitacao_id_fkey";

-- AlterTable
ALTER TABLE "anexo_evento" ALTER COLUMN "categoria" DROP NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "empenho_daofi" ADD COLUMN     "valor_pos_reserva" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "solicitacao" ADD COLUMN     "login" TEXT,
ADD COLUMN     "protocolo" TEXT;

-- AlterTable
ALTER TABLE "tramite" ADD COLUMN     "flag_daof" CHAR(3);

-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "deslocamento" CHAR(3),
ADD COLUMN     "solicitacao_id" INTEGER,
ADD COLUMN     "trecho" TEXT,
ALTER COLUMN "data_volta" DROP NOT NULL;

-- CreateTable
CREATE TABLE "assinatura" (
    "id" SERIAL NOT NULL,
    "presidente_exercicio" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" CHAR(3) NOT NULL
);

-- CreateTable
CREATE TABLE "aprovacao_definitiva" (
    "id" SERIAL NOT NULL,
    "assinatura_id" INTEGER NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT NOT NULL,
    "solicitacao_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "condutores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "validade_cnh" TIMESTAMP(3),
    "categoria_cnh" TEXT,
    "matricula" TEXT,
    "celular" TEXT,
    "endereco" TEXT,
    "banco" TEXT,
    "agencia" TEXT,
    "conta" TEXT,
    "tipo" CHAR(1)
);

-- CreateTable
CREATE TABLE "solicitacao_condutores" (
    "id" SERIAL NOT NULL,
    "condutores_id" INTEGER NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "veiculo" TEXT,

    CONSTRAINT "solicitacao_condutores_pkey" PRIMARY KEY ("id","condutores_id","solicitacao_id")
);

-- CreateTable
CREATE TABLE "encaminhar_solicitacao" (
    "id" SERIAL NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario" TEXT NOT NULL,
    "justificativa" TEXT NOT NULL,
    "cod_lotacao_origem" INTEGER NOT NULL,
    "lotacao_origem" TEXT NOT NULL,
    "cod_lotacao_destino" INTEGER NOT NULL,
    "lotacao_destino" TEXT NOT NULL,
    "lido" CHAR(3) NOT NULL,

    CONSTRAINT "encaminhar_solicitacao_pkey" PRIMARY KEY ("id","solicitacao_id")
);

-- CreateTable
CREATE TABLE "organograma" (
    "id" SERIAL NOT NULL,
    "pai_id" INTEGER NOT NULL,
    "pai_nome" TEXT NOT NULL,
    "filho_id" INTEGER NOT NULL,
    "filho_nome" TEXT NOT NULL,

    CONSTRAINT "organograma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinatura_daof" (
    "id" SERIAL NOT NULL,
    "diretor" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" CHAR(3) NOT NULL
);

-- CreateTable
CREATE TABLE "aprovacao_definitiva_daof" (
    "id" SERIAL NOT NULL,
    "assinatura_id" INTEGER NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT NOT NULL,
    "solicitacao_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "diaria_condutor" (
    "id" SERIAL NOT NULL,
    "solicitacao_condutores_id" INTEGER NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "diaria_condutor_pkey" PRIMARY KEY ("id","solicitacao_condutores_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assinatura_id_key" ON "assinatura"("id");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacao_definitiva_id_key" ON "aprovacao_definitiva"("id");

-- CreateIndex
CREATE UNIQUE INDEX "condutores_id_key" ON "condutores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "solicitacao_condutores_id_key" ON "solicitacao_condutores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "encaminhar_solicitacao_id_key" ON "encaminhar_solicitacao"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organograma_id_key" ON "organograma"("id");

-- CreateIndex
CREATE UNIQUE INDEX "assinatura_daof_id_key" ON "assinatura_daof"("id");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacao_definitiva_daof_id_key" ON "aprovacao_definitiva_daof"("id");

-- CreateIndex
CREATE UNIQUE INDEX "diaria_condutor_id_key" ON "diaria_condutor"("id");

-- AddForeignKey
ALTER TABLE "empenho_daofi" ADD CONSTRAINT "empenho_daofi_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramite" ADD CONSTRAINT "tramite_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcao_solicitacao" ADD CONSTRAINT "correcao_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva" ADD CONSTRAINT "aprovacao_definitiva_assinatura_id_fkey" FOREIGN KEY ("assinatura_id") REFERENCES "assinatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva" ADD CONSTRAINT "aprovacao_definitiva_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_condutores" ADD CONSTRAINT "solicitacao_condutores_condutores_id_fkey" FOREIGN KEY ("condutores_id") REFERENCES "condutores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_condutores" ADD CONSTRAINT "solicitacao_condutores_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encaminhar_solicitacao" ADD CONSTRAINT "encaminhar_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva_daof" ADD CONSTRAINT "aprovacao_definitiva_daof_assinatura_id_fkey" FOREIGN KEY ("assinatura_id") REFERENCES "assinatura_daof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva_daof" ADD CONSTRAINT "aprovacao_definitiva_daof_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaria_condutor" ADD CONSTRAINT "diaria_condutor_solicitacao_condutores_id_fkey" FOREIGN KEY ("solicitacao_condutores_id") REFERENCES "solicitacao_condutores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
