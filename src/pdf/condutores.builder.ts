// builders/sections/condutores.builder.ts
import { Injectable } from '@nestjs/common';
import { formataDataCurta, Util } from 'src/util/Util';

interface CondutoresBuilderData {
  condutores: any[];
}

@Injectable()
export class CondutoresBuilder {
  build(data: CondutoresBuilderData): any[] {
    const { condutores } = data;
    const content = [];
    let totalDiariaCondutor = 0;

    if (!condutores || condutores.length === 0) {
      return content;
    }

    // Renderiza cada condutor
    condutores.forEach((condutor, index) => {
      content.push({ text: '\n' });

      if (condutor.condutores?.tipo === "S") {
        // Se for servidor/motorista particular
        content.push(
          {
            text: "SERVIDOR/MOTORISTA PARTICULAR \n",
            style: "titulos",
          },
          {
            text:
              "Nome: " +
              condutor.condutores.nome +
              " CPF: " +
              condutor.condutores.cpf,
            style: "textos",
          },
          {
            text: "*Dados bancários nas informações de participantes \n\n",
            style: "textos",
          }
        );
      } else {
        // Se for condutor regular
        let valorDiaria = 0;

        // Calcula diárias do condutor
        if (condutor?.diaria_condutor) {
          condutor.diaria_condutor.forEach((diaria) => {
            valorDiaria = diaria.valor;
            totalDiariaCondutor += valorDiaria;
          });
        }

        // Monta bloco de informações do condutor
        content.push({
          style: "textoEmp",
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'INFORMAÇÕES DO CONDUTOR: DIRETORIA AREA ADMINISTRATIVA',
                  style: 'texto',
                }
              ],
              [
                "Nome: " + (condutor?.condutores?.nome.toUpperCase()) + " CPF: " + (condutor?.condutores?.cpf) + '\n' + 
                "Matricula: " + condutor?.condutores?.matricula + '\n' +
                "Validade CNH: " + formataDataCurta(condutor.condutores?.validade_cnh as Date) + " Categoria: " + condutor.condutores?.categoria_cnh + '\n' +
                "Celular: " + condutor.condutores?.celular + '\n' + 
                "Endereço: " + condutor.condutores?.endereco + '\n' + 
                "Agencia: " + condutor.condutores?.agencia + '\n' + 
                "CC: " + condutor.condutores?.conta + " Banco: " + condutor.condutores?.banco + "\n \n" + 
                "Diária Condutor: " + Util.formataValorDiaria(valorDiaria, "NACIONAL") + "\n" +
                "Veículo: " + condutor.veiculo + "\n\n"
              ]
            ],
          },
        });
      }
    });

    return content;
  }
}