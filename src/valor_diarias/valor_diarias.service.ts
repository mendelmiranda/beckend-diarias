import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorDiariaDto } from './dto/create-valor_diaria.dto';
import { UpdateValorDiariaDto } from './dto/update-valor_diaria.dto';
import { HttpService } from '@nestjs/axios';

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
    return this.prisma.valor_diarias.findMany();
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
}
