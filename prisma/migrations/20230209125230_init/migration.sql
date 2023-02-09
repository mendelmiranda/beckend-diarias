-- DropForeignKey
ALTER TABLE "evento" DROP CONSTRAINT "evento_cidade_id_fkey";

-- AlterTable
ALTER TABLE "evento" ALTER COLUMN "cidade_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
