/*
  Warnings:

  - A unique constraint covering the columns `[solicitacao_id]` on the table `tramite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tramite_solicitacao_id_key" ON "tramite"("solicitacao_id");
