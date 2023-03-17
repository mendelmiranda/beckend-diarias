-- CreateTable
CREATE TABLE "valor_diarias" (
    "id" SERIAL NOT NULL,
    "dentro" DOUBLE PRECISION NOT NULL,
    "fora" DOUBLE PRECISION NOT NULL,
    "internacional" DOUBLE PRECISION,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valor_diarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo_diarias" (
    "id" SERIAL NOT NULL,
    "cargo" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "valor_diarias_id" INTEGER NOT NULL,

    CONSTRAINT "cargo_diarias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "valor_diarias_id_key" ON "valor_diarias"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_diarias_id_key" ON "cargo_diarias"("id");

-- AddForeignKey
ALTER TABLE "cargo_diarias" ADD CONSTRAINT "cargo_diarias_valor_diarias_id_fkey" FOREIGN KEY ("valor_diarias_id") REFERENCES "valor_diarias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
