/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `empenho_daofi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "empenho_daofi_id_key" ON "empenho_daofi"("id");
