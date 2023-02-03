-- AlterTable
ALTER TABLE "participante" ADD COLUMN     "cep" TEXT,
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "estado_id" INTEGER,
ADD COLUMN     "recebe_diarias_na_origem" CHAR(1),
ALTER COLUMN "matricula" DROP NOT NULL,
ALTER COLUMN "lotacao" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;
