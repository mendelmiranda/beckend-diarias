export default interface PesquisaSolicitacaoDTO {
    dataInicio?: Date;
    dataFim?: Date;
    cod_lotacao?: number;
    cpf_responsavel?: string;
    tipo_evento_id?: number;
    status?: string;
    numero?: string;
    pagina?: number;
    limite?: number;

    id?: number;
}