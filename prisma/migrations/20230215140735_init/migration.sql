-- DropForeignKey
ALTER TABLE "participante" DROP CONSTRAINT "participante_cpf_fkey";

-- DropIndex
DROP INDEX "conta_diaria_cpf_key";

-- DropIndex
DROP INDEX "participante_cpf_key";
