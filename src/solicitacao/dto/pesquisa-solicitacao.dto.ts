export default interface PesquisaSolicitacaoDTO {
    dataInicio?: Date;
    dataFim?: Date;
    cod_lotacao?: number;
    cpf_responsavel?: string;
    status?: string;
    numero?: string;

    id?: number;
}