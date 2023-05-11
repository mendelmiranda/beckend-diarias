-- CreateTable
CREATE TABLE "log_tramite" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "cod_lotacao_origem" INTEGER NOT NULL,
    "lotacao_origem" TEXT NOT NULL,
    "cod_lotacao_destino" INTEGER NOT NULL,
    "lotacao_destino" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solicitacao_id" INTEGER NOT NULL,

    CONSTRAINT "log_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_tramite_id_key" ON "log_tramite"("id");

-- AddForeignKey
ALTER TABLE "log_tramite" ADD CONSTRAINT "log_tramite_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
