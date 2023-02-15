/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `conta_diaria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `participante` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "conta_diaria_cpf_key" ON "conta_diaria"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "participante_cpf_key" ON "participante"("cpf");

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_cpf_fkey" FOREIGN KEY ("cpf") REFERENCES "conta_diaria"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
