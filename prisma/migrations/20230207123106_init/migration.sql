-- AlterTable
ALTER TABLE "evento" ADD COLUMN     "pais_id" INTEGER;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
