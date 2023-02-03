-- CreateTable
CREATE TABLE "bancos" (
    "cod" SERIAL NOT NULL,
    "banco" VARCHAR(120),

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "pais" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(60),
    "nome_pt" VARCHAR(60),
    "sigla" VARCHAR(2),
    "bacen" INTEGER,

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_evento" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(60),

    CONSTRAINT "tipo_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,
    "uf" CHAR(2) NOT NULL,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cidade" (
    "id" SERIAL NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("id","estado_id")
);

-- CreateTable
CREATE TABLE "contas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(20) NOT NULL,
    "cpf" VARCHAR(20) NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "agencia" VARCHAR(20) NOT NULL,
    "conta" VARCHAR(20) NOT NULL,

    CONSTRAINT "contas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacao" (
    "id" SERIAL NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL,
    "justificativa" VARCHAR(250) NOT NULL,

    CONSTRAINT "solicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento" (
    "id" SERIAL NOT NULL,
    "tipo_evento_id" INTEGER NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "exterior" TEXT NOT NULL,
    "local_exterior" TEXT,
    "cidade_id" INTEGER,
    "informacoes" TEXT NOT NULL,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participante" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "matricula" INTEGER NOT NULL,
    "lotacao" TEXT NOT NULL,

    CONSTRAINT "participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_participantes" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "participante_id" INTEGER NOT NULL,

    CONSTRAINT "evento_participantes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipo_evento_id_key" ON "tipo_evento"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cidade_id_key" ON "cidade"("id");

-- AddForeignKey
ALTER TABLE "cidade" ADD CONSTRAINT "cidade_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_tipo_evento_id_fkey" FOREIGN KEY ("tipo_evento_id") REFERENCES "tipo_evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_participantes" ADD CONSTRAINT "evento_participantes_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_participantes" ADD CONSTRAINT "evento_participantes_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
