# Códigos e-TCE usados na diária

Consulta dos valores de `ETCE_DIARIA_*` no `.env`. Leitura em 4/11/2026 no SQL Server de homologação (`10.10.0.20`, banco `eTCE`).

Esses códigos vão no `POST /api/protocolo/gerar`, montados em `montarPayload` (`src/etce/protocolos.service.ts`).

O nome de algumas variáveis não coincide com o rótulo do cadastro. A coluna **No banco** é o texto gravado em homologação. A coluna **No envio** é o papel que este backend dá ao código.

| Variável | Código | Cadastro | No banco | No envio |
| --- | --- | --- | --- | --- |
| `ETCE_DIARIA_COD_TIPO_PROCESSO` | 80 | `etce.tipo_processo` | **SOLICITAÇÃO** (ativo; `protocolo_area = 1`) | `CodTipoProcesso` |
| `ETCE_DIARIA_COD_TIPO_DOCUMENTO_SOLICITACAO` | 1310 | `etce.tipo_documento` | **ANEXOS** (ativo; `entrada_protocolo = 1`) | `CodTipoDocumento` do PDF principal. O nome enviado do arquivo é `SOLICITAÇÃO DE DIÁRIA` |
| `ETCE_DIARIA_COD_TIPO_DOCUMENTO_MEMORANDO` | 368 | `etce.tipo_documento` | **SOLICITAÇÃO** (ativo; `entrada_protocolo = 1`) | `CodTipoDocumento` do PDF do memorando C.I. |
| `ETCE_DIARIA_COD_AREA` | 1 | `etce.area` | **SERVICO DE PROTOCOLO** (sigla CCPP, ativo) | `CodArea` |
| `ETCE_DIARIA_COD_TIPO_GRUPO_PROTOCOLO` | 2 | sem cadastro | Não há linha correspondente. `etce.grupo_area` está vazia e `etce.protocolo` não tem coluna de tipo de grupo. O código 2 de `comum.tipo_classificacao` é outro registro: **Não Assinado** (grupo 1, Situação Assinatura) | `CodTipoGrupoProtocolo` |
| `ETCE_DIARIA_COD_TIPO_ENTRADA` | 284 | `comum.tipo_classificacao` (grupo 19, Tipo Entrada) | **Documento** (parâmetro 2). O par 283, no mesmo grupo, é **Processo** | `Protocolo.cod_tipo_entrada` |
| `ETCE_DIARIA_COD_TIPO_MEIA_ENTREGA` | 44136 | `comum.tipo_classificacao` (grupo 24, Tipo Meio Entrada) | **API** | `Protocolo.cod_tipo_meia_entrega`. É o meio de entrega; o nome da variável e do campo repetem `meia` |
| `ETCE_DIARIA_COD_UG_TCE_AP` | 2631 | `comum.unidade_gestora` / `comum.pessoa` | sigla **DARAD**, nome **DIRETORIA DA ÁREA ADMINISTRATIVA** | `Protocolo.cod_ug` |
| `ETCE_DIARIA_COD_TIPO_INTERESSADO_SERVIDOR` | 189 | `comum.tipo_classificacao` (grupo 22, Tipo Interessado) | **NENHUM**. No mesmo grupo, servidor está em 222 (**FUNCIONÁRIO/SERVIDOR**) e 254 (**SERVIDOR**) | `Interessados.cod_tipo_interessado` |
| `ETCE_DIARIA_COD_TIPO_QUALIFICACAO_SERVIDOR` | 152 | `comum.tipo_classificacao` (grupo 33, Tipo Qualificação) | **NENHUM** | `Interessados.cod_tipo_qualificacao` |
| `ETCE_DIARIA_TIPO_PESSOA_FISICA` | 27 | `comum.tipo_classificacao` (grupo 30, Tipo Pessoa) | **Física** | `Interessados.tipo_pessoa` (enviado como texto) |

Fora desta lista, o comentário do `.env` cita a UG `7535`: sigla **DESENV**, nome **DIVISÃO DE DESENVOLVIMENTO**. O valor em uso é `2631`.
