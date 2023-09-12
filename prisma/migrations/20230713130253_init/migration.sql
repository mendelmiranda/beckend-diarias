/*
  Warnings:

  - You are about to drop the `anexo_solicitacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "anexo_solicitacao" DROP CONSTRAINT "anexo_solicitacao_solicitacao_id_fkey";

-- DropTable
DROP TABLE "anexo_solicitacao";

-- CreateTable
CREATE TABLE "anexo_evento" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "api_anexo_id" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "evento_id" INTEGER NOT NULL,

    CONSTRAINT "anexo_evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anexo_evento" ADD CONSTRAINT "anexo_evento_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
