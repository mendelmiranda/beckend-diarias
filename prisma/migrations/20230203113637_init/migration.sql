/*
  Warnings:

  - You are about to drop the `contas` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "justificativa" TEXT;

-- DropTable
DROP TABLE "contas";

-- CreateTable
CREATE TABLE "conta_diaria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(20) NOT NULL,
    "cpf" VARCHAR(20) NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "agencia" VARCHAR(20) NOT NULL,
    "conta" VARCHAR(20) NOT NULL,

    CONSTRAINT "conta_diaria_pkey" PRIMARY KEY ("id")
);
