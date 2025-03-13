import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorDiariaDto } from './dto/create-valor_diaria.dto';
import { UpdateValorDiariaDto } from './dto/update-valor_diaria.dto';
import { HttpService } from '@nestjs/axios';
import { Util } from 'src/util/Util';
import { InfoUsuario, LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { Operacao } from 'src/log_sistema/log_enum';

@Injectable()
export class ValorDiariasService {
  constructor(private prisma: PrismaService,
    private readonly httpService: HttpService, private logSistemaService: LogSistemaService) {}
  
  async create(dto: CreateValorDiariaDto) {   
    return this.prisma.valor_diarias.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.valor_diarias.findMany({
      where: {},
      include: {
        cargo_diarias: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} valorDiaria`;
  }

  async update(id: number, updateValorDiariaDto: UpdateValorDiariaDto, usuario: InfoUsuario) {
    try {
      
      // Cria o log da operação
      await this.logSistemaService.createLog(updateValorDiariaDto, usuario, Operacao.UPDATE);
      
      // Extrai os dados de cargo_diarias e demais campos
      const { cargo_diarias, ...dadosBasicos } = updateValorDiariaDto;
      
      // Atualiza a entidade principal sem incluir os relacionamentos
      const resultado = await this.prisma.valor_diarias.update({
        where: { id },
        data: dadosBasicos,
      });
      
      // Se precisar atualizar os relacionamentos de cargo_diarias,
      // você precisará fazer isso em operações separadas
      
      return resultado;
    } catch (e) {
      console.log(e);
      throw new HttpException('Erro ao atualizar valor de diária', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: number) {
    return this.prisma.valor_diarias.delete({
      where: {
        id: id
      }
    });
  }

  consultarCotacao() { 
    return this.httpService.axiosRef.get("https://economia.awesomeapi.com.br/json/last/USD")
    .then((result) => result.data)
    .then(data => data.USDBRL);
  }

  consultarCotacaoBancoCentral() {
    const dtInicial = new Date();
    let dtFinal = Util.subtractDays(dtInicial, 1);

    if (dtInicial.getDay() === 0 || dtInicial.getDay() === 6) {
      dtFinal = Util.subtractDays(dtInicial, 2);
    }

    const url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='" + Util.formataDataAmericanaComParametro(dtFinal) + "'&@dataFinalCotacao='" + Util.formataDataAmericana() + "'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao";

    return this.httpService.axiosRef.get(url)
      .then((result) => result.data)
      .then(data => data.value[0]);
  }

  consultarCotacaoBancoCentralComData(data: string) {
    const url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='" + 
    Util.formataDataAmericanaComParametro(new Date(data)) + "'&@dataFinalCotacao='" + Util.formataDataAmericana() + "'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao";

    return this.httpService.axiosRef.get(url)
      .then((result) => result.data)
      .then(data => data.value[0]);
  }

}
