import { Injectable } from '@nestjs/common';
import { CreateAssinaturaDaradDto } from './dto/create-assinatura_darad.dto';
import { UpdateAssinaturaDaradDto } from './dto/update-assinatura_darad.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AssinaturaDaradService {

  constructor(private readonly prisma: PrismaService) {}

  create(createAssinaturaDaradDto: CreateAssinaturaDaradDto) {
    return 'This action adds a new assinaturaDarad';
  }

  findAll() {
    return `This action returns all assinaturaDarad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assinaturaDarad`;
  }

  update(id: number, updateAssinaturaDaradDto: UpdateAssinaturaDaradDto) {
    return `This action updates a #${id} assinaturaDarad`;
  }

  remove(id: number) {
    return `This action removes a #${id} assinaturaDarad`;
  }
}
