-- AlterTable
ALTER TABLE "solicitacao" ALTER COLUMN "datareg" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "viagem" ADD COLUMN     "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
