import { Injectable } from '@nestjs/common';
import { CreateEventosJuntoDto } from './dto/create-eventos_junto.dto';
import { UpdateEventosJuntoDto } from './dto/update-eventos_junto.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EventosJuntosService {

  constructor(private readonly prisma: PrismaService) {}

  
  create(createEventosJuntoDto: CreateEventosJuntoDto) {
    return 'This action adds a new eventosJunto';
  }

  findAll() {
    return `This action returns all eventosJuntos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventosJunto`;
  }

  update(id: number, updateEventosJuntoDto: UpdateEventosJuntoDto) {
    return `This action updates a #${id} eventosJunto`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventosJunto`;
  }
}
