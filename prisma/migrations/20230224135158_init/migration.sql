-- CreateTable
CREATE TABLE "aeroporto" (
    "id" SERIAL NOT NULL,
    "iata" TEXT NOT NULL,
    "icao" TEXT NOT NULL,
    "nome_aeroporto" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "aeroporto_id_key" ON "aeroporto"("id");
