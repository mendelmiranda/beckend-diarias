-- AlterTable
ALTER TABLE "solicitacao" ADD COLUMN     "status" CHAR(3),
ALTER COLUMN "datareg" DROP NOT NULL;
