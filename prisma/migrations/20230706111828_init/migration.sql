-- CreateTable
CREATE TABLE "log_sistema" (
    "id" SERIAL NOT NULL,
    "linha" TEXT NOT NULL,
    "operacao" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_sistema_pkey" PRIMARY KEY ("id")
);
