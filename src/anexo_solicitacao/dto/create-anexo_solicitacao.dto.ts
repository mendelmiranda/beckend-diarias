export class CreateAnexoSolicitacaoDto {
    categoria: string;
    descricao: string;
    usuario: string;
    datareg?:   Date;
    api_anexo_id: number;
    filename: string;
    solicitacao_id: number;
}
