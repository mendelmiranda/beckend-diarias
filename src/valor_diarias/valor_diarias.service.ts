import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorDiariaDto } from './dto/create-valor_diaria.dto';
import { UpdateValorDiariaDto } from './dto/update-valor_diaria.dto';
import { HttpService } from '@nestjs/axios';
import { Util } from 'src/util/Util';

@Injectable()
export class ValorDiariasService {
  constructor(private prisma: PrismaService,
    private readonly httpService: HttpService ) {}
  
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

  update(id: number, updateValorDiariaDto: UpdateValorDiariaDto) {
    return `This action updates a #${id} valorDiaria`;
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
