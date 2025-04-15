// builders/sections/assinatura.builder.ts
import { Injectable } from '@nestjs/common';
import { Util } from 'src/util/Util';

interface AssinaturaBuilderData {
  solicitacao: any;
  assinatura: any;
}

@Injectable()
export class AssinaturaBuilder {
  build(data: AssinaturaBuilderData): any[] {
    const { solicitacao, assinatura } = data;
    const content = [];

    content.push({ text: "\n" });

    // Formatação da assinatura
    const assinaturaTexto = this.formatarAssinatura(assinatura);

    try {
      content.push(
        {
          style: 'justificativa',
          table: {
            widths: ['*'],
            body: [
              ['DISPONIBILIDADE: DIRETORIA DA AREA ORCAMENTÁRIA FINANCEIRA/DAOFI'],
              [
                solicitacao.empenho_daofi?.map(a => {
                  return [
                    'Data: ' + Util.formataDataNovas(a.datareg), 
                    a.tipo === "D" ? "Diárias 339014" : 
                    a.tipo === "P" ? "Passagens 339033" : 
                    a.tipo === "I" ? "Inscrição/Curso 339039" :
                    a.tipo === "F" ? "\nPessoa Física 339036" : '',
                    'Saldo Inicial: ' + Util.formataValorDiaria(a.saldo_inicial, 'NACIONAL') +
                    '\nValor Reservado: ' + Util.formataValorDiaria(a.valor_reservado, 'NACIONAL') + 
                    '\nValor Pós Reserva: ' + Util.formataValorDiaria(a.valor_pos_reserva ?? 0, 'NACIONAL') + '\n',
                    a.acao === '2072' ? 'AÇÂO 2072 - Planejamento Estratégico 2024 a 2028\n\n' : '' +
                    a.acao === '2446' ? 'AÇÃO 2446 - MANUTENÇÃO E FUNCIONAMENTO DO TCE/AP E DO PRÉDIO ANEXO\n\n' : '' +
                    a.acao === '2445' ? 'AÇÃO 2445 - TREINAMENTO E CAPACITAÇÃO DE RECURSOS HUMANOS\n\n' : '' +
                    '\nObservação: ' + a.observacao
                  ];
                })
              ],
              ['' + assinaturaTexto]
            ]
          }
        }
      );
    } catch(e) {
      console.error('Erro ao montar tabela de disponibilidade:', e);
    }

    return content;
  }

  private formatarAssinatura(assinatura: any): string {
    if (!assinatura?.assinatura_daof) {
      return 'Aguardando assinatura do documento.';
    }
    
    return 'Assinado por: ' + 
           assinatura.assinatura_daof.diretor + 
           ' em ' + 
           Util.formataDataNovas(assinatura.datareg) + 
           ' as ' + 
           assinatura.hora;
  }
}