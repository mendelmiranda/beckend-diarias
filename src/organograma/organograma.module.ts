import { Module } from '@nestjs/common';
import { OrganogramaService } from './organograma.service';
import { OrganogramaController } from './organograma.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [OrganogramaController],
  providers: [OrganogramaService, PrismaService]
})
export class OrganogramaModule {}
