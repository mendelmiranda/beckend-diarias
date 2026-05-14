import { registerAs } from '@nestjs/config';

export default registerAs('etce', () => ({
  baseUrl: process.env.ETCE_BASE_URL,
  timeoutMs: parseInt(process.env.ETCE_TIMEOUT_MS ?? '30000', 10),
  /** JWT ou valor já com prefixo `Bearer ` — enviado em todas as chamadas ao e-TCE */
  bearerToken: process.env.ETCE_BEARER_TOKEN?.trim() ?? '',
  /**
   * Path para anexar PDFs após o /gerar (só usado se ETCE_PROTOCOLO_GERAR_COM_DOIS_PDFS_CI_NUM_OFICIO=false).
   * Muitas instalações ASP.NET usam controller em PascalCase; o client tenta fallbacks em 404.
   */
  anexarArquivosPath:
    process.env.ETCE_PROTOCOLO_ANEXAR_PATH?.trim() ??
    '/api/Protocolo/AnexarArquivos',
  /**
   * Se !== 'false', o corpo de `anexarArquivos` vai em camelCase (arquivos, cod_TCE, …),
   * padrão típico do ASP.NET Core. Desative com ETCE_HTTP_JSON_CAMEL_ANEXAR=false se a API exigir PascalCase.
   */
  httpJsonCamelAnexar: process.env.ETCE_HTTP_JSON_CAMEL_ANEXAR?.trim() !== 'false',
  /**
   * !== 'false' (padrão): um único POST /gerar com solicitação + memorando (2 PDFs); C.I. usa nº do ofício (Cod_TCE só existe depois).
   * 'false': gerar só a solicitação e anexar o memorando (C.I. com Cod_TCE) — exige rota de anexo válida no e-TCE.
   */
  protocoloGerarComDoisPdfsNumOficioNoCi:
    process.env.ETCE_PROTOCOLO_GERAR_COM_DOIS_PDFS_CI_NUM_OFICIO?.trim() !==
    'false',
  /** JSON camelCase para binding ASP.NET Core (lista `arquivos`, …). */
  httpJsonCamelGerar: process.env.ETCE_HTTP_JSON_CAMEL_GERAR === 'true',
  /** Rotas extras (vírgula) tentadas ao anexar após 404 na rota principal. */
  anexarArquivosPathCandidatesList: (process.env.ETCE_PROTOCOLO_ANEXAR_PATH_CANDIDATES ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  diaria: {
    codTipoProcesso: parseInt(process.env.ETCE_DIARIA_COD_TIPO_PROCESSO ?? '0', 10),
    /** PDF principal da solicitação (base64 enviado no `gerarProtocolo`) — tipo _documento 1310 */
    codTipoDocumentoSolicitacao: parseInt(
      process.env.ETCE_DIARIA_COD_TIPO_DOCUMENTO_SOLICITACAO ?? '1310',
      10,
    ),
    /** Memorando C.I. gerado e anexado após o protocolo — tipo _documento 368 */
    codTipoDocumentoMemorando: parseInt(
      process.env.ETCE_DIARIA_COD_TIPO_DOCUMENTO_MEMORANDO ??
        process.env.ETCE_DIARIA_COD_TIPO_DOCUMENTO ??
        '368',
      10,
    ),
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