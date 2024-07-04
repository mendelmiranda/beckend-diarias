-- CreateTable
CREATE TABLE "bancos" (
    "cod" SERIAL NOT NULL,
    "banco" VARCHAR(120),

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "log_sistema" (
    "id" SERIAL NOT NULL,
    "linha" TEXT NOT NULL,
    "operacao" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anexo_evento" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT,
    "descricao" TEXT,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "api_anexo_id" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "evento_id" INTEGER NOT NULL,

    CONSTRAINT "anexo_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conta_diaria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "cpf" VARCHAR(20) NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "tipo_conta" TEXT NOT NULL,
    "agencia" VARCHAR(20) NOT NULL,
    "conta" VARCHAR(20) NOT NULL,
    "participante_id" INTEGER NOT NULL,
    "banco_id" INTEGER NOT NULL,

    CONSTRAINT "conta_diaria_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "solicitacao" (
    "id" SERIAL NOT NULL,
    "datareg" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "justificativa" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cpf_responsavel" TEXT,
    "nome_responsavel" TEXT,
    "cod_lotacao" INTEGER,
    "lotacao" TEXT,
    "login" TEXT,
    "protocolo" TEXT,

    CONSTRAINT "solicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empenho_daofi" (
    "id" SERIAL NOT NULL,
    "datareg" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "saldo_inicial" DOUBLE PRECISION NOT NULL,
    "valor_reservado" DOUBLE PRECISION NOT NULL,
    "valor_pos_reserva" DOUBLE PRECISION,
    "solicitacao_id" INTEGER NOT NULL,
    "acao" TEXT,
    "observacao" TEXT,

    CONSTRAINT "empenho_daofi_pkey" PRIMARY KEY ("id","solicitacao_id")
);

-- CreateTable
CREATE TABLE "tramite" (
    "id" SERIAL NOT NULL,
    "cod_lotacao_origem" INTEGER NOT NULL,
    "lotacao_origem" TEXT NOT NULL,
    "cod_lotacao_destino" INTEGER NOT NULL,
    "lotacao_destino" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solicitacao_id" INTEGER NOT NULL,
    "flag_daof" CHAR(3),

    CONSTRAINT "tramite_pkey" PRIMARY KEY ("id","solicitacao_id")
);

-- CreateTable
CREATE TABLE "log_tramite" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cod_lotacao_origem" INTEGER NOT NULL,
    "lotacao_origem" TEXT NOT NULL,
    "cod_lotacao_destino" INTEGER NOT NULL,
    "lotacao_destino" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tramite_id" INTEGER NOT NULL,

    CONSTRAINT "log_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correcao_solicitacao" (
    "id" SERIAL NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "texto" TEXT,
    "status" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correcao_solicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aeroporto" (
    "id" SERIAL NOT NULL,
    "uf" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL
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
    "pais_id" INTEGER NOT NULL,
    "informacoes" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tem_passagem" CHAR(3),
    "valor_total_inscricao" DOUBLE PRECISION,
    "valor_evento" DOUBLE PRECISION,
    "observacao_valor" TEXT,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_juntos" (
    "id" SERIAL NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "participante_id" INTEGER,
    "data_inicial" TIMESTAMP(3) NOT NULL,
    "data_final" TIMESTAMP(3) NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_juntos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participante" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "matricula" INTEGER,
    "lotacao" TEXT,
    "cargo" TEXT,
    "classe" TEXT,
    "tipo" CHAR(1) NOT NULL,
    "estado_id" INTEGER,
    "cidade_id" INTEGER,
    "endereco" TEXT,
    "recebe_diarias_na_origem" CHAR(3),
    "profissao" TEXT,
    "local_trabalho" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "rg" TEXT,
    "funcao" TEXT,
    "efetivo" TEXT,

    CONSTRAINT "participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_participantes" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "participante_id" INTEGER NOT NULL,

    CONSTRAINT "evento_participantes_pkey" PRIMARY KEY ("id","evento_id","participante_id")
);

-- CreateTable
CREATE TABLE "viagem" (
    "id" SERIAL NOT NULL,
    "origem_id" INTEGER,
    "destino_id" INTEGER,
    "cidade_origem_id" INTEGER,
    "cidade_destino_id" INTEGER,
    "exterior" TEXT,
    "local_exterior" TEXT,
    "pais_id" INTEGER NOT NULL,
    "data_ida" TIMESTAMP(3) NOT NULL,
    "data_volta" TIMESTAMP(3),
    "justificativa" TEXT,
    "viagem_diferente" CHAR(3),
    "data_ida_diferente" TIMESTAMP(3),
    "data_volta_diferente" TIMESTAMP(3),
    "justificativa_diferente" TEXT,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arcar_passagem" CHAR(3),
    "custos" TEXT[],
    "servidor_acompanhando" CHAR(3),
    "viagem_superior" CHAR(3),
    "viagem_pernoite" CHAR(3),
    "justificativa_municipios" TEXT,
    "valor_passagem" DOUBLE PRECISION,
    "solicitacao_id" INTEGER,
    "trecho" TEXT,
    "deslocamento" CHAR(3),

    CONSTRAINT "viagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valor_viagem" (
    "id" SERIAL NOT NULL,
    "viagem_id" INTEGER NOT NULL,
    "tipo" TEXT,
    "destino" TEXT,
    "valor_individual" DOUBLE PRECISION,
    "valor_grupo" DOUBLE PRECISION,
    "cotacao_dolar" DOUBLE PRECISION,
    "justificativa" TEXT,

    CONSTRAINT "valor_viagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viagem_participantes" (
    "id" SERIAL NOT NULL,
    "evento_participantes_id" INTEGER NOT NULL,
    "viagem_id" INTEGER NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viagem_participantes_pkey" PRIMARY KEY ("id","evento_participantes_id","viagem_id")
);

-- CreateTable
CREATE TABLE "valor_diarias" (
    "id" SERIAL NOT NULL,
    "dentro" DOUBLE PRECISION NOT NULL,
    "fora" DOUBLE PRECISION NOT NULL,
    "internacional" DOUBLE PRECISION,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valor_diarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo_diarias" (
    "id" SERIAL NOT NULL,
    "cargo" TEXT NOT NULL,
    "funcao" TEXT,
    "valor_diarias_id" INTEGER NOT NULL,

    CONSTRAINT "cargo_diarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinatura" (
    "id" SERIAL NOT NULL,
    "presidente_exercicio" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" CHAR(3) NOT NULL
);

-- CreateTable
CREATE TABLE "aprovacao_definitiva" (
    "id" SERIAL NOT NULL,
    "assinatura_id" INTEGER NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT NOT NULL,
    "solicitacao_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "condutores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "validade_cnh" TIMESTAMP(3),
    "categoria_cnh" TEXT,
    "matricula" TEXT,
    "celular" TEXT,
    "endereco" TEXT,
    "banco" TEXT,
    "agencia" TEXT,
    "conta" TEXT,
    "tipo" CHAR(1)
);

-- CreateTable
CREATE TABLE "solicitacao_condutores" (
    "id" SERIAL NOT NULL,
    "condutores_id" INTEGER NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "veiculo" TEXT,

    CONSTRAINT "solicitacao_condutores_pkey" PRIMARY KEY ("id","condutores_id","solicitacao_id")
);

-- CreateTable
CREATE TABLE "encaminhar_solicitacao" (
    "id" SERIAL NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario" TEXT NOT NULL,
    "justificativa" TEXT NOT NULL,
    "cod_lotacao_origem" INTEGER NOT NULL,
    "lotacao_origem" TEXT NOT NULL,
    "cod_lotacao_destino" INTEGER NOT NULL,
    "lotacao_destino" TEXT NOT NULL,
    "lido" CHAR(3) NOT NULL,

    CONSTRAINT "encaminhar_solicitacao_pkey" PRIMARY KEY ("id","solicitacao_id")
);

-- CreateTable
CREATE TABLE "organograma" (
    "id" SERIAL NOT NULL,
    "pai_id" INTEGER NOT NULL,
    "pai_nome" TEXT NOT NULL,
    "filho_id" INTEGER NOT NULL,
    "filho_nome" TEXT NOT NULL,

    CONSTRAINT "organograma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinatura_daof" (
    "id" SERIAL NOT NULL,
    "diretor" TEXT NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" CHAR(3) NOT NULL
);

-- CreateTable
CREATE TABLE "aprovacao_definitiva_daof" (
    "id" SERIAL NOT NULL,
    "assinatura_id" INTEGER NOT NULL,
    "datareg" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT NOT NULL,
    "solicitacao_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "diaria_condutor" (
    "id" SERIAL NOT NULL,
    "solicitacao_condutores_id" INTEGER NOT NULL,
    "datareg" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "diaria_condutor_pkey" PRIMARY KEY ("id","solicitacao_condutores_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipo_evento_id_key" ON "tipo_evento"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cidade_id_key" ON "cidade"("id");

-- CreateIndex
CREATE UNIQUE INDEX "empenho_daofi_id_key" ON "empenho_daofi"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tramite_id_key" ON "tramite"("id");

-- CreateIndex
CREATE UNIQUE INDEX "log_tramite_id_key" ON "log_tramite"("id");

-- CreateIndex
CREATE UNIQUE INDEX "correcao_solicitacao_id_key" ON "correcao_solicitacao"("id");

-- CreateIndex
CREATE UNIQUE INDEX "aeroporto_id_key" ON "aeroporto"("id");

-- CreateIndex
CREATE UNIQUE INDEX "eventos_juntos_id_key" ON "eventos_juntos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "evento_participantes_id_key" ON "evento_participantes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "viagem_participantes_id_key" ON "viagem_participantes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "valor_diarias_id_key" ON "valor_diarias"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_diarias_id_key" ON "cargo_diarias"("id");

-- CreateIndex
CREATE UNIQUE INDEX "assinatura_id_key" ON "assinatura"("id");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacao_definitiva_id_key" ON "aprovacao_definitiva"("id");

-- CreateIndex
CREATE UNIQUE INDEX "condutores_id_key" ON "condutores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "solicitacao_condutores_id_key" ON "solicitacao_condutores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "encaminhar_solicitacao_id_key" ON "encaminhar_solicitacao"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organograma_id_key" ON "organograma"("id");

-- CreateIndex
CREATE UNIQUE INDEX "assinatura_daof_id_key" ON "assinatura_daof"("id");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacao_definitiva_daof_id_key" ON "aprovacao_definitiva_daof"("id");

-- CreateIndex
CREATE UNIQUE INDEX "diaria_condutor_id_key" ON "diaria_condutor"("id");

-- AddForeignKey
ALTER TABLE "anexo_evento" ADD CONSTRAINT "anexo_evento_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conta_diaria" ADD CONSTRAINT "conta_diaria_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conta_diaria" ADD CONSTRAINT "conta_diaria_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cidade" ADD CONSTRAINT "cidade_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empenho_daofi" ADD CONSTRAINT "empenho_daofi_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramite" ADD CONSTRAINT "tramite_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_tramite" ADD CONSTRAINT "log_tramite_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcao_solicitacao" ADD CONSTRAINT "correcao_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_tipo_evento_id_fkey" FOREIGN KEY ("tipo_evento_id") REFERENCES "tipo_evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_juntos" ADD CONSTRAINT "eventos_juntos_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_participantes" ADD CONSTRAINT "evento_participantes_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_participantes" ADD CONSTRAINT "evento_participantes_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_origem_id_fkey" FOREIGN KEY ("origem_id") REFERENCES "aeroporto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "aeroporto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_cidade_origem_id_fkey" FOREIGN KEY ("cidade_origem_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_cidade_destino_id_fkey" FOREIGN KEY ("cidade_destino_id") REFERENCES "cidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valor_viagem" ADD CONSTRAINT "valor_viagem_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem_participantes" ADD CONSTRAINT "viagem_participantes_evento_participantes_id_fkey" FOREIGN KEY ("evento_participantes_id") REFERENCES "evento_participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem_participantes" ADD CONSTRAINT "viagem_participantes_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_diarias" ADD CONSTRAINT "cargo_diarias_valor_diarias_id_fkey" FOREIGN KEY ("valor_diarias_id") REFERENCES "valor_diarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva" ADD CONSTRAINT "aprovacao_definitiva_assinatura_id_fkey" FOREIGN KEY ("assinatura_id") REFERENCES "assinatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva" ADD CONSTRAINT "aprovacao_definitiva_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_condutores" ADD CONSTRAINT "solicitacao_condutores_condutores_id_fkey" FOREIGN KEY ("condutores_id") REFERENCES "condutores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_condutores" ADD CONSTRAINT "solicitacao_condutores_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encaminhar_solicitacao" ADD CONSTRAINT "encaminhar_solicitacao_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva_daof" ADD CONSTRAINT "aprovacao_definitiva_daof_assinatura_id_fkey" FOREIGN KEY ("assinatura_id") REFERENCES "assinatura_daof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacao_definitiva_daof" ADD CONSTRAINT "aprovacao_definitiva_daof_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaria_condutor" ADD CONSTRAINT "diaria_condutor_solicitacao_condutores_id_fkey" FOREIGN KEY ("solicitacao_condutores_id") REFERENCES "solicitacao_condutores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
