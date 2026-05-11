import { registerAs } from '@nestjs/config';

export default registerAs('etce', () => ({
  baseUrl: process.env.ETCE_BASE_URL,
  timeoutMs: parseInt(process.env.ETCE_TIMEOUT_MS ?? '30000', 10),
  diaria: {
    codTipoProcesso: parseInt(process.env.ETCE_DIARIA_COD_TIPO_PROCESSO ?? '0', 10),
    codTipoDocumento: parseInt(process.env.ETCE_DIARIA_COD_TIPO_DOCUMENTO ?? '0', 10),
    codArea: parseInt(process.env.ETCE_DIARIA_COD_AREA ?? '1', 10),
    codTipoGrupoProtocolo: parseInt(process.env.ETCE_DIARIA_COD_TIPO_GRUPO_PROTOCOLO ?? '2', 10),
    codTipoEntrada: parseInt(process.env.ETCE_DIARIA_COD_TIPO_ENTRADA ?? '284', 10),
    codTipoMeiaEntrega: parseInt(process.env.ETCE_DIARIA_COD_TIPO_MEIA_ENTREGA ?? '44136', 10),
    codUgTceAp: parseInt(process.env.ETCE_DIARIA_COD_UG_TCE_AP ?? '0', 10),
    codTipoInteressadoServidor: parseInt(process.env.ETCE_DIARIA_COD_TIPO_INTERESSADO_SERVIDOR ?? '189', 10),
    codTipoQualificacaoServidor: parseInt(process.env.ETCE_DIARIA_COD_TIPO_QUALIFICACAO_SERVIDOR ?? '152', 10),
    tipoPessoaFisica: process.env.ETCE_DIARIA_TIPO_PESSOA_FISICA ?? '27',
  },
}));

export type ETceConfig = ReturnType<ReturnType<typeof registerAs>>;